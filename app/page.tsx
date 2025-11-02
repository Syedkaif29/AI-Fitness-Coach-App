'use client';

import { useState, useEffect } from 'react';
import { UserProfile, FitnessPlan } from '@/types';
import UserForm from '@/components/UserForm';
import FitnessPlanDisplay from '@/components/FitnessPlanDisplay';
import DailyQuote from '@/components/DailyQuote';
import ThemeToggle from '@/components/ThemeToggle';
import { generateFitnessPlan } from '@/lib/gemini';
import { savePlan, loadPlan, saveProfile, loadProfile } from '@/lib/storage';
import { motion } from 'framer-motion';
import { Dumbbell } from 'lucide-react';

export default function Home() {
  const [step, setStep] = useState<'form' | 'plan'>('form');
  const [plan, setPlan] = useState<FitnessPlan | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedPlan = loadPlan();
    const savedProfile = loadProfile();
    
    if (savedPlan && savedProfile) {
      setPlan(savedPlan);
      setProfile(savedProfile);
      setStep('plan');
    }
  }, []);

  const handleFormSubmit = async (userProfile: UserProfile) => {
    setLoading(true);
    try {
      const generatedPlan = await generateFitnessPlan(userProfile);
      setPlan(generatedPlan);
      setProfile(userProfile);
      savePlan(generatedPlan);
      saveProfile(userProfile);
      setStep('plan');
    } catch (error) {
      console.error('Error generating plan:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      alert(`Failed to generate fitness plan:\n\n${errorMessage}\n\nPlease check:\n1. Your Gemini API key is configured in .env.local\n2. The API key is valid\n3. You have API quota remaining`);
    } finally {
      setLoading(false);
    }
  };

  const handleRegenerate = () => {
    setStep('form');
    setPlan(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 transition-colors">
      <ThemeToggle />
      
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <Dumbbell size={48} className="text-blue-600" />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              AI Fitness Coach
            </h1>
          </div>
          <p className="text-xl font-bold text-gray-600 dark:text-gray-300">
            Your Personalized Workout & Diet Plan Generator
          </p>
        </motion.div>

        <DailyQuote />

        {loading && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-xl text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
              <p className="text-xl font-semibold">Generating your personalized plan...</p>
              <p className="text-gray-600 dark:text-gray-300 mt-2">This may take a moment</p>
            </div>
          </div>
        )}

        {mounted && step === 'form' && !loading && (
          <UserForm onSubmit={handleFormSubmit} initialData={profile} />
        )}

        {mounted && step === 'plan' && plan && !loading && (
          <FitnessPlanDisplay plan={plan} onRegenerate={handleRegenerate} />
        )}

        {!mounted && (
          <div className="flex justify-center items-center h-64">
            <div className="animate-pulse bg-gray-200 dark:bg-gray-700 rounded-lg w-full max-w-2xl h-48"></div>
          </div>
        )}
      </div>

      <footer className="text-center py-8 text-gray-600 dark:text-gray-400">
        <p>Powered by Google Gemini AI & ElevenLabs</p>
      </footer>
    </div>
  );
}
