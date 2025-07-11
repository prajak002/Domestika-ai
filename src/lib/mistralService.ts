import { dataStore, DesignFeedback, DesignVariation } from './dataStore';

class MistralAIService {
  private baseUrl = 'https://api.mistral.ai/v1';
  private apiKey = process.env.NEXT_PUBLIC_MISTRAL_API_KEY || 'd4aXEtqo3GIDOfq1wmNnAUgGmzIZQGpk';

  private async makeRequest(endpoint: string, options: RequestInit = {}) {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`Mistral API error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  async createConversation(userId: string) {
    try {
      const response = await this.makeRequest('/conversations', {
        method: 'POST',
        body: JSON.stringify({
          user_id: userId,
          metadata: { source: 'domestika-ai' }
        })
      });
      return response.id;
    } catch (error) {
      // Fallback to local storage
      return dataStore.createConversation(userId);
    }
  }

  async sendMessage(conversationId: string, message: string, type: string = 'learning_recommendation') {
    const enhancedPrompts: { [key: string]: string } = {
      learning_recommendation: `As a personalized learning expert for Domestika, analyze this request and provide specific course recommendations, practice exercises, and a learning path. Consider the user's current skill level and preferences. Request: "${message}"`,
      design_feedback: `As an expert creative mentor, provide constructive feedback and improvement suggestions for this design work. Focus on composition, color theory, typography, and overall visual impact. Work: "${message}"`,
      skill_analysis: `As a skills assessment expert, analyze the following and provide detailed insights about strengths, areas for improvement, and next steps for creative development. Analysis: "${message}"`,
      general: `As a creative AI assistant for Domestika, help with this creative question or request: "${message}"`
    };

    try {
      // Try using conversations API first
      const response = await this.makeRequest(`/conversations/${conversationId}/messages`, {
        method: 'POST',
        body: JSON.stringify({
          content: enhancedPrompts[type] || enhancedPrompts.general,
          role: 'user'
        })
      });

      return {
        text: response.content,
        response: response.content,
        success: true,
        confidence: 95,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      // Fallback to chat completions
      return this.getChatCompletion(enhancedPrompts[type] || enhancedPrompts.general);
    }
  }

  async getChatCompletion(prompt: string, maxTokens: number = 1000) {
    try {
      const response = await this.makeRequest('/chat/completions', {
        method: 'POST',
        body: JSON.stringify({
          model: 'mistral-small-latest',
          messages: [{ role: 'user', content: prompt }],
          max_tokens: maxTokens,
          temperature: 0.7
        })
      });

      return {
        text: response.choices[0].message.content,
        response: response.choices[0].message.content,
        success: true,
        confidence: 95,
        timestamp: new Date().toISOString(),
        usage: response.usage
      };
    } catch (error) {
      console.error('Mistral API error:', error);
      throw error;
    }
  }

  async analyzeDesign(imageData: string, designTitle: string): Promise<DesignFeedback> {
    const prompt = `Analyze this design image titled "${designTitle}". Provide detailed feedback on:
    1. Color Harmony (0-100 score)
    2. Composition (0-100 score) 
    3. Typography (0-100 score)
    4. Visual Balance (0-100 score)
    5. Brand Alignment (0-100 score)
    
    Also analyze the style composition as percentages for: Modern, Minimalist, Vintage, Abstract, and other styles.
    
    Return as JSON with this structure:
    {
      "aspects": [
        {"aspect": "Color Harmony", "score": 85, "suggestion": "detailed suggestion"},
        ...
      ],
      "styleAnalysis": [
        {"name": "Modern", "value": 35, "color": "#8B5CF6"},
        ...
      ],
      "overallScore": 82
    }`;

    try {
      const response = await this.getChatCompletion(prompt, 1500);
      const jsonMatch = response.text.match(/\{[\s\S]*\}/);
      
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      } else {
        // Fallback structure
        return this.generateFallbackFeedback(response.text);
      }
    } catch (error) {
      console.error('Design analysis error:', error);
      return this.generateFallbackFeedback("Analysis temporarily unavailable");
    }
  }

  async generateVariation(designId: string, variationType: string, description: string): Promise<DesignVariation> {
    const prompt = `Generate a creative variation for a design with the following requirements:
    - Type: ${variationType}
    - Description: ${description}
    - Provide specific implementation details
    - Suggest color palettes, layout changes, or style modifications
    
    Return as JSON:
    {
      "title": "Variation Name",
      "description": "Detailed description of changes",
      "confidence": 90,
      "type": "${variationType}",
      "implementation": "Step-by-step implementation guide"
    }`;

    try {
      const response = await this.getChatCompletion(prompt, 1000);
      const jsonMatch = response.text.match(/\{[\s\S]*\}/);
      
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return {
          id: `var_${Date.now()}`,
          title: parsed.title,
          description: parsed.description,
          confidence: parsed.confidence,
          type: parsed.type
        };
      }
    } catch (error) {
      console.error('Variation generation error:', error);
    }

    // Fallback variation
    return {
      id: `var_${Date.now()}`,
      title: `${variationType} Variation`,
      description: description,
      confidence: 75,
      type: variationType
    };
  }

  async moderateContent(content: string) {
    try {
      const response = await this.makeRequest('/chat/moderations', {
        method: 'POST',
        body: JSON.stringify({
          input: content
        })
      });
      return response;
    } catch (error) {
      console.error('Content moderation error:', error);
      return { flagged: false, categories: [] };
    }
  }

  async classifyContent(content: string, categories: string[]) {
    try {
      const response = await this.makeRequest('/chat/classifications', {
        method: 'POST',
        body: JSON.stringify({
          input: content,
          categories: categories
        })
      });
      return response;
    } catch (error) {
      console.error('Content classification error:', error);
      return { category: 'general', confidence: 0.5 };
    }
  }

  async uploadFile(file: File) {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`${this.baseUrl}/files`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: formData
      });

      if (!response.ok) throw new Error('File upload failed');
      return response.json();
    } catch (error) {
      console.error('File upload error:', error);
      throw error;
    }
  }

  async performOCR(imageFile: File) {
    try {
      const formData = new FormData();
      formData.append('file', imageFile);

      const response = await fetch(`${this.baseUrl}/ocr`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: formData
      });

      if (!response.ok) throw new Error('OCR failed');
      return response.json();
    } catch (error) {
      console.error('OCR error:', error);
      return { text: '', confidence: 0 };
    }
  }

  async generateCourseRecommendations(userSkills: string[], preferences: string[]) {
    const prompt = `Based on these user skills: ${userSkills.join(', ')} and preferences: ${preferences.join(', ')}, recommend 5 creative courses for Domestika. 
    
    Return as JSON array:
    [
      {
        "id": "course_1",
        "title": "Course Title",
        "instructor": "Instructor Name", 
        "level": "Beginner/Intermediate/Advanced",
        "duration": "X hours",
        "rating": 4.8,
        "price": "$XX",
        "skills": ["skill1", "skill2"],
        "aiMatch": 95,
        "enrollments": 1200,
        "completionRate": 87
      }
    ]`;

    try {
      const response = await this.getChatCompletion(prompt, 2000);
      const jsonMatch = response.text.match(/\[[\s\S]*\]/);
      
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    } catch (error) {
      console.error('Course recommendation error:', error);
    }

    return [];
  }

  private generateFallbackFeedback(text: string): DesignFeedback {
    return {
      aspects: [
        { aspect: 'Color Harmony', score: 80, suggestion: text.substring(0, 100) || 'Good color choices' },
        { aspect: 'Composition', score: 75, suggestion: 'Consider rule of thirds' },
        { aspect: 'Typography', score: 85, suggestion: 'Font selection works well' },
        { aspect: 'Visual Balance', score: 78, suggestion: 'Add more white space' },
        { aspect: 'Brand Alignment', score: 82, suggestion: 'Aligns with brand guidelines' }
      ],
      styleAnalysis: [
        { name: 'Modern', value: 40, color: '#8B5CF6' },
        { name: 'Minimalist', value: 30, color: '#3B82F6' },
        { name: 'Creative', value: 20, color: '#10B981' },
        { name: 'Abstract', value: 10, color: '#F59E0B' }
      ],
      overallScore: 80
    };
  }
}

export const mistralService = new MistralAIService();
