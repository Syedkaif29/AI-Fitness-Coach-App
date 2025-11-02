'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';
import { getDailyQuote } from '@/lib/quotes';

export default function DailyQuote() {
  const [quote, setQuote] = useState({ quote: '', author: '' });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const loadQuote = async () => {
      setMounted(true);
      const dailyQuote = await getDailyQuote();
      setQuote(dailyQuote);
    };

    loadQuote();
  }, []);

  // Don't render anything until mounted and quote is loaded to avoid hydration mismatch
  if (!mounted || !quote.quote) {
    return (
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-6 rounded-lg shadow-lg mb-8 h-24 animate-pulse" />
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-6 rounded-lg shadow-lg mb-8"
    >
      <div className="flex items-start gap-4">
        <Quote size={32} className="flex-shrink-0 mt-1" />
        <div>
          <p className="text-lg italic mb-2">&ldquo;{quote.quote}&rdquo;</p>
          <p className="text-sm opacity-90">— {quote.author}</p>
        </div>
      </div>
    </motion.div>
  );
}
