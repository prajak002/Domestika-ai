'use client';

import { motion } from 'framer-motion';
import { TrendingUp, Users, Award, Clock, Target, Zap, BookOpen, Palette, Brain, Activity, Star } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { useState, useEffect } from 'react';
import { dynamicDataStore, DashboardMetrics, AIInsights } from '../lib/dynamicDataStore';
import { advancedMistralService } from '../lib/advancedMistralService';

export default function Dashboard() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [realTimeData, setRealTimeData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [aiInsights, setAiInsights] = useState<AIInsights | null>(null);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setIsLoading(true);
        // Use a default user id for demo purposes
        const userId = 'user_1';
        // Load comprehensive dashboard metrics
        const dashboardMetrics = await dynamicDataStore.getDashboardMetrics(userId);
        setMetrics(dashboardMetrics);
        setAiInsights(dashboardMetrics.aiInsights);
        // Load real-time platform data
        const realTime = await dynamicDataStore.getRealTimeMetrics();
        setRealTimeData(realTime);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadDashboardData();
    // Set up real-time updates
    const interval = setInterval(async () => {
      try {
        const realTime = await dynamicDataStore.getRealTimeMetrics();
        setRealTimeData(realTime);
      } catch (error) {
        console.error('Failed to update real-time data:', error);
      }
    }, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, []);

  if (isLoading || !metrics) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-2 border-purple-500 border-t-transparent"></div>
        <span className="ml-3 text-gray-600 dark:text-gray-300">Loading AI-powered insights...</span>
      </div>
    );
  }

  const COLORS = ['#8B5CF6', '#3B82F6', '#10B981', '#F59E0B', '#EF4444'];

  return (
    <div className="space-y-8">
      {/* AI Insights Banner */}
      {aiInsights && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl p-6 text-white"
        >
          <div className="flex items-center mb-4">
            <Brain className="h-8 w-8 mr-3" />
            <h2 className="text-2xl font-bold">AI Learning Insights</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <h4 className="font-semibold mb-2 flex items-center">
                <TrendingUp className="h-4 w-4 mr-1" />
                Learning Trends
              </h4>
              <ul className="text-sm space-y-1">
                {(metrics.aiInsights?.learningTrends || []).map((trend: string, index: number) => (
                  <li key={index} className="text-purple-100">• {trend}</li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2 flex items-center">
                <Target className="h-4 w-4 mr-1" />
                Recommendations
              </h4>
              <ul className="text-sm space-y-1">
                {(metrics.aiInsights?.recommendations || []).slice(0, 3).map((rec: string, index: number) => (
                  <li key={index} className="text-blue-100">• {rec}</li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2 flex items-center">
                <Star className="h-4 w-4 mr-1" />
                Strengths
              </h4>
              <ul className="text-sm space-y-1">
                {(metrics.aiInsights?.strengths || []).map((strength: string, index: number) => (
                  <li key={index} className="text-green-100">• {strength}</li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>
      )}

      {/* Real-time Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">Total Learning Hours</p>
              <p className="text-3xl font-bold">{metrics.totalHours}</p>
              <p className="text-purple-200 text-sm">
                {realTimeData?.practiceMinutes ? `+${Math.floor(realTimeData.practiceMinutes / 60)} today` : '+12 this week'}
              </p>
            </div>
            <Clock className="h-12 w-12 text-purple-200" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Courses Completed</p>
              <p className="text-3xl font-bold">{metrics.coursesCompleted}</p>
              <p className="text-blue-200 text-sm">
                {realTimeData?.coursesCompleted ? `${realTimeData.coursesCompleted} today` : '2 in progress'}
              </p>
            </div>
            <BookOpen className="h-12 w-12 text-blue-200" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Community Rank</p>
              <p className="text-3xl font-bold">#{metrics.communityRank}</p>
              <p className="text-green-200 text-sm">
                {realTimeData?.activeUsers ? `${realTimeData.activeUsers} online` : 'Top 15%'}
              </p>
            </div>
            <TrendingUp className="h-12 w-12 text-green-200" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl p-6 text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm">Achievements</p>
              <p className="text-3xl font-bold">{metrics.achievements}</p>
              <p className="text-orange-200 text-sm">
                {realTimeData?.communityInteractions ? `${realTimeData.communityInteractions} interactions` : '4 this month'}
              </p>
            </div>
            <Award className="h-12 w-12 text-orange-200" />
          </div>
        </motion.div>
      </div>

      {/* Learning Progress & Skill Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
        >
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
            <Activity className="h-6 w-6 mr-2 text-purple-500" />
            Learning Progress
          </h3>
          
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={metrics.weeklyProgress}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" />
              <YAxis />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="completed"
                stroke="#8B5CF6"
                fill="#8B5CF6"
                fillOpacity={0.3}
                strokeWidth={2}
                name="Completed"
              />
              <Area
                type="monotone"
                dataKey="target"
                stroke="#E5E7EB"
                fill="none"
                strokeDasharray="5 5"
                strokeWidth={2}
                name="Target"
              />
              <Area
                type="monotone"
                dataKey="engagement"
                stroke="#10B981"
                fill="#10B981"
                fillOpacity={0.2}
                strokeWidth={1}
                name="Engagement %"
              />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
        >
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
            <Zap className="h-6 w-6 mr-2 text-blue-500" />
            Skill Distribution
          </h3>
          
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={metrics.skillDistribution}>
                {(metrics.skillDistribution || []).map((entry: any, index: number) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Weekly Activity Analysis */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
      >
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
          <BarChart className="h-6 w-6 mr-2 text-green-500" />
          Weekly Activity Analytics
        </h3>
        
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={metrics.activityData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="courses" fill="#8B5CF6" name="Courses (hours)" />
            <Bar dataKey="practice" fill="#3B82F6" name="Practice (minutes)" />
            <Bar dataKey="community" fill="#10B981" name="Community (minutes)" />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      {/* AI Recommendations & Skill Gaps */}
      {aiInsights && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
          >
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
              <Brain className="h-6 w-6 mr-3 text-purple-500" />
              AI Recommendations
            </h3>
            
            <div className="space-y-4">
              {(aiInsights.recommendations || []).map((recommendation: string, index: number) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                  className="flex items-start space-x-3 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg"
                >
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0" />
                  <p className="text-gray-700 dark:text-gray-300 text-sm">{recommendation}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
          >
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
              <Target className="h-6 w-6 mr-3 text-orange-500" />
              Next Steps & Focus Areas
            </h3>
            
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Skill Gaps to Address:</h4>
                <div className="space-y-2">
                  {(aiInsights.skillGaps || []).map((gap: string, index: number) => (
                    <div key={index} className="flex items-center space-x-2 text-sm">
                      <div className="w-2 h-2 bg-orange-500 rounded-full" />
                      <span className="text-gray-600 dark:text-gray-400">{gap}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Immediate Actions:</h4>
                <div className="space-y-2">
                  {(aiInsights.nextSteps || []).map((step: string, index: number) => (
                    <div key={index} className="flex items-center space-x-2 text-sm">
                      <div className="w-2 h-2 bg-green-500 rounded-full" />
                      <span className="text-gray-600 dark:text-gray-400">{step}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Real-time Platform Activity */}
      {realTimeData && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.9 }}
          className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-xl p-6"
        >
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <Activity className="h-6 w-6 mr-3 text-green-500" />
            Live Platform Activity
          </h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">{realTimeData.activeUsers}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Users Online</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{realTimeData.coursesCompleted}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Courses Today</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">{Math.floor(realTimeData.practiceMinutes / 60)}h</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Practice Time</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-orange-600">{realTimeData.communityInteractions}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Interactions</p>
            </div>
          </div>
          
          {realTimeData.trendingTopics && (
            <div className="mt-4">
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Trending Topics:</p>
              <div className="flex flex-wrap gap-2">
                {(realTimeData.trendingTopics || []).map((topic: string, index: number) => (
                  <span key={index} className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full text-xs">
                    {topic}
                  </span>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}
