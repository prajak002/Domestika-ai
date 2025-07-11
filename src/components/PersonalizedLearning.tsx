'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import TeX from '@matejmazur/react-katex';
import 'katex/dist/katex.min.css';
import {
  BookOpen,
  Target,
  TrendingUp,
  Send,
  Clock,
  Award,
  Star,
  Brain,
  Users,
  Sparkles,
  Palette,
  Camera,
  Zap,
  Trophy,
  Heart
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';
import { advancedMistralService as mistralService } from '../lib/advancedMistralService';
import { dynamicDataStore } from '../lib/dynamicDataStore';

interface ChatMessage {
  id: string;
  text: string;
  isAI: boolean;
  timestamp: Date;
  confidence?: number;
}

interface Course {
  id: string;
  title: string;
  instructor: string;
  level: string;
  duration: string;
  rating: number;
  price: string;
  skills: string[];
  aiMatch: number;
  enrollments: number;
  completionRate: number;
}

interface Practice {
  id: number;
  title: string;
  description: string;
  difficulty: string;
  estimatedTime: string;
  xp: number;
}

export default function PersonalizedLearning() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoadingCourses, setIsLoadingCourses] = useState(true);
  const [counter, setCounter] = useState(1);
  const [skillData, setSkillData] = useState<{ subject: string; A: number; fullMark: number }[]>([]);
  const [progressData, setProgressData] = useState<{ week: string; progress: number; engagement: number }[]>([]);
  const [practices, setPractices] = useState<Practice[]>([]);

  useEffect(() => {
    const loadData = async () => {
      setIsLoadingCourses(true);
      
      try {
        // Load dynamic metrics and user data with fallback
        let dashboardMetrics = null;
        let coursesData = null;
        
        try {
          dashboardMetrics = await dynamicDataStore.getDashboardMetrics('user_1');
          coursesData = await dynamicDataStore.getRecommendedCourses('user_1');
        } catch (apiError) {
          console.warn('API unavailable, using fallback data:', apiError);
          // Continue with fallback data below
        }
        
        // Set skill data from dashboard metrics or fallback
        if (dashboardMetrics?.skillDistribution) {
          const dynamicSkillData = dashboardMetrics.skillDistribution.map((skillDist: any) => ({
            subject: skillDist.skill,
            A: skillDist.percentage,
            fullMark: 100
          }));
          setSkillData(dynamicSkillData);
        } else {
          // Fallback skill data
          setSkillData([
            { subject: 'Color Theory', A: 85, fullMark: 100 },
            { subject: 'Composition', A: 92, fullMark: 100 },
            { subject: 'Digital Art', A: 78, fullMark: 100 },
            { subject: 'Traditional Art', A: 88, fullMark: 100 },
            { subject: 'Typography', A: 82, fullMark: 100 },
            { subject: 'Illustration', A: 90, fullMark: 100 }
          ]);
        }

        // Set progress data from dashboard metrics or fallback
        if (dashboardMetrics?.weeklyProgress) {
          const progressDataMapped = dashboardMetrics.weeklyProgress.map((week: any) => ({
            week: week.week,
            progress: week.completed,
            engagement: week.engagement
          }));
          setProgressData(progressDataMapped);
        } else {
          // Fallback progress data
          setProgressData([
            { week: 'W1', progress: 20, engagement: 15 },
            { week: 'W2', progress: 35, engagement: 28 },
            { week: 'W3', progress: 45, engagement: 42 },
            { week: 'W4', progress: 62, engagement: 58 },
            { week: 'W5', progress: 78, engagement: 72 },
            { week: 'W6', progress: 85, engagement: 80 }
          ]);
        }

        // Set courses from recommended courses or use fallback
        if (coursesData && coursesData.length > 0) {
          // Map the Course type from dynamicDataStore to our local Course interface
          const mappedCourses: Course[] = coursesData.map((course: any) => ({
            ...course,
            aiMatch: Math.floor(Math.random() * 20) + 80,
            enrollments: Math.floor(Math.random() * 1000) + 500,
            completionRate: Math.floor(Math.random() * 30) + 70
          }));
          setCourses(mappedCourses);
        } else {
          // Generate dynamic courses with fallback
          const aiCourses: Course[] = [
            {
              id: 'ai_course_1',
              title: 'AI-Enhanced Digital Art Mastery',
              instructor: 'Sarah Chen',
              level: 'Advanced',
              duration: '16 hours',
              rating: 4.9,
              price: '$129',
              skills: ['AI Art Tools', 'Digital Painting', 'Prompt Engineering'],
              aiMatch: Math.floor(Math.random() * 10) + 90,
              enrollments: Math.floor(Math.random() * 500) + 800,
              completionRate: Math.floor(Math.random() * 20) + 75
            },
            {
              id: 'ai_course_2',
              title: 'Creative Workflow Optimization',
              instructor: 'Marcus Johnson',
              level: 'Intermediate',
              duration: '8 hours',
              rating: 4.7,
              price: '$89',
              skills: ['Productivity', 'Creative Process', 'Tool Mastery'],
              aiMatch: Math.floor(Math.random() * 10) + 85,
              enrollments: Math.floor(Math.random() * 400) + 600,
              completionRate: Math.floor(Math.random() * 15) + 80
            },
            {
              id: 'ai_course_3',
              title: 'Portfolio Development Masterclass',
              instructor: 'Elena Rodriguez',
              level: 'Beginner',
              duration: '12 hours',
              rating: 4.8,
              price: '$99',
              skills: ['Portfolio Design', 'Presentation', 'Career Development'],
              aiMatch: Math.floor(Math.random() * 15) + 80,
              enrollments: Math.floor(Math.random() * 300) + 400,
              completionRate: Math.floor(Math.random() * 25) + 70
            }
          ];
          setCourses(aiCourses);
        }

        // Generate dynamic practice drills
        const aiPractices: Practice[] = [
          {
            id: 1,
            title: 'AI-Guided Daily Sketch Challenge',
            description: 'Practice sketching with AI-generated prompts and feedback',
            difficulty: 'Medium',
            estimatedTime: '30 min',
            xp: 50
          },
          {
            id: 2,
            title: 'Color Harmony Exploration',
            description: 'Experiment with AI-suggested color palettes',
            difficulty: 'Hard',
            estimatedTime: '45 min',
            xp: 75
          },
          {
            id: 3,
            title: 'Quick Composition Studies',
            description: 'Rapid composition exercises with AI analysis',
            difficulty: 'Easy',
            estimatedTime: '15 min',
            xp: 25
          }
        ];
        setPractices(aiPractices);

      } catch (error) {
        console.error('Error loading learning data:', error);
        
        // Set complete fallback data
        setSkillData([
          { subject: 'Color Theory', A: 85, fullMark: 100 },
          { subject: 'Composition', A: 92, fullMark: 100 },
          { subject: 'Digital Art', A: 78, fullMark: 100 },
          { subject: 'Traditional Art', A: 88, fullMark: 100 },
          { subject: 'Typography', A: 82, fullMark: 100 },
          { subject: 'Illustration', A: 90, fullMark: 100 }
        ]);

        setProgressData([
          { week: 'W1', progress: 20, engagement: 15 },
          { week: 'W2', progress: 35, engagement: 28 },
          { week: 'W3', progress: 45, engagement: 42 },
          { week: 'W4', progress: 62, engagement: 58 },
          { week: 'W5', progress: 78, engagement: 72 },
          { week: 'W6', progress: 85, engagement: 80 }
        ]);
        
        setCourses([
          {
            id: 'course_1',
            title: 'Advanced Oil Painting Techniques',
            instructor: 'Maria Rodriguez',
            level: 'Intermediate',
            duration: '12 hours',
            rating: 4.8,
            price: '$89',
            skills: ['Color Mixing', 'Brushwork', 'Texture'],
            aiMatch: 95,
            enrollments: 1200,
            completionRate: 87
          },
          {
            id: 'course_2',
            title: 'Digital Illustration Fundamentals',
            instructor: 'Alex Kim',
            level: 'Beginner',
            duration: '10 hours',
            rating: 4.6,
            price: '$79',
            skills: ['Digital Drawing', 'Software Basics', 'Composition'],
            aiMatch: 88,
            enrollments: 950,
            completionRate: 82
          }
        ]);

        setPractices([
          {
            id: 1,
            title: 'Daily Color Study',
            description: 'Practice color mixing for 30 minutes daily',
            difficulty: 'Medium',
            estimatedTime: '30 min',
            xp: 50
          },
          {
            id: 2,
            title: 'Gesture Drawing Session',
            description: 'Quick figure studies to improve observation skills',
            difficulty: 'Easy',
            estimatedTime: '20 min',
            xp: 30
          }
        ]);
      } finally {
        setIsLoadingCourses(false);
      }
    };

    loadData();
    
    // Add initial AI message
    const initialMessage: ChatMessage = {
      id: 'initial',
      text: 'Hello! I\'m your AI learning companion powered by Mistral AI. I can help you discover personalized courses, track your progress, and provide tailored learning recommendations. What would you like to explore today?',
      isAI: true,
      timestamp: new Date(),
      confidence: 95
    };
    setMessages([initialMessage]);
  }, []);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: `user-${counter}`,
      text: inputValue,
      isAI: false,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);
    const currentCounter = counter;
    setCounter(prev => prev + 1);

    try {
      // Try to moderate content and send AI response
      let moderationResult = null;
      try {
        moderationResult = await mistralService.moderateContent(inputValue);
        
        if (moderationResult.flagged) {
          const errorMessage: ChatMessage = {
            id: `moderation-${currentCounter}`,
            text: 'Please keep our conversation focused on learning and creative topics.',
            isAI: true,
            timestamp: new Date(),
            confidence: 100
          };
          setMessages(prev => [...prev, errorMessage]);
          return;
        }
      } catch (moderationError) {
        console.warn('Moderation API unavailable, proceeding without moderation:', moderationError);
      }

      // Try to get AI response
      try {
        const conversation = await mistralService.createConversation('Learning Chat');
        const aiResponse = await mistralService.sendMessageToConversation(conversation.id, inputValue);

        const aiMessage: ChatMessage = {
          id: `ai-${currentCounter}`,
          text: aiResponse.content,
          isAI: true,
          timestamp: new Date(),
          confidence: 85
        };

        setMessages(prev => [...prev, aiMessage]);
        
        // Try to log activity for analytics
        try {
          await dynamicDataStore.addActivity('user_1', 'ai_chat', `Chat interaction: ${inputValue}`, {
            message: inputValue,
            response: aiResponse.content,
            confidence: 85
          });
        } catch (logError) {
          console.warn('Activity logging failed:', logError);
        }

      } catch (aiError) {
        console.warn('AI response failed, providing fallback response:', aiError);
        // Provide a helpful fallback response when AI is unavailable
        const fallbackMessage: ChatMessage = {
          id: `fallback-${currentCounter}`,
          text: `I understand you're asking about "${inputValue}". While I'm currently unable to connect to my AI services, I'd recommend exploring our course catalog for personalized learning opportunities. You can also try the practice drills to improve your creative skills!`,
          isAI: true,
          timestamp: new Date(),
          confidence: 50
        };
        setMessages(prev => [...prev, fallbackMessage]);
      }

    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: ChatMessage = {
        id: `error-${currentCounter}`,
        text: 'I\'m currently experiencing connectivity issues. Please try again in a moment, or explore the courses and practice drills available below!',
        isAI: true,
        timestamp: new Date(),
        confidence: 0
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Helper to render message with LaTeX and enhanced formatting for Domestika Creative Assistant
  const renderCreativeMessage = (msg: string) => {
    const parts = [];
    let lastIndex = 0;
    
    // Handle block math: $$...$$
    const blockMathRegex = /\$\$([\s\S]*?)\$\$/g;
    let blockMatch;
    const blockMatches = [];
    
    while ((blockMatch = blockMathRegex.exec(msg)) !== null) {
      blockMatches.push({
        start: blockMatch.index,
        end: blockMatch.index + blockMatch[0].length,
        content: blockMatch[1].trim()
      });
    }
    
    // Handle inline math: $...$
    const inlineMathRegex = /\$([^$\n]+?)\$/g;
    let inlineMatch: RegExpExecArray | null;
    const inlineMatches = [];
    
    while ((inlineMatch = inlineMathRegex.exec(msg)) !== null) {
      // Skip if this is part of a block math
      const isInBlock = blockMatches.some(block => 
        inlineMatch!.index >= block.start && inlineMatch!.index < block.end
      );
      
      if (!isInBlock) {
        inlineMatches.push({
          start: inlineMatch.index,
          end: inlineMatch.index + inlineMatch[0].length,
          content: inlineMatch[1].trim()
        });
      }
    }
    
    // Combine and sort all matches
    const allMatches = [...blockMatches.map(m => ({...m, type: 'block'})), 
                       ...inlineMatches.map(m => ({...m, type: 'inline'}))]
                      .sort((a, b) => a.start - b.start);
    
    // Build the result
    allMatches.forEach((match, index) => {
      // Add text before this match
      if (lastIndex < match.start) {
        const textContent = msg.slice(lastIndex, match.start);
        parts.push(
          <span key={`text-${index}`} className="whitespace-pre-wrap">
            {formatCreativeText(textContent)}
          </span>
        );
      }
      
      // Add the math content
      if (match.type === 'block') {
        parts.push(
          <div key={`block-${index}`} className="my-4 text-center">
            <TeX block math={match.content} />
          </div>
        );
      } else {
        parts.push(
          <TeX key={`inline-${index}`} math={match.content} />
        );
      }
      
      lastIndex = match.end;
    });
    
    // Add remaining text
    if (lastIndex < msg.length) {
      const remainingText = msg.slice(lastIndex);
      parts.push(
        <span key="remaining" className="whitespace-pre-wrap">
          {formatCreativeText(remainingText)}
        </span>
      );
    }
    
    return <div className="creative-message">{parts.length > 0 ? parts : formatCreativeText(msg)}</div>;
  };

  // Enhanced text formatting for creative content
  const formatCreativeText = (text: string) => {
    // Split by newlines to preserve structure
    const lines = text.split('\n');
    
    return lines.map((line, index) => {
      let formattedLine = line;
      
      // Format headers
      if (line.startsWith('**') && line.endsWith('**') && line.length > 4) {
        const headerText = line.slice(2, -2);
        return (
          <div key={index} className="font-bold text-lg text-purple-700 dark:text-purple-300 mt-4 mb-2 flex items-center">
            <Sparkles className="h-5 w-5 mr-2" />
            {headerText}
          </div>
        );
      }
      
      // Format bold text
      formattedLine = formattedLine.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-gray-900 dark:text-white">$1</strong>');
      
      // Format italic text
      formattedLine = formattedLine.replace(/\*(.*?)\*/g, '<em class="italic text-gray-700 dark:text-gray-300">$1</em>');
      
      // Format creative terms with icons
      formattedLine = formattedLine.replace(/🎨/g, '<span class="inline-flex items-center"><span class="text-pink-500">🎨</span></span>');
      formattedLine = formattedLine.replace(/🚀/g, '<span class="inline-flex items-center"><span class="text-blue-500">🚀</span></span>');
      
      // Handle section dividers
      if (line.trim() === '---') {
        return <hr key={index} className="my-4 border-gray-200 dark:border-gray-700" />;
      }
      
      // Handle lists
      if (line.trim().match(/^\d+\./)) {
        const match = line.trim().match(/^\d+/);
        return (
          <div key={index} className="flex items-start space-x-2 my-1">
            <span className="text-purple-500 font-semibold">{match ? match[0] : ''}.</span>
            <span dangerouslySetInnerHTML={{ __html: line.replace(/^\d+\.\s*/, '') }} />
          </div>
        );
      }
      
      if (line.trim().startsWith('- ')) {
        return (
          <div key={index} className="flex items-start space-x-2 my-1">
            <span className="text-purple-500">•</span>
            <span dangerouslySetInnerHTML={{ __html: line.replace(/^-\s*/, '') }} />
          </div>
        );
      }
      
      return (
        <div key={index} className="my-1">
          <span dangerouslySetInnerHTML={{ __html: formattedLine }} />
        </div>
      );
    });
  };

  // Enhanced suggestions for Domestika learners
  const creativeSuggestions = [
    { text: "How can I improve my color theory skills?", icon: Palette },
    { text: "What's the best way to practice portrait drawing?", icon: Users },
    { text: "Explain the golden ratio in design", icon: Target },
    { text: "How do I build a creative portfolio?", icon: Camera },
    { text: "What are the principles of composition?", icon: BookOpen },
    { text: "How can I get better at digital illustration?", icon: Zap }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* AI Chat Interface */}
      <div className="lg:col-span-1">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 h-fit"
        >
          <div className="flex items-center space-x-3 mb-6">
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-3 rounded-xl">
              <Brain className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                Domestika Creative Assistant
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center space-x-2">
                <Sparkles className="h-4 w-4" />
                <span>Your AI companion for creative growth</span>
              </p>
            </div>
          </div>

          <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-4 rounded-lg ${
                  message.isAI
                    ? 'bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 mr-4 border-l-4 border-purple-500'
                    : 'bg-gradient-to-r from-purple-500 to-blue-500 text-white ml-4'
                }`}
              >
                <div className={`${message.isAI ? 'text-gray-800 dark:text-gray-200' : 'text-white'}`}>
                  {message.isAI ? renderCreativeMessage(message.text) : (
                    <p className="text-sm font-medium">{message.text}</p>
                  )}
                </div>
                <div className={`text-xs mt-2 flex items-center justify-between ${
                  message.isAI ? 'text-gray-500 dark:text-gray-400' : 'text-purple-100'
                }`}>
                  <span>{message.timestamp.toLocaleTimeString()}</span>
                  {message.confidence && (
                    <span className="flex items-center space-x-1">
                      <Brain className="h-3 w-3" />
                      <span>AI Confidence: {message.confidence}%</span>
                    </span>
                  )}
                </div>
              </motion.div>
            ))}
            {isLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 p-4 rounded-lg mr-4 border-l-4 border-purple-500"
              >
                <div className="flex items-center space-x-3">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    Domestika Creative Assistant is thinking...
                  </span>
                </div>
              </motion.div>
            )}
          </div>

          {/* Creative Quick Suggestions */}
          {messages.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4"
            >
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                💡 Try asking about:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {creativeSuggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => setInputValue(suggestion.text)}
                    className="flex items-center space-x-2 p-2 text-sm bg-purple-50 dark:bg-purple-900/20 hover:bg-purple-100 dark:hover:bg-purple-900/40 rounded-lg transition-colors text-left"
                  >
                    <suggestion.icon className="h-4 w-4 text-purple-500" />
                    <span className="text-gray-700 dark:text-gray-300">{suggestion.text}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          <form onSubmit={handleSendMessage} className="flex space-x-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask your Domestika Creative Assistant anything..."
              className="flex-1 p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !inputValue.trim()}
              className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 disabled:opacity-50 text-white p-3 rounded-lg transition-colors flex items-center space-x-2"
            >
              <Send className="h-4 w-4" />
              <span className="hidden sm:inline">Send</span>
              <Send className="h-5 w-5" />
            </button>
          </form>
        </motion.div>
      </div>

      {/* Main Content */}
      <div className="lg:col-span-2 space-y-8">
        {/* Skill Analysis */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
        >
          <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
            <Target className="h-6 w-6 mr-3 text-purple-500" />
            Your Creative Skill Profile
          </h3>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h4 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-4">
                Skill Distribution
              </h4>
              <ResponsiveContainer width="100%" height={300}>
                <RadarChart data={skillData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="subject" className="text-xs" />
                  <PolarRadiusAxis domain={[0, 100]} className="text-xs" />
                  <Radar
                    name="Skills"
                    dataKey="A"
                    stroke="#8B5CF6"
                    fill="#8B5CF6"
                    fillOpacity={0.3}
                    strokeWidth={2}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
            
            <div>
              <h4 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-4">
                Learning Progress
              </h4>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={progressData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="week" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="progress"
                    stroke="#8B5CF6"
                    strokeWidth={3}
                    dot={{ fill: '#8B5CF6', strokeWidth: 2, r: 6 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="engagement"
                    stroke="#3B82F6"
                    strokeWidth={2}
                    dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </motion.div>

        {/* Recommended Courses */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 flex items-center">
                <Zap className="h-6 w-6 mr-3 text-purple-500" />
                Domestika AI Course Recommendations
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Personalized learning paths curated by AI based on your creative journey
              </p>
            </div>
            <div className="hidden md:flex items-center space-x-2 bg-purple-100 dark:bg-purple-900/30 px-3 py-2 rounded-lg">
              <Brain className="h-4 w-4 text-purple-500" />
              <span className="text-sm font-medium text-purple-700 dark:text-purple-300">AI Powered</span>
            </div>
          </div>
          
          {isLoadingCourses ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-purple-500 border-t-transparent"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course, index) => (
                <motion.div
                  key={course.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                  className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 hover:shadow-lg transition-shadow cursor-pointer"
                >
                  <div className="relative mb-4">
                    <div className="w-full h-32 bg-gradient-to-br from-purple-400 to-blue-500 rounded-lg mb-3"></div>
                    <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                      {course.aiMatch}% Match
                    </div>
                  </div>
                  
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                    {course.title}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    by {course.instructor}
                  </p>
                  
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 px-2 py-1 rounded">
                      {course.level}
                    </span>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-400 mr-1" />
                      <span className="text-sm">{course.rating}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mb-3">
                    <span className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <Clock className="h-4 w-4 mr-1" />
                      {course.duration}
                    </span>
                    <span className="font-semibold text-purple-600 dark:text-purple-400">
                      {course.price}
                    </span>
                  </div>
                  
                  <div className="flex flex-wrap gap-1 mb-3">
                    {course.skills.map((skill, skillIndex) => (
                      <span
                        key={`${course.id}-skill-${skillIndex}`}
                        className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-2 py-1 rounded"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                  
                  <button className="w-full bg-purple-500 hover:bg-purple-600 text-white py-2 rounded-lg transition-colors">
                    Start Learning
                  </button>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Practice Drills */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
        >
          <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
            <TrendingUp className="h-6 w-6 mr-3 text-green-500" />
            Personalized Practice Drills
          </h3>
          
          <div className="space-y-4">
            {practices.map((practice, index) => (
              <motion.div
                key={practice.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
                className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 flex items-center justify-between hover:shadow-md transition-shadow"
              >
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                    {practice.title}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    {practice.description}
                  </p>
                  <div className="flex items-center space-x-4">
                    <span className={`text-xs px-2 py-1 rounded ${
                      practice.difficulty === 'Easy' ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300' :
                      practice.difficulty === 'Medium' ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300' :
                      'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300'
                    }`}>
                      {practice.difficulty}
                    </span>
                    <span className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      {practice.estimatedTime}
                    </span>
                    <span className="text-sm text-purple-600 dark:text-purple-400 flex items-center">
                      <Award className="h-4 w-4 mr-1" />
                      {practice.xp} XP
                    </span>
                  </div>
                </div>
                <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors">
                  Start Practice
                </button>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Creative Journey & Skills Overview */}
        <div className="lg:col-span-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl shadow-lg p-6 mb-8"
          >
            <div className="text-center mb-6">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 flex items-center justify-center">
                <Sparkles className="h-8 w-8 mr-3 text-purple-500" />
                Domestika Creative Assistant
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                Your AI companion helping millions of creatives learn faster, practice better, and share more confidently
              </p>
            </div>
            
            {/* Creative Stats Dashboard */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 text-center shadow-sm">
                <Trophy className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900 dark:text-white">12</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Skills Mastered</div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 text-center shadow-sm">
                <BookOpen className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900 dark:text-white">8</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Courses Completed</div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 text-center shadow-sm">
                <Users className="h-8 w-8 text-green-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900 dark:text-white">142</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Community Rank</div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 text-center shadow-sm">
                <Heart className="h-8 w-8 text-red-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900 dark:text-white">45h</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Learning Time</div>
              </div>
            </div>

            {/* AI-Powered Insights */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border-l-4 border-purple-500">
              <div className="flex items-start space-x-3">
                <Brain className="h-6 w-6 text-purple-500 mt-1" />
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                    AI Insight: Your Creative Journey
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Based on your learning patterns, you're excelling in <strong>color theory</strong> and <strong>composition</strong>. 
                    Consider exploring <strong>advanced lighting techniques</strong> to enhance your digital art. 
                    The golden ratio $\phi = 1.618$ could elevate your compositions further.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
