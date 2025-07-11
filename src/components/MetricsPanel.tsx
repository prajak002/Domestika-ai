'use client';

import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, Users, Zap, Eye, Heart, MessageSquare, Share2 } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ComposedChart, Bar, Area, AreaChart, PieChart, Pie, Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';

const northStarData = [
  { month: 'Jan', actions: 120, learners: 1250, retention: 78 },
  { month: 'Feb', actions: 145, learners: 1380, retention: 82 },
  { month: 'Mar', actions: 168, learners: 1520, retention: 85 },
  { month: 'Apr', actions: 192, learners: 1650, retention: 87 },
  { month: 'May', actions: 215, learners: 1820, retention: 89 },
  { month: 'Jun', actions: 238, learners: 1950, retention: 91 },
];

const engagementMetrics = [
  { metric: 'Course Completion', current: 78, target: 85, benchmark: 70 },
  { metric: 'Practice Frequency', current: 82, target: 90, benchmark: 65 },
  { metric: 'Community Participation', current: 65, target: 75, benchmark: 55 },
  { metric: 'Feedback Quality', current: 88, target: 92, benchmark: 75 },
  { metric: 'Content Satisfaction', current: 85, target: 90, benchmark: 80 },
];

const guardrailsData = [
  { week: 'W1', safetyViolations: 2, feedbackLatency: 1.2, contentQuality: 92 },
  { week: 'W2', safetyViolations: 1, feedbackLatency: 0.8, contentQuality: 94 },
  { week: 'W3', safetyViolations: 0, feedbackLatency: 0.9, contentQuality: 96 },
  { week: 'W4', safetyViolations: 1, feedbackLatency: 0.7, contentQuality: 95 },
];

const userJourneyData = [
  { stage: 'Discovery', users: 10000, conversion: 45 },
  { stage: 'Trial', users: 4500, conversion: 62 },
  { stage: 'Onboarding', users: 2790, conversion: 78 },
  { stage: 'First Course', users: 2176, conversion: 85 },
  { stage: 'Community Join', users: 1850, conversion: 72 },
  { stage: 'Practice Regular', users: 1332, conversion: 88 },
];

const contentPerformance = [
  { category: 'Digital Art', engagement: 92, completion: 78, satisfaction: 4.6 },
  { category: 'Photography', engagement: 88, completion: 82, satisfaction: 4.4 },
  { category: 'Design', engagement: 95, completion: 85, satisfaction: 4.8 },
  { category: 'Illustration', engagement: 90, completion: 75, satisfaction: 4.5 },
  { category: 'Animation', engagement: 85, completion: 70, satisfaction: 4.3 },
];

const aiInsights = [
  {
    type: 'trend',
    title: 'Rising Interest in AI Art',
    description: 'AI-assisted creative tools showing 340% growth in engagement',
    impact: 'high',
    confidence: 94
  },
  {
    type: 'opportunity',
    title: 'Typography Gap',
    description: 'Learners struggling with advanced typography concepts',
    impact: 'medium',
    confidence: 87
  },
  {
    type: 'risk',
    title: 'Community Fatigue',
    description: 'Decrease in forum participation among long-term users',
    impact: 'medium',
    confidence: 82
  },
  {
    type: 'success',
    title: 'Feedback Loop Working',
    description: 'AI-powered feedback correlates with 23% faster skill development',
    impact: 'high',
    confidence: 96
  }
];

const COLORS = ['#8B5CF6', '#3B82F6', '#10B981', '#F59E0B', '#EF4444'];

export default function MetricsPanel() {
  return (
    <div className="space-y-8">
      {/* North Star Metrics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
      >
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
          <BarChart3 className="h-6 w-6 mr-3 text-purple-500" />
          North Star Metrics
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-6 text-white">
            <h3 className="text-lg font-semibold mb-2">Weekly Creative Actions</h3>
            <p className="text-3xl font-bold">238</p>
            <p className="text-purple-200 text-sm">per active learner</p>
            <div className="flex items-center mt-2">
              <TrendingUp className="h-4 w-4 mr-1" />
              <span className="text-sm">+24% vs last month</span>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white">
            <h3 className="text-lg font-semibold mb-2">Active Learners</h3>
            <p className="text-3xl font-bold">1,950</p>
            <p className="text-blue-200 text-sm">monthly active users</p>
            <div className="flex items-center mt-2">
              <Users className="h-4 w-4 mr-1" />
              <span className="text-sm">+18% growth</span>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-6 text-white">
            <h3 className="text-lg font-semibold mb-2">Retention Rate</h3>
            <p className="text-3xl font-bold">91%</p>
            <p className="text-green-200 text-sm">30-day retention</p>
            <div className="flex items-center mt-2">
              <Heart className="h-4 w-4 mr-1" />
              <span className="text-sm">+3% vs target</span>
            </div>
          </div>
        </div>
        
        <ResponsiveContainer width="100%" height={300}>
          <ComposedChart data={northStarData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis yAxisId="left" />
            <YAxis yAxisId="right" orientation="right" />
            <Tooltip />
            <Bar yAxisId="left" dataKey="actions" fill="#8B5CF6" name="Weekly Actions" />
            <Line yAxisId="right" type="monotone" dataKey="retention" stroke="#10B981" strokeWidth={3} name="Retention %" />
          </ComposedChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Engagement & Guardrails */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
        >
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
            <Zap className="h-6 w-6 mr-3 text-yellow-500" />
            Engagement Metrics
          </h3>
          
          <div className="space-y-4">
            {engagementMetrics.map((metric, index) => (
              <div key={`metric-${index}-${metric.metric}`} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-700 dark:text-gray-300">{metric.metric}</span>
                  <span className="text-gray-500 dark:text-gray-400">
                    {metric.current}% / {metric.target}%
                  </span>
                </div>
                <div className="relative">
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                    <motion.div
                      className="bg-blue-500 h-3 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${metric.current}%` }}
                      transition={{ duration: 1, delay: 0.1 * index }}
                    />
                  </div>
                  <div
                    className="absolute top-0 w-0.5 h-3 bg-green-500"
                    style={{ left: `${metric.target}%` }}
                  />
                  <div
                    className="absolute top-0 w-0.5 h-3 bg-gray-400"
                    style={{ left: `${metric.benchmark}%` }}
                  />
                </div>
                <div className="flex text-xs text-gray-500 dark:text-gray-400">
                  <span>Benchmark: {metric.benchmark}%</span>
                  <span className="ml-auto">Target: {metric.target}%</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
        >
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
            <Eye className="h-6 w-6 mr-3 text-red-500" />
            Guardrails & Safety
          </h3>
          
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={guardrailsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="safetyViolations"
                stroke="#EF4444"
                strokeWidth={2}
                name="Safety Violations"
              />
              <Line
                type="monotone"
                dataKey="feedbackLatency"
                stroke="#F59E0B"
                strokeWidth={2}
                name="Feedback Latency (s)"
              />
            </LineChart>
          </ResponsiveContainer>
          
          <div className="mt-4 grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-green-600">99.2%</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Content Safety</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-blue-600">0.9s</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Avg Response</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-purple-600">94%</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Quality Score</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* User Journey & Content Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
        >
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            User Journey Funnel
          </h3>
          
          <div className="space-y-3">
            {userJourneyData.map((stage, index) => (
              <motion.div
                key={`stage-${index}-${stage.stage}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
                className="relative"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {stage.stage}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {stage.users.toLocaleString()} users ({stage.conversion}%)
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <motion.div
                    className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${stage.conversion}%` }}
                    transition={{ duration: 1, delay: 0.2 * index }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
        >
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            Content Performance
          </h3>
          
          <ResponsiveContainer width="100%" height={250}>
            <RadarChart data={contentPerformance}>
              <PolarGrid />
              <PolarAngleAxis dataKey="category" />
              <PolarRadiusAxis domain={[0, 100]} />
              <Radar
                name="Engagement"
                dataKey="engagement"
                stroke="#8B5CF6"
                fill="#8B5CF6"
                fillOpacity={0.3}
              />
              <Radar
                name="Completion"
                dataKey="completion"
                stroke="#3B82F6"
                fill="#3B82F6"
                fillOpacity={0.2}
              />
            </RadarChart>
          </ResponsiveContainer>
          
          <div className="mt-4 flex justify-center space-x-6 text-sm">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-purple-500 rounded-full mr-2"></div>
              <span className="text-gray-600 dark:text-gray-400">Engagement</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
              <span className="text-gray-600 dark:text-gray-400">Completion</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* AI Insights */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
      >
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
          <Zap className="h-6 w-6 mr-3 text-purple-500" />
          AI-Powered Insights
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {aiInsights.map((insight, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 * index }}
              className={`p-4 rounded-lg border-l-4 ${
                insight.type === 'trend' ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-500' :
                insight.type === 'opportunity' ? 'bg-green-50 dark:bg-green-900/20 border-green-500' :
                insight.type === 'risk' ? 'bg-red-50 dark:bg-red-900/20 border-red-500' :
                'bg-purple-50 dark:bg-purple-900/20 border-purple-500'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                    {insight.title}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    {insight.description}
                  </p>
                  <div className="flex items-center space-x-3">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      insight.impact === 'high' ? 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300' :
                      'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300'
                    }`}>
                      {insight.impact} impact
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {insight.confidence}% confidence
                    </span>
                  </div>
                </div>
                <div className={`p-2 rounded-lg ${
                  insight.type === 'trend' ? 'bg-blue-500' :
                  insight.type === 'opportunity' ? 'bg-green-500' :
                  insight.type === 'risk' ? 'bg-red-500' :
                  'bg-purple-500'
                }`}>
                  {insight.type === 'trend' ? <TrendingUp className="h-4 w-4 text-white" /> :
                   insight.type === 'opportunity' ? <Eye className="h-4 w-4 text-white" /> :
                   insight.type === 'risk' ? <MessageSquare className="h-4 w-4 text-white" /> :
                   <Heart className="h-4 w-4 text-white" />}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Operations Dashboard */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.7 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
      >
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
          Operations Health
        </h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="bg-green-100 dark:bg-green-900 p-4 rounded-lg mb-2">
              <Zap className="h-8 w-8 text-green-600 mx-auto" />
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">99.9%</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">AI Uptime</p>
          </div>
          
          <div className="text-center">
            <div className="bg-blue-100 dark:bg-blue-900 p-4 rounded-lg mb-2">
              <BarChart3 className="h-8 w-8 text-blue-600 mx-auto" />
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">2.3s</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Avg Response</p>
          </div>
          
          <div className="text-center">
            <div className="bg-purple-100 dark:bg-purple-900 p-4 rounded-lg mb-2">
              <Users className="h-8 w-8 text-purple-600 mx-auto" />
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">847</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Support Tickets</p>
          </div>
          
          <div className="text-center">
            <div className="bg-yellow-100 dark:bg-yellow-900 p-4 rounded-lg mb-2">
              <Heart className="h-8 w-8 text-yellow-600 mx-auto" />
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">4.7</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">User Rating</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
