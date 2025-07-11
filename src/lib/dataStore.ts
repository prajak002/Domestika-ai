interface User {
  id: string;
  name: string;
  email: string;
  skillLevel: string;
  preferences: string[];
  joinDate: string;
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

interface Design {
  id: string;
  title: string;
  userId: string;
  imageUrl: string;
  createdAt: string;
  feedback?: DesignFeedback;
  variations?: DesignVariation[];
}

interface DesignFeedback {
  aspects: {
    aspect: string;
    score: number;
    suggestion: string;
  }[];
  styleAnalysis: {
    name: string;
    value: number;
    color: string;
  }[];
  overallScore: number;
}

interface DesignVariation {
  id: string;
  title: string;
  description: string;
  confidence: number;
  type: string;
  generatedImageUrl?: string;
}

interface Conversation {
  id: string;
  userId: string;
  messages: ChatMessage[];
  createdAt: string;
  updatedAt: string;
}

interface ChatMessage {
  id: string;
  conversationId: string;
  text: string;
  isAI: boolean;
  timestamp: string;
  confidence?: number;
}

interface SkillProgress {
  userId: string;
  skill: string;
  current: number;
  target: number;
  color: string;
  weeklyProgress?: { week: string; progress: number }[];
}

interface Achievement {
  id: string;
  userId: string;
  title: string;
  description: string;
  icon: string;
  date: string;
  rarity: string;
}

class DataStore {
  private users: User[] = [];
  private courses: Course[] = [];
  private designs: Design[] = [];
  private conversations: Conversation[] = [];
  private skillProgress: SkillProgress[] = [];
  private achievements: Achievement[] = [];

  // Initialize with sample data or load from storage
  constructor() {
    this.loadFromStorage();
    this.initializeSampleData();
  }

  private loadFromStorage() {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('domestika-ai-data');
      if (stored) {
        const data = JSON.parse(stored);
        this.users = data.users || [];
        this.courses = data.courses || [];
        this.designs = data.designs || [];
        this.conversations = data.conversations || [];
        this.skillProgress = data.skillProgress || [];
        this.achievements = data.achievements || [];
      }
    }
  }

  private saveToStorage() {
    if (typeof window !== 'undefined') {
      const data = {
        users: this.users,
        courses: this.courses,
        designs: this.designs,
        conversations: this.conversations,
        skillProgress: this.skillProgress,
        achievements: this.achievements
      };
      localStorage.setItem('domestika-ai-data', JSON.stringify(data));
    }
  }

  private initializeSampleData() {
    if (this.users.length === 0) {
      // Add sample user
      this.addUser({
        id: 'user_1',
        name: 'Creative Learner',
        email: 'learner@domestika.org',
        skillLevel: 'Intermediate',
        preferences: ['Design', 'Typography', 'Branding'],
        joinDate: new Date().toISOString()
      });

      // Add sample skill progress
      this.skillProgress.push(
        { userId: 'user_1', skill: 'Digital Art', current: 75, target: 90, color: '#8B5CF6' },
        { userId: 'user_1', skill: 'Color Theory', current: 88, target: 95, color: '#3B82F6' },
        { userId: 'user_1', skill: 'Typography', current: 65, target: 85, color: '#10B981' },
        { userId: 'user_1', skill: 'Branding', current: 72, target: 88, color: '#F59E0B' }
      );

      // Add sample achievements
      this.achievements.push(
        {
          id: 'ach_1',
          userId: 'user_1',
          title: 'Color Master',
          description: 'Completed 10 color theory exercises',
          icon: 'Palette',
          date: '2025-07-10',
          rarity: 'gold'
        },
        {
          id: 'ach_2',
          userId: 'user_1',
          title: 'Community Helper',
          description: 'Helped 5 fellow learners',
          icon: 'Users',
          date: '2025-07-09',
          rarity: 'silver'
        }
      );

      this.saveToStorage();
    }
  }

  // User methods
  addUser(user: User) {
    this.users.push(user);
    this.saveToStorage();
  }

  getUser(id: string): User | undefined {
    return this.users.find(u => u.id === id);
  }

  getCurrentUser(): User | undefined {
    // Return the first user as default, or implement proper user session management
    return this.users[0];
  }

  // Course methods
  addCourse(course: Course) {
    this.courses.push(course);
    this.saveToStorage();
  }

  getCourses(): Course[] {
    return this.courses;
  }

  getRecommendedCourses(userSkills: string[], limit = 3): Course[] {
    return this.courses
      .filter(course => course.skills.some(skill => userSkills.includes(skill)))
      .sort((a, b) => b.aiMatch - a.aiMatch)
      .slice(0, limit);
  }

  // Design methods
  addDesign(design: Design) {
    this.designs.push(design);
    this.saveToStorage();
  }

  getDesigns(userId?: string): Design[] {
    return userId ? this.designs.filter(d => d.userId === userId) : this.designs;
  }

  getDesign(id: string): Design | undefined {
    return this.designs.find(d => d.id === id);
  }

  updateDesign(designId: string, updates: Partial<Design>) {
    const design = this.designs.find(d => d.id === designId);
    if (design) {
      Object.assign(design, updates);
      this.saveToStorage();
    }
  }

  updateDesignFeedback(designId: string, feedback: DesignFeedback) {
    const design = this.designs.find(d => d.id === designId);
    if (design) {
      design.feedback = feedback;
      this.saveToStorage();
    }
  }

  addDesignVariation(designId: string, variation: DesignVariation) {
    const design = this.designs.find(d => d.id === designId);
    if (design) {
      design.variations = design.variations || [];
      design.variations.push(variation);
      this.saveToStorage();
    }
  }

  // Conversation methods
  createConversation(userId: string): string {
    const conversation: Conversation = {
      id: `conv_${Date.now()}`,
      userId,
      messages: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.conversations.push(conversation);
    this.saveToStorage();
    return conversation.id;
  }

  addMessage(conversationId: string, message: Omit<ChatMessage, 'conversationId'>) {
    const conversation = this.conversations.find(c => c.id === conversationId);
    if (conversation) {
      conversation.messages.push({ ...message, conversationId });
      conversation.updatedAt = new Date().toISOString();
      this.saveToStorage();
    }
  }

  getConversation(id: string): Conversation | undefined {
    return this.conversations.find(c => c.id === id);
  }

  // Skill progress methods
  updateSkillProgress(userId: string, skill: string, progress: number) {
    const existing = this.skillProgress.find(s => s.skill === skill && s.userId === userId);
    if (existing) {
      existing.current = progress;
    } else {
      this.skillProgress.push({
        userId,
        skill,
        current: progress,
        target: 100,
        color: `#${Math.floor(Math.random()*16777215).toString(16)}`,
        weeklyProgress: []
      });
    }
    this.saveToStorage();
  }

  getSkillProgress(userId?: string): SkillProgress[] {
    return userId ? this.skillProgress.filter(s => s.userId === userId) : this.skillProgress;
  }

  // Achievement methods
  addAchievement(achievement: Achievement) {
    this.achievements.push(achievement);
    this.saveToStorage();
  }

  getAchievements(): Achievement[] {
    return this.achievements;
  }

  getUserAchievements(userId: string): Achievement[] {
    return this.achievements.filter(a => a.userId === userId);
  }

  // Analytics methods
  getEngagementMetrics() {
    const totalDesigns = this.designs.length;
    const totalConversations = this.conversations.length;
    const avgRating = this.courses.reduce((sum, course) => sum + course.rating, 0) / this.courses.length;
    
    return {
      totalDesigns,
      totalConversations,
      avgRating: avgRating || 0,
      activeUsers: this.users.length
    };
  }

  getUserJourneyData() {
    return [
      { stage: 'Discovery', users: this.users.length, conversion: 100 },
      { stage: 'Registration', users: Math.floor(this.users.length * 0.8), conversion: 80 },
      { stage: 'First Design', users: this.designs.length > 0 ? this.designs.length : 1, conversion: 60 },
      { stage: 'Course Enrollment', users: Math.floor(this.courses.length * 0.4), conversion: 40 },
      { stage: 'Active Creator', users: Math.floor(this.designs.length * 0.6), conversion: 25 }
    ];
  }
}

export const dataStore = new DataStore();
export type { User, Course, Design, DesignFeedback, DesignVariation, Conversation, ChatMessage, SkillProgress, Achievement };
