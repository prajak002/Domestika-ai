'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Header from '@/components/Header';
import PersonalizedLearning from '@/components/PersonalizedLearning';
import AICoCreation from '@/components/AICoCreation';
import Dashboard from '@/components/Dashboard';
import MetricsPanel from '@/components/MetricsPanel';

export default function Home() {
  const [activeTab, setActiveTab] = useState('learning');

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-purple-900 dark:to-indigo-900">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">
            Domestika AI Creative Assistant
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Enhance your creative journey with personalized learning, AI co-creation, and community sharing
          </p>
        </motion.div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-4 w-full max-w-2xl mx-auto mb-8 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm">
            <TabsTrigger value="learning" className="data-[state=active]:bg-purple-500 data-[state=active]:text-white">
              Personalized Learning
            </TabsTrigger>
            <TabsTrigger value="cocreation" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">
              AI Co-Creation
            </TabsTrigger>
            <TabsTrigger value="dashboard" className="data-[state=active]:bg-green-500 data-[state=active]:text-white">
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="metrics" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white">
              Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="learning" className="mt-0">
            <motion.div
              key="learning"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <PersonalizedLearning />
            </motion.div>
          </TabsContent>

          <TabsContent value="cocreation" className="mt-0">
            <motion.div
              key="cocreation"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <AICoCreation />
            </motion.div>
          </TabsContent>

          <TabsContent value="dashboard" className="mt-0">
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Dashboard />
            </motion.div>
          </TabsContent>

          <TabsContent value="metrics" className="mt-0">
            <motion.div
              key="metrics"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <MetricsPanel />
            </motion.div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
