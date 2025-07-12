'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import TeX from '@matejmazur/react-katex';
import 'katex/dist/katex.min.css';
import {
  Target,
  TrendingUp,
  Send,
  Clock,
  Award,
  Star,
  Brain,
  Users,
  Sparkles,
  Zap,
  Trophy,
  Share2,
  MessageCircle,
  Navigation,
  CheckCircle,
  ArrowRight,
  Copy,
  Twitter,
  Facebook,
  Linkedin,
  Download
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

// Enhanced interfaces for the new features
interface ChatMessage {
  id: string;
  text: string;
  isAI: boolean;
  timestamp: Date;
  confidence?: number;
  type?: 'feedback' | 'journey' | 'community' | 'general';
  attachments?: SkillJourneyStep[];
}

interface SkillJourneyStep {
  id: string;
  title: string;
  description: string;
  status: 'completed' | 'current' | 'upcoming';
  estimatedTime: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  skills: string[];
  aiGuidance: string;
  communitySupport?: CommunityMember[];
}

interface CommunityMember {
  id: string;
  name: string;
  avatar: string;
  role: 'peer' | 'mentor' | 'instructor';
  expertise: string[];
  rating: number;
  isOnline: boolean;
  lastActive: string;
  helpfulnessScore: number;
}

interface ShareableProgress {
  skillProgress: { subject: string; level: number }[];
  achievements: string[];
  currentJourney: string;
  completedProjects: number;
  studyStreak: number;
}

interface AIFeedback {
  id: string;
  content: string;
  suggestions: string[];
  nextSteps: string[];
  confidenceLevel: number;
  improvementAreas: string[];
  strengths: string[];
}

export default function PersonalizedLearningEnhanced() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'journey' | 'community' | 'feedback' | 'share'>('journey');
  
  // Skill Journey State
  const [currentJourney, setCurrentJourney] = useState<SkillJourneyStep[]>([]);
  const [journeyProgress, setJourneyProgress] = useState(0);
  
  // Community State
  const [recommendedPeers, setRecommendedPeers] = useState<CommunityMember[]>([]);
  const [availableMentors, setAvailableMentors] = useState<CommunityMember[]>([]);
  
  // AI Feedback State
  const [recentFeedback, setRecentFeedback] = useState<AIFeedback[]>([]);
  
  // Sharing State
  const [shareProgress, setShareProgress] = useState<ShareableProgress | null>(null);
  
  // Charts data
  const [skillData, setSkillData] = useState<{ subject: string; A: number; fullMark: number }[]>([]);
  const [progressData, setProgressData] = useState<{ week: string; progress: number; engagement: number }[]>([]);

  useEffect(() => {
    const initializeEnhancedLearning = async () => {
      // Initialize skill journey
      const sampleJourney: SkillJourneyStep[] = [
        {
          id: 'step-1',
          title: 'Master Color Theory Fundamentals',
          description: 'Learn the essential principles of color harmony, temperature, and emotional impact',
          status: 'completed',
          estimatedTime: '2 weeks',
          difficulty: 'beginner',
          skills: ['Color Harmony', 'Color Psychology', 'Color Mixing'],
          aiGuidance: 'Start with the color wheel and practice mixing complementary colors daily',
          communitySupport: []
        },
        {
          id: 'step-2',
          title: 'Advanced Composition Techniques',
          description: 'Explore rule of thirds, leading lines, and dynamic compositions',
          status: 'current',
          estimatedTime: '3 weeks',
          difficulty: 'intermediate',
          skills: ['Composition', 'Visual Balance', 'Focal Points'],
          aiGuidance: 'Practice analyzing master paintings and recreate their compositional structures',
          communitySupport: []
        },
        {
          id: 'step-3',
          title: 'Digital Art Mastery',
          description: 'Combine traditional skills with digital tools and techniques',
          status: 'upcoming',
          estimatedTime: '4 weeks',
          difficulty: 'advanced',
          skills: ['Digital Painting', 'Software Proficiency', 'Digital Composition'],
          aiGuidance: 'Integrate AI tools to enhance your creative workflow',
          communitySupport: []
        }
      ];
      setCurrentJourney(sampleJourney);
      setJourneyProgress(40); // 40% through current journey

      // Initialize community recommendations
      const peers: CommunityMember[] = [
        {
          id: 'peer-1',
          name: 'Sofia Chen',
          avatar: '👩‍🎨',
          role: 'peer',
          expertise: ['Digital Art', 'Character Design'],
          rating: 4.8,
          isOnline: true,
          lastActive: '2 minutes ago',
          helpfulnessScore: 95
        },
        {
          id: 'peer-2',
          name: 'Marcus Thompson',
          avatar: '👨‍🎨',
          role: 'peer',
          expertise: ['Color Theory', 'Traditional Painting'],
          rating: 4.6,
          isOnline: false,
          lastActive: '1 hour ago',
          helpfulnessScore: 87
        }
      ];
      setRecommendedPeers(peers);

      const mentors: CommunityMember[] = [
        {
          id: 'mentor-1',
          name: 'Elena Rodriguez',
          avatar: '🎨',
          role: 'mentor',
          expertise: ['Professional Portfolio', 'Art Direction', 'Career Guidance'],
          rating: 4.9,
          isOnline: true,
          lastActive: 'now',
          helpfulnessScore: 98
        },
        {
          id: 'instructor-1',
          name: 'David Kim',
          avatar: '🏆',
          role: 'instructor',
          expertise: ['Advanced Techniques', 'Art History', 'Critique'],
          rating: 5.0,
          isOnline: false,
          lastActive: '30 minutes ago',
          helpfulnessScore: 100
        }
      ];
      setAvailableMentors(mentors);

      // Initialize share progress data
      const initialSkillData = [
        { subject: 'Color Theory', A: 85, fullMark: 100 },
        { subject: 'Composition', A: 72, fullMark: 100 },
        { subject: 'Digital Art', A: 58, fullMark: 100 },
        { subject: 'Traditional Art', A: 88, fullMark: 100 },
        { subject: 'Typography', A: 45, fullMark: 100 },
        { subject: 'Illustration', A: 67, fullMark: 100 }
      ];
      
      setSkillData(initialSkillData);
      
      // Initialize progress data
      setProgressData([
        { week: 'W1', progress: 20, engagement: 15 },
        { week: 'W2', progress: 35, engagement: 28 },
        { week: 'W3', progress: 45, engagement: 42 },
        { week: 'W4', progress: 62, engagement: 58 },
        { week: 'W5', progress: 78, engagement: 72 },
        { week: 'W6', progress: 85, engagement: 80 }
      ]);
      
      setShareProgress({
        skillProgress: initialSkillData.map(skill => ({ subject: skill.subject, level: skill.A })),
        achievements: ['Color Theory Master', 'Consistent Learner', '30-Day Streak'],
        currentJourney: 'Advanced Composition Techniques',
        completedProjects: 12,
        studyStreak: 18
      });

      // Add enhanced initial AI message
      const initialMessage: ChatMessage = {
        id: 'initial',
        text: `🎨 **Welcome to Your Personalized Creative Journey!** 🚀

I'm your AI companion designed to guide you through personalized skill development. Here's how I'll help you excel:

**🎯 Personalized Skill Journeys:**
- Custom learning paths based on your goals and current skills
- Step-by-step guidance with AI-powered recommendations
- Progress tracking with adaptive difficulty adjustment

**🤖 Intelligent Feedback & AI Co-Creation:**
- Real-time analysis of your work with specific improvement suggestions
- AI-assisted creative ideation and problem-solving
- Technique recommendations based on your style and goals

**👥 Smart Community Connections:**
- Peer matching based on complementary skills and learning goals
- Expert mentor recommendations at the perfect learning moments
- Study groups and collaboration opportunities

**📱 Easy Sharing & Portfolio Building:**
- Share your progress and achievements with the community
- Export learning milestones for portfolio development
- Social proof of your creative growth journey

**What would you like to explore first?** Try asking about:
- "Show me my next learning step"
- "Connect me with peers working on similar projects"  
- "Give me feedback on my latest artwork"
- "Help me share my progress"`,
        isAI: true,
        timestamp: new Date(),
        confidence: 95,
        type: 'journey'
      };
      setMessages([initialMessage]);
    };
    
    initializeEnhancedLearning();
  }, []);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      text: inputValue,
      isAI: false,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = inputValue;
    setInputValue('');
    setIsLoading(true);

    try {
      // Determine message type and enhance prompt accordingly
      const messageType = determineMessageType(currentInput);
      const enhancedPrompt = createEnhancedPrompt(currentInput, messageType);

      const response = await fetch('/api/mistral', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          prompt: enhancedPrompt, 
          type: messageType === 'feedback' ? 'design_feedback' : 'learning_recommendation',
          maxTokens: 1000
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(errorData.error || `API returned ${response.status}`);
      }

      const data = await response.json();
      
      if (!data.text && !data.response) {
        throw new Error('No response content received from API');
      }
      
      const aiMessage: ChatMessage = {
        id: `ai-${Date.now()}`,
        text: data.text || data.response,
        isAI: true,
        timestamp: new Date(),
        confidence: data.confidence || 85,
        type: messageType,
        attachments: messageType === 'journey' ? generateJourneySteps() : undefined
      };

      setMessages(prev => [...prev, aiMessage]);

      // Update relevant state based on message type
      if (messageType === 'community') {
        updateCommunityRecommendations();
      } else if (messageType === 'feedback') {
        generateAIFeedback();
      }

    } catch (error) {
      console.error('Error getting AI response:', error);
      
      // Generate a meaningful fallback response based on the input
      const messageType = determineMessageType(currentInput);
      const fallbackResponse = generateFallbackResponse(currentInput, messageType);
      
      const fallbackMessage: ChatMessage = {
        id: `fallback-${Date.now()}`,
        text: fallbackResponse,
        isAI: true,
        timestamp: new Date(),
        confidence: 70,
        type: messageType
      };

      setMessages(prev => [...prev, fallbackMessage]);
      
      // Still update state for meaningful interactions
      if (messageType === 'feedback') {
        generateAIFeedback();
      }
    } finally {
      setIsLoading(false);
    }
  };

  const determineMessageType = (input: string): 'feedback' | 'journey' | 'community' | 'general' => {
    const lowerInput = input.toLowerCase();
    
    if (lowerInput.includes('feedback') || lowerInput.includes('critique') || lowerInput.includes('improve')) {
      return 'feedback';
    } else if (lowerInput.includes('journey') || lowerInput.includes('next step') || lowerInput.includes('learn')) {
      return 'journey';
    } else if (lowerInput.includes('peer') || lowerInput.includes('mentor') || lowerInput.includes('community') || lowerInput.includes('connect')) {
      return 'community';
    }
    return 'general';
  };

  const createEnhancedPrompt = (input: string, type: string): string => {
    const baseContext = `You are the Domestika AI Learning Assistant, specialized in personalized creative education. Current user context:
- Journey Progress: ${journeyProgress}% through "${currentJourney.find(s => s.status === 'current')?.title || 'Advanced Composition Techniques'}"
- Top Skills: ${skillData && skillData.length > 0 ? skillData.slice(0, 3).map(s => `${s.subject} (${s.A || 0}%)`).join(', ') : 'Color Theory, Composition, Traditional Art'}
- Learning Style: Visual, hands-on practice preferred
`;

    const typeSpecificContext = {
      feedback: `Focus on providing specific, actionable feedback for creative work. Include technique suggestions, areas for improvement, and positive reinforcement.`,
      journey: `Provide personalized learning path guidance. Suggest next steps, practice exercises, and milestone goals based on current progress.`,
      community: `Recommend relevant peers, mentors, or instructors. Consider skill levels, learning goals, and collaboration opportunities.`,
      general: `Provide helpful creative education guidance with encouragement and practical advice.`
    };

    return `${baseContext}\n${typeSpecificContext[type as keyof typeof typeSpecificContext]}\n\nUser Input: ${input}\n\nResponse (be encouraging, specific, and actionable):`;
  };

  const generateJourneySteps = (): SkillJourneyStep[] => {
    // This would typically come from AI analysis
    return [
      {
        id: `step-${Date.now()}`,
        title: 'Suggested Next Practice',
        description: 'Based on your question, here\'s a recommended practice session',
        status: 'upcoming' as const,
        estimatedTime: '30 minutes',
        difficulty: 'intermediate' as const,
        skills: ['Technique Refinement'],
        aiGuidance: 'Focus on the specific area you asked about',
        communitySupport: recommendedPeers.slice(0, 1)
      }
    ];
  };

  const updateCommunityRecommendations = () => {
    // In a real app, this would use AI to find relevant community members
    console.log('Updating community recommendations');
  };

  const generateAIFeedback = () => {
    const newFeedback: AIFeedback = {
      id: `feedback-${Date.now()}`,
      content: 'AI analysis of your work',
      suggestions: ['Focus on color harmony', 'Improve composition balance'],
      nextSteps: ['Practice daily color studies', 'Analyze master works'],
      confidenceLevel: 87,
      improvementAreas: ['Color mixing', 'Value contrast'],
      strengths: ['Creative vision', 'Technical skill']
    };
    
    setRecentFeedback(prev => [newFeedback, ...prev.slice(0, 4)]);
  };

  const handleShare = async (platform: string) => {
    if (!shareProgress) return;

    const shareText = `🎨 Making great progress on my creative journey! 

📈 Current Skills:
${shareProgress.skillProgress.slice(0, 3).map(s => `• ${s.subject}: ${s.level}%`).join('\n')}

🏆 Recent Achievements: ${shareProgress.achievements.join(', ')}
📚 Currently Learning: ${shareProgress.currentJourney}
🔥 Study Streak: ${shareProgress.studyStreak} days

#CreativeLearning #ArtProgress #Domestika`;

    if (platform === 'copy') {
      await navigator.clipboard.writeText(shareText);
      alert('Progress copied to clipboard!');
    } else if (platform === 'download') {
      const blob = new Blob([shareText], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'my-creative-progress.txt';
      a.click();
      URL.revokeObjectURL(url);
    } else {
      // For social platforms, would typically use their APIs
      const urls = {
        twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`,
        facebook: `https://facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`,
        linkedin: `https://linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`
      };
      
      if (urls[platform as keyof typeof urls]) {
        window.open(urls[platform as keyof typeof urls], '_blank');
      }
    }
  };

  const renderMessage = (msg: string) => {
    if (/\$[^$]+\$|\\\([\s\S]+?\\\)/.test(msg)) {
      return <TeX>{msg}</TeX>;
    }
    return <span className="whitespace-pre-wrap">{msg}</span>;
  };

  const generateFallbackResponse = (input: string, type: 'feedback' | 'journey' | 'community' | 'general'): string => {
    switch (type) {
      case 'feedback':
        return `🎨 **Creative Feedback for Your Work**

Based on your request about "${input}", here's some guidance:

**🔍 General Areas to Focus On:**
- **Color Harmony:** Ensure your color choices work well together and support your message
- **Composition:** Check if your focal point is clear and the visual flow guides the viewer
- **Technique:** Practice fundamental skills regularly to build confidence

**💡 Actionable Next Steps:**
1. Study 3 artworks in a similar style to yours for inspiration
2. Practice the specific technique you mentioned for 15-20 minutes daily
3. Share your work with the community for peer feedback

**👥 Community Tip:** ${recommendedPeers[0]?.name || 'Sofia Chen'} has expertise in similar areas - consider connecting!

*Note: For detailed AI analysis, I'll need a moment to reconnect. Please try again shortly.*`;

      case 'journey':
        const currentStep = currentJourney.find(s => s.status === 'current');
        return `🎯 **Your Personalized Learning Path**

Great question about "${input}"! Here's your guided next steps:

**📍 Current Focus:** ${currentStep?.title || 'Advanced Composition Techniques'}
**Progress:** ${journeyProgress}% complete

**🎨 Recommended Practice Session:**
- **Duration:** 30-45 minutes
- **Focus Area:** Based on your question, work on technique refinement
- **Goal:** Apply what you're learning to a small practice piece

**📚 Learning Sequence:**
1. Review the fundamentals related to your question
2. Practice with guided exercises
3. Apply to a personal project
4. Get community feedback

**🔥 Study Tip:** ${currentStep?.aiGuidance || 'Focus on consistent daily practice, even if just 15 minutes'}

Ready to continue your journey? Try the current exercise!`;

      case 'community':
        return `👥 **Community Connections for You**

Looking to connect around "${input}"? Here are some suggestions:

**🎯 Recommended Study Partners:**
${recommendedPeers.slice(0, 2).map(peer => 
  `- **${peer.name}** (${peer.expertise.join(', ')}) - ${peer.isOnline ? 'Online now' : peer.lastActive}`
).join('\n')}

**🏆 Expert Mentors Available:**
${availableMentors.slice(0, 1).map(mentor => 
  `- **${mentor.name}** - ${mentor.expertise.slice(0, 2).join(', ')} specialist`
).join('\n')}

**💡 Connection Tips:**
- Share your current project or challenge when reaching out
- Be specific about what kind of help you're looking for
- Offer to help others in return - it builds great relationships!

**🎨 Study Group Suggestion:** Start a practice session focused on your question - others might join!

The community is here to help you grow! 🚀`;

      default:
        return `🎨 **Creative Learning Assistant**

Thanks for your question about "${input}"! While I reconnect for full AI capabilities, here's what I can help with:

**🎯 Your Current Journey:**
- **Step:** ${currentJourney.find(s => s.status === 'current')?.title || 'Advanced Composition Techniques'}
- **Progress:** ${journeyProgress}% complete
- **Next Skills:** ${currentJourney.find(s => s.status === 'upcoming')?.skills.slice(0, 2).join(', ') || 'Digital techniques, Advanced composition'}

**💡 Quick Actions You Can Take:**
1. Continue with your current learning step
2. Practice for 15-20 minutes on fundamentals
3. Connect with study partners who are online
4. Review your recent work for improvement opportunities

**📈 Recent Progress:**
- **Strongest Skills:** ${skillData && skillData.length > 0 ? skillData.slice(0, 2).map(s => `${s.subject} (${s.A || 0}%)`).join(', ') : 'Color Theory, Composition'}
- **Growth Areas:** ${skillData && skillData.length > 0 ? skillData.slice(-2).map(s => `${s.subject} (${s.A || 0}%)`).join(', ') : 'Typography, Digital Art'}

Keep practicing and growing! I'll be back with full AI guidance shortly. 🚀`;
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          🎨 Personalized Creative Learning Journey
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300">
          AI-powered guidance • Community connections • Intelligent feedback
        </p>
      </motion.div>

      {/* Navigation Tabs */}
      <div className="flex justify-center space-x-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
        {[
          { id: 'journey', label: 'Skill Journey', icon: Navigation },
          { id: 'community', label: 'Community', icon: Users },
          { id: 'feedback', label: 'AI Feedback', icon: Brain },
          { id: 'share', label: 'Share Progress', icon: Share2 }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as 'journey' | 'community' | 'feedback' | 'share')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-all ${
              activeTab === tab.id
                ? 'bg-white dark:bg-gray-700 text-purple-600 dark:text-purple-400 shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-purple-600'
            }`}
          >
            <tab.icon className="h-4 w-4" />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-6">
          {/* Active Tab Content */}
          <AnimatePresence mode="wait">
            {activeTab === 'journey' && (
              <motion.div
                key="journey"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
                    <Navigation className="h-6 w-6 mr-2 text-purple-500" />
                    Your Learning Journey
                  </h2>
                  <div className="flex items-center space-x-2">
                    <div className="text-sm text-gray-600 dark:text-gray-400">Progress</div>
                    <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-purple-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${journeyProgress}%` }}
                      />
                    </div>
                    <span className="text-sm font-semibold text-purple-600">{journeyProgress}%</span>
                  </div>
                </div>

                <div className="space-y-4">
                  {currentJourney.map((step, index) => (
                    <motion.div
                      key={step.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`border rounded-lg p-4 ${
                        step.status === 'current' 
                          ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20' 
                          : step.status === 'completed'
                          ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                          : 'border-gray-300 dark:border-gray-600'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            {step.status === 'completed' && <CheckCircle className="h-5 w-5 text-green-500" />}
                            {step.status === 'current' && <Zap className="h-5 w-5 text-purple-500" />}
                            {step.status === 'upcoming' && <Clock className="h-5 w-5 text-gray-400" />}
                            <h3 className="font-semibold text-gray-900 dark:text-white">{step.title}</h3>
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              step.difficulty === 'beginner' ? 'bg-green-100 text-green-800' :
                              step.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {step.difficulty}
                            </span>
                          </div>
                          <p className="text-gray-600 dark:text-gray-400 mb-3">{step.description}</p>
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <span className="flex items-center">
                              <Clock className="h-4 w-4 mr-1" />
                              {step.estimatedTime}
                            </span>
                            <span className="flex items-center">
                              <Target className="h-4 w-4 mr-1" />
                              {step.skills.length} skills
                            </span>
                          </div>
                          {step.status === 'current' && (
                            <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                              <p className="text-sm text-blue-800 dark:text-blue-200">
                                <Brain className="h-4 w-4 inline mr-1" />
                                <strong>AI Guidance:</strong> {step.aiGuidance}
                              </p>
                            </div>
                          )}
                        </div>
                        {step.status === 'current' && (
                          <button className="ml-4 bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition-colors">
                            Continue
                          </button>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'community' && (
              <motion.div
                key="community"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-6"
              >
                {/* Recommended Peers */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                    <Users className="h-5 w-5 mr-2 text-blue-500" />
                    Recommended Study Partners
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {recommendedPeers.map(peer => (
                      <div key={peer.id} className="border dark:border-gray-700 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <div className="text-2xl">{peer.avatar}</div>
                            <div>
                              <h3 className="font-semibold text-gray-900 dark:text-white">{peer.name}</h3>
                              <div className="flex items-center space-x-2">
                                <span className={`w-2 h-2 rounded-full ${peer.isOnline ? 'bg-green-500' : 'bg-gray-400'}`} />
                                <span className="text-sm text-gray-500">{peer.lastActive}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Star className="h-4 w-4 text-yellow-500" />
                            <span className="text-sm font-semibold">{peer.rating}</span>
                          </div>
                        </div>
                        <div className="mb-3">
                          <div className="flex flex-wrap gap-1">
                            {peer.expertise.map(skill => (
                              <span key={skill} className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded">
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <button className="flex-1 bg-blue-500 text-white px-3 py-2 rounded text-sm hover:bg-blue-600">
                            Connect
                          </button>
                          <button className="flex-1 border border-gray-300 dark:border-gray-600 px-3 py-2 rounded text-sm hover:bg-gray-50 dark:hover:bg-gray-700">
                            View Profile
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Available Mentors */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                    <Award className="h-5 w-5 mr-2 text-yellow-500" />
                    Expert Mentors Available
                  </h2>
                  <div className="space-y-4">
                    {availableMentors.map(mentor => (
                      <div key={mentor.id} className="border dark:border-gray-700 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="text-2xl">{mentor.avatar}</div>
                            <div>
                              <h3 className="font-semibold text-gray-900 dark:text-white">{mentor.name}</h3>
                              <p className="text-sm text-gray-600 dark:text-gray-400 capitalize">{mentor.role}</p>
                              <div className="flex items-center space-x-2 mt-1">
                                <span className={`w-2 h-2 rounded-full ${mentor.isOnline ? 'bg-green-500' : 'bg-gray-400'}`} />
                                <span className="text-sm text-gray-500">{mentor.lastActive}</span>
                                <div className="flex items-center space-x-1">
                                  <Trophy className="h-3 w-3 text-yellow-500" />
                                  <span className="text-xs">{mentor.helpfulnessScore}% helpful</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          <button className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600">
                            Request Session
                          </button>
                        </div>
                        <div className="mt-3 flex flex-wrap gap-1">
                          {mentor.expertise.map(skill => (
                            <span key={skill} className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 text-xs rounded">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'feedback' && (
              <motion.div
                key="feedback"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
              >
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                  <Brain className="h-5 w-5 mr-2 text-purple-500" />
                  AI-Powered Feedback & Analysis
                </h2>
                
                <div className="mb-6 p-4 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Upload Your Work for Instant Analysis</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-3">Get detailed feedback on technique, composition, color usage, and improvement suggestions.</p>
                  <button className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600">
                    Upload Artwork
                  </button>
                </div>

                {recentFeedback.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="font-semibold text-gray-900 dark:text-white">Recent AI Feedback</h3>
                    {recentFeedback.map(feedback => (
                      <div key={feedback.id} className="border dark:border-gray-700 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-2">
                            <Brain className="h-4 w-4 text-purple-500" />
                            <span className="font-medium">AI Analysis</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <span className="text-sm text-gray-500">Confidence:</span>
                            <span className="text-sm font-semibold text-purple-600">{feedback.confidenceLevel}%</span>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <h4 className="font-medium text-green-700 dark:text-green-400 mb-2">Strengths</h4>
                            <ul className="text-sm space-y-1">
                              {feedback.strengths.map((strength, idx) => (
                                <li key={idx} className="flex items-center">
                                  <CheckCircle className="h-3 w-3 text-green-500 mr-2" />
                                  {strength}
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <h4 className="font-medium text-orange-700 dark:text-orange-400 mb-2">Areas for Growth</h4>
                            <ul className="text-sm space-y-1">
                              {feedback.improvementAreas.map((area, idx) => (
                                <li key={idx} className="flex items-center">
                                  <Target className="h-3 w-3 text-orange-500 mr-2" />
                                  {area}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                        
                        <div className="mb-4">
                          <h4 className="font-medium text-blue-700 dark:text-blue-400 mb-2">Recommended Next Steps</h4>
                          <ul className="text-sm space-y-1">
                            {feedback.nextSteps.map((step, idx) => (
                              <li key={idx} className="flex items-center">
                                <ArrowRight className="h-3 w-3 text-blue-500 mr-2" />
                                {step}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'share' && (
              <motion.div
                key="share"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
              >
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                  <Share2 className="h-5 w-5 mr-2 text-green-500" />
                  Share Your Creative Progress
                </h2>

                {shareProgress && (
                  <div className="space-y-6">
                    {/* Progress Summary */}
                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-6">
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Your Creative Journey Snapshot</h3>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-purple-600">{shareProgress.completedProjects}</div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">Projects Completed</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-blue-600">{shareProgress.studyStreak}</div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">Day Streak</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-600">{shareProgress.achievements.length}</div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">Achievements</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-yellow-600">
                            {shareProgress.skillProgress && shareProgress.skillProgress.length > 0 
                              ? Math.round(shareProgress.skillProgress.reduce((sum, skill) => sum + (skill.level || 0), 0) / shareProgress.skillProgress.length)
                              : 0
                            }
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">Avg. Skill Level</div>
                        </div>
                      </div>

                      <div className="mb-4">
                        <h4 className="font-medium mb-2">Recent Achievements</h4>
                        <div className="flex flex-wrap gap-2">
                          {shareProgress.achievements.map(achievement => (
                            <span key={achievement} className="px-3 py-1 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 rounded-full text-sm flex items-center">
                              <Trophy className="h-3 w-3 mr-1" />
                              {achievement}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium mb-2">Current Focus</h4>
                        <p className="text-gray-600 dark:text-gray-400">📚 {shareProgress.currentJourney}</p>
                      </div>
                    </div>

                    {/* Sharing Options */}
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Share Your Progress</h3>
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                        <button
                          onClick={() => handleShare('twitter')}
                          className="flex items-center justify-center space-x-2 bg-blue-500 text-white px-4 py-3 rounded-lg hover:bg-blue-600 transition-colors"
                        >
                          <Twitter className="h-4 w-4" />
                          <span>Twitter</span>
                        </button>
                        <button
                          onClick={() => handleShare('facebook')}
                          className="flex items-center justify-center space-x-2 bg-blue-700 text-white px-4 py-3 rounded-lg hover:bg-blue-800 transition-colors"
                        >
                          <Facebook className="h-4 w-4" />
                          <span>Facebook</span>
                        </button>
                        <button
                          onClick={() => handleShare('linkedin')}
                          className="flex items-center justify-center space-x-2 bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          <Linkedin className="h-4 w-4" />
                          <span>LinkedIn</span>
                        </button>
                        <button
                          onClick={() => handleShare('copy')}
                          className="flex items-center justify-center space-x-2 bg-gray-600 text-white px-4 py-3 rounded-lg hover:bg-gray-700 transition-colors"
                        >
                          <Copy className="h-4 w-4" />
                          <span>Copy</span>
                        </button>
                        <button
                          onClick={() => handleShare('download')}
                          className="flex items-center justify-center space-x-2 bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 transition-colors"
                        >
                          <Download className="h-4 w-4" />
                          <span>Export</span>
                        </button>
                      </div>
                    </div>

                    {/* Portfolio Integration */}
                    <div className="border dark:border-gray-700 rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 dark:text-white mb-2">Portfolio Integration</h4>
                      <p className="text-gray-600 dark:text-gray-400 mb-3">Add your learning progress to your creative portfolio</p>
                      <button className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600">
                        Add to Portfolio
                      </button>
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Chat Interface */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <MessageCircle className="h-6 w-6 mr-2 text-purple-500" />
              AI Learning Assistant
            </h3>
            
            <div className="space-y-4 max-h-96 overflow-y-auto mb-4">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex items-start space-x-3 ${msg.isAI ? 'flex-row-reverse space-x-reverse' : ''}`}>
                  <div className={`rounded-full p-2 ${msg.isAI ? 'bg-purple-100 dark:bg-purple-900' : 'bg-gray-200 dark:bg-gray-700'}`}>
                    {msg.isAI ? <Brain className="h-5 w-5 text-purple-600" /> : <Users className="h-5 w-5 text-gray-600" />}
                  </div>
                  <div className={`max-w-xl p-4 rounded-lg ${msg.isAI ? 'bg-purple-50 dark:bg-purple-800 text-purple-900 dark:text-purple-100' : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100'}`}>
                    {renderMessage(msg.text)}
                    {msg.confidence && (
                      <div className="mt-2 text-xs opacity-75">
                        Confidence: {msg.confidence}%
                      </div>
                    )}
                    {msg.attachments && msg.attachments.length > 0 && (
                      <div className="mt-3 space-y-2">
                        {msg.attachments.map(attachment => (
                          <div key={attachment.id} className="border rounded p-2 text-sm">
                            <div className="font-medium">{attachment.title}</div>
                            <div className="text-xs opacity-75">{attachment.description}</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex items-start space-x-3 flex-row-reverse space-x-reverse">
                  <div className="rounded-full p-2 bg-purple-100 dark:bg-purple-900">
                    <Brain className="h-5 w-5 text-purple-600" />
                  </div>
                  <div className="max-w-xl p-4 rounded-lg bg-purple-50 dark:bg-purple-800 text-purple-900 dark:text-purple-100">
                    <div className="flex items-center space-x-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-purple-600 border-t-transparent"></div>
                      <span>Analyzing and generating personalized guidance...</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <form onSubmit={handleSendMessage} className="flex space-x-3">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask for guidance, feedback, or community connections..."
                className="flex-1 p-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading || !inputValue.trim()}
                className="bg-purple-500 text-white px-6 py-3 rounded-lg hover:bg-purple-600 disabled:opacity-50 transition-colors"
              >
                <Send className="h-5 w-5" />
              </button>
            </form>
          </div>
        </div>

        {/* Sidebar - Analytics */}
        <div className="space-y-6">
          {/* Skill Radar Chart */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <Target className="h-5 w-5 mr-2 text-blue-500" />
              Skill Assessment
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <RadarChart data={skillData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="subject" className="text-xs" />
                <PolarRadiusAxis domain={[0, 100]} className="text-xs" />
                <Radar 
                  name="Skill Level" 
                  dataKey="A" 
                  stroke="#8b5cf6" 
                  fill="#8b5cf6" 
                  fillOpacity={0.3}
                  strokeWidth={2}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {/* Progress Chart */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <TrendingUp className="h-5 w-5 mr-2 text-green-500" />
              Learning Progress
            </h3>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={progressData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="progress" 
                  stroke="#8b5cf6" 
                  strokeWidth={3}
                  dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 4 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="engagement" 
                  stroke="#06b6d4" 
                  strokeWidth={2}
                  dot={{ fill: '#06b6d4', strokeWidth: 2, r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Quick Actions */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button className="w-full flex items-center space-x-3 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors">
                <Sparkles className="h-5 w-5 text-purple-500" />
                <span className="text-gray-900 dark:text-white">Start AI Practice Session</span>
              </button>
              <button className="w-full flex items-center space-x-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors">
                <Users className="h-5 w-5 text-blue-500" />
                <span className="text-gray-900 dark:text-white">Join Study Group</span>
              </button>
              <button className="w-full flex items-center space-x-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors">
                <Award className="h-5 w-5 text-green-500" />
                <span className="text-gray-900 dark:text-white">View Achievements</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
