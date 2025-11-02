'use client';

import { useState } from 'react';
import { FitnessPlan } from '@/types';
import { motion } from 'framer-motion';
import { Dumbbell, Utensils, Lightbulb, Heart, Volume2, Download, RefreshCw } from 'lucide-react';
import { textToSpeech } from '@/lib/elevenlabs';
import { generateImage } from '@/lib/gemini';
import jsPDF from 'jspdf';
import Image from 'next/image';

interface FitnessPlanDisplayProps {
  plan: FitnessPlan;
  onRegenerate: () => void;
}

export default function FitnessPlanDisplay({ plan, onRegenerate }: FitnessPlanDisplayProps) {
  const [activeTab, setActiveTab] = useState<'workout' | 'diet'>('workout');
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [loadingImage, setLoadingImage] = useState(false);
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);

  const handleSpeak = async (type: 'workout' | 'diet') => {
    // If already playing, stop the current audio
    if (isPlaying && currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
      setIsPlaying(false);
      setCurrentAudio(null);
      return;
    }

    setIsPlaying(true);
    try {
      let text = '';

      if (type === 'workout') {
        text = 'Your Workout Plan: ';
        plan.workoutPlan.forEach((day) => {
          text += `${day.day}. `;
          day.exercises.forEach((ex) => {
            text += `${ex.name}, ${ex.sets} sets of ${ex.reps} reps, rest ${ex.restTime}. `;
          });
        });
      } else {
        text = 'Your Diet Plan: ';
        plan.dietPlan.meals.forEach((meal) => {
          text += `${meal.mealType}: ${meal.items.join(', ')}. `;
        });
      }

      const audioBlob = await textToSpeech(text);
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);

      setCurrentAudio(audio);

      audio.onended = () => {
        setIsPlaying(false);
        setCurrentAudio(null);
      };

      audio.onerror = () => {
        setIsPlaying(false);
        setCurrentAudio(null);
      };

      await audio.play();
    } catch (error) {
      console.error('Error playing audio:', error);
      alert('Voice feature requires ElevenLabs API key');
      setIsPlaying(false);
      setCurrentAudio(null);
    }
  };

  const handleImageGeneration = async (prompt: string) => {
    setLoadingImage(true);
    try {
      const imageUrl = await generateImage(prompt);
      setSelectedImage(imageUrl);
    } catch (error) {
      console.error('Error generating image:', error);
    } finally {
      setLoadingImage(false);
    }
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    let yPos = 20;

    doc.setFontSize(20);
    doc.text('Your Personalized Fitness Plan', 20, yPos);
    yPos += 15;

    doc.setFontSize(16);
    doc.text('Workout Plan', 20, yPos);
    yPos += 10;

    doc.setFontSize(10);
    plan.workoutPlan.forEach((day) => {
      doc.text(day.day, 20, yPos);
      yPos += 5;
      day.exercises.forEach((ex) => {
        doc.text(`- ${ex.name}: ${ex.sets} sets x ${ex.reps}`, 25, yPos);
        yPos += 5;
        if (yPos > 270) {
          doc.addPage();
          yPos = 20;
        }
      });
      yPos += 5;
    });

    doc.setFontSize(16);
    doc.text('Diet Plan', 20, yPos);
    yPos += 10;

    doc.setFontSize(10);
    plan.dietPlan.meals.forEach((meal) => {
      doc.text(`${meal.mealType}:`, 20, yPos);
      yPos += 5;
      meal.items.forEach((item) => {
        doc.text(`- ${item}`, 25, yPos);
        yPos += 5;
        if (yPos > 270) {
          doc.addPage();
          yPos = 20;
        }
      });
      yPos += 5;
    });

    doc.save('fitness-plan.pdf');
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-6xl mx-auto p-6"
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">Your Personalized Plan</h2>
        <div className="flex gap-2">
          <button
            onClick={exportToPDF}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg"
          >
            <Download size={20} />
            Export PDF
          </button>
          <button
            onClick={onRegenerate}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg"
          >
            <RefreshCw size={20} />
            Regenerate
          </button>
        </div>
      </div>

      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setActiveTab('workout')}
          className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-colors ${activeTab === 'workout'
            ? 'bg-blue-600 text-white'
            : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
        >
          <Dumbbell size={20} />
          Workout Plan
        </button>
        <button
          onClick={() => setActiveTab('diet')}
          className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-colors ${activeTab === 'diet'
            ? 'bg-blue-600 text-white'
            : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
        >
          <Utensils size={20} />
          Diet Plan
        </button>
        <button
          onClick={() => handleSpeak(activeTab)}
          className="flex items-center gap-2 px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors"
        >
          <Volume2 size={20} />
          {isPlaying ? 'Stop Reading' : 'Read My Plan'}
        </button>
      </div>

      {activeTab === 'workout' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {plan.workoutPlan.map((day, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg"
            >
              <h3 className="text-xl font-bold mb-4">{day.day}</h3>
              {day.exercises.map((exercise, exIdx) => (
                <div
                  key={exIdx}
                  className="mb-4 p-3 bg-gray-50 dark:bg-gray-700 rounded cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                  onClick={() => handleImageGeneration(exercise.name)}
                >
                  <h4 className="font-semibold">{exercise.name}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {exercise.sets} sets × {exercise.reps}
                  </p>
                  <p className="text-sm text-gray-500">Rest: {exercise.restTime}</p>
                </div>
              ))}
            </motion.div>
          ))}
        </div>
      )}

      {activeTab === 'diet' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {plan.dietPlan.meals.map((meal, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg"
            >
              <h3 className="text-xl font-bold mb-4">{meal.mealType}</h3>
              {meal.calories && (
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">{meal.calories}</p>
              )}
              <ul className="space-y-2">
                {meal.items.map((item, itemIdx) => (
                  <li
                    key={itemIdx}
                    className="p-2 bg-gray-50 dark:bg-gray-700 rounded cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                    onClick={() => handleImageGeneration(item)}
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      )}

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 rounded-lg text-white">
          <div className="flex items-center gap-2 mb-4">
            <Lightbulb size={28} />
            <h3 className="text-2xl font-extrabold tracking-wide">Tips & Advice</h3>
          </div>
          <ul className="space-y-2">
            {plan.tips.map((tip, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-yellow-300">•</span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-gradient-to-r from-pink-500 to-red-600 p-6 rounded-lg text-white">
          <div className="flex items-center gap-2 mb-4">
            <Heart size={28} />
            <h3 className="text-2xl font-extrabold tracking-wide">Motivation</h3>
          </div>
          <p className="text-lg italic">{plan.motivation}</p>
        </div>
      </div>

      {selectedImage && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-2xl" onClick={(e) => e.stopPropagation()}>
            <Image src={selectedImage} alt="Generated" width={800} height={600} className="rounded-lg" />
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-2 right-2 bg-white hover:bg-gray-100 text-black px-3 py-1 rounded-full shadow-lg font-semibold transition-colors z-10"
            >
              ✕
            </button>
          </div>
        </motion.div>
      )}

      {loadingImage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-xl text-center max-w-md">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
            <h3 className="text-xl font-semibold mb-2">Generating Image</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Using Gemini AI to create a visual representation...
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              This may take a few moments
            </p>
          </div>
        </div>
      )}
    </motion.div>
  );
}
