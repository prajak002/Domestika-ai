'use client';

import { motion } from 'framer-motion';
import { Brain, Palette, Users, BarChart3 } from 'lucide-react';

export default function Header() {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50"
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-purple-500 to-blue-500 p-2 rounded-lg">
              <Brain className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Domestika AI
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Creative Assistant
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Palette className="h-5 w-5 text-purple-500" />
                <span className="text-sm text-gray-600 dark:text-gray-400">Create</span>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-blue-500" />
                <span className="text-sm text-gray-600 dark:text-gray-400">Share</span>
              </div>
              <div className="flex items-center space-x-2">
                <BarChart3 className="h-5 w-5 text-green-500" />
                <span className="text-sm text-gray-600 dark:text-gray-400">Analyze</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.header>
  );
}
