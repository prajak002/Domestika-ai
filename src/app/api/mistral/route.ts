import { NextRequest, NextResponse } from 'next/server';

const MISTRAL_API_KEY = process.env.MISTRAL_API_KEY || 'd4aXEtqo3GIDOfq1wmNnAUgGmzIZQGpk';
const MISTRAL_API_BASE = 'https://api.mistral.ai/v1';

export async function POST(request: NextRequest) {
  try {
    console.log('Mistral API route called'); // Debug log
    console.log('API Key available:', !!MISTRAL_API_KEY); // Debug log
    console.log('API Key starts with:', MISTRAL_API_KEY?.substring(0, 10)); // Debug log
    
    // Check if API key is available
    if (!MISTRAL_API_KEY) {
      console.error('API key not available');
      return NextResponse.json({ 
        error: 'API key not configured',
        success: false,
        message: 'The AI service is currently unavailable. Please contact support.'
      }, { status: 500 });
    }

    const requestBody = await request.json();
    console.log('Request body:', requestBody); // Debug log
    
    const { prompt, type, model = 'mistral-small-latest', imagePrompt, maxTokens = 1000, message } = requestBody;

    // Handle legacy message format
    const actualPrompt = prompt || message;

    if (!actualPrompt && !imagePrompt) {
      return NextResponse.json({ error: 'Prompt or imagePrompt is required' }, { status: 400 });
    }

    // Handle text generation
    if (type === 'text' || type === 'learning_recommendation' || type === 'design_feedback' || type === 'skill_analysis' || !type) {
      let enhancedPrompt = actualPrompt;

      // Enhance prompts based on type
      if (type === 'learning_recommendation') {
        enhancedPrompt = `As a personalized learning expert for Domestika, analyze this learning request and provide specific course recommendations, practice exercises, and a learning path: "${actualPrompt}"`;
      } else if (type === 'design_feedback') {
        enhancedPrompt = `As an expert creative mentor, provide constructive feedback and improvement suggestions for this design work: "${actualPrompt}"`;
      } else if (type === 'skill_analysis') {
        enhancedPrompt = `As a skills assessment expert, analyze the following and provide detailed insights about strengths, areas for improvement, and next steps: "${actualPrompt}"`;
      }

      console.log('Calling Mistral API with prompt:', enhancedPrompt); // Debug log
      
      const response = await fetch(`${MISTRAL_API_BASE}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${MISTRAL_API_KEY}`,
        },
        body: JSON.stringify({
          model: model,
          messages: [
            {
              role: 'user',
              content: enhancedPrompt,
            },
          ],
          max_tokens: maxTokens,
          temperature: 0.7,
        }),
      });

      console.log('Mistral API response status:', response.status); // Debug log

      if (!response.ok) {
        const errorData = await response.text();
        console.error('Mistral API Error:', response.status, errorData);
        return NextResponse.json({ error: 'Failed to generate text' }, { status: response.status });
      }

      const data = await response.json();
      console.log('Mistral API response data:', data); // Debug log
      
      // Validate response structure
      if (!data.choices || !data.choices[0] || !data.choices[0].message) {
        console.error('Invalid response structure:', data);
        throw new Error('Invalid response structure from API');
      }
      
      console.log('Sending successful response'); // Debug log
      
      // Return in both new and legacy formats for compatibility
      return NextResponse.json({ 
        text: data.choices[0].message.content,
        response: data.choices[0].message.content,
        success: true,
        confidence: 95,
        timestamp: new Date().toISOString(),
        usage: data.usage 
      });
    }

    // Handle image generation/analysis
    if (type === 'image') {
      const imageAnalysisPrompt = `As an expert creative assistant, analyze this request: "${imagePrompt || actualPrompt}"
      
      Provide:
      1. A detailed creative description of what should be created
      2. Style recommendations
      3. Technical suggestions for implementation
      4. Color palette suggestions
      5. Composition advice
      
      Format your response as a JSON object with these fields: description, style, technical, colors, composition`;

      const response = await fetch(`${MISTRAL_API_BASE}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${MISTRAL_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'mistral-large-latest',
          messages: [
            {
              role: 'user',
              content: imageAnalysisPrompt,
            },
          ],
          max_tokens: 1500,
          temperature: 0.8,
        }),
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error('Mistral API Error:', errorData);
        return NextResponse.json({ error: 'Failed to generate image analysis' }, { status: response.status });
      }

      const data = await response.json();
      
      // Validate response structure
      if (!data.choices || !data.choices[0] || !data.choices[0].message) {
        throw new Error('Invalid response structure from API');
      }
      
      try {
        const analysisText = data.choices[0].message.content;
        const jsonMatch = analysisText.match(/\{[\s\S]*\}/);
        let analysis;
        
        if (jsonMatch) {
          analysis = JSON.parse(jsonMatch[0]);
        } else {
          analysis = {
            description: analysisText,
            style: "Creative and engaging",
            technical: "High quality digital art",
            colors: "Vibrant and harmonious",
            composition: "Well-balanced and dynamic"
          };
        }

        return NextResponse.json({
          imageAnalysis: analysis,
          fullResponse: analysisText,
          success: true,
          usage: data.usage
        });
      } catch {
        return NextResponse.json({
          imageAnalysis: {
            description: data.choices[0].message.content,
            style: "Creative and engaging",
            technical: "High quality digital art",
            colors: "Vibrant and harmonious",
            composition: "Well-balanced and dynamic"
          },
          fullResponse: data.choices[0].message.content,
          success: true,
          usage: data.usage
        });
      }
    }

    // Handle learning journey analysis
    if (type === 'learning') {
      const learningPrompt = `As a personalized learning expert for Domestika, analyze this learning request: "${actualPrompt}"
      
      Create a comprehensive learning journey including:
      1. Recommended courses (create realistic course names)
      2. Practice exercises and milestones
      3. Skill progression path
      4. Estimated timeline
      5. Community engagement suggestions
      
      Format as JSON with fields: courses, exercises, skillPath, timeline, community`;

      const response = await fetch(`${MISTRAL_API_BASE}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${MISTRAL_API_KEY}`,
        },
        body: JSON.stringify({
          model: model,
          messages: [
            {
              role: 'user',
              content: learningPrompt,
            },
          ],
          max_tokens: 2000,
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error('Mistral API Error:', errorData);
        return NextResponse.json({ error: 'Failed to generate learning journey' }, { status: response.status });
      }

      const data = await response.json();
      
      // Validate response structure
      if (!data.choices || !data.choices[0] || !data.choices[0].message) {
        throw new Error('Invalid response structure from API');
      }
      
      try {
        const learningText = data.choices[0].message.content;
        const jsonMatch = learningText.match(/\{[\s\S]*\}/);
        let learningJourney;
        
        if (jsonMatch) {
          learningJourney = JSON.parse(jsonMatch[0]);
        } else {
          learningJourney = {
            courses: ["Beginner's Guide", "Intermediate Techniques", "Advanced Mastery"],
            exercises: ["Daily practice for 30 minutes", "Weekly projects", "Monthly challenges"],
            skillPath: "Beginner → Intermediate → Advanced → Expert",
            timeline: "3-6 months for significant progress",
            community: "Join study groups, share progress, get feedback"
          };
        }

        return NextResponse.json({
          learningJourney,
          fullResponse: learningText,
          success: true,
          usage: data.usage
        });
      } catch {
        return NextResponse.json({
          learningJourney: {
            courses: ["Beginner's Guide", "Intermediate Techniques", "Advanced Mastery"],
            exercises: ["Daily practice", "Weekly projects", "Monthly challenges"],
            skillPath: "Progressive skill development",
            timeline: "3-6 months",
            community: "Active community engagement"
          },
          fullResponse: data.choices[0].message.content,
          success: true,
          usage: data.usage
        });
      }
    }

    return NextResponse.json({ error: 'Invalid request type' }, { status: 400 });

  } catch (error) {
    console.error('API Error:', error);
    console.error('Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      name: error instanceof Error ? error.name : 'UnknownError'
    });
    return NextResponse.json({ 
      error: 'Internal server error',
      success: false,
      message: 'Our AI assistant is temporarily unavailable. Please try again later.',
      details: error instanceof Error ? error.message : 'Unknown error' // Add error details for debugging
    }, { status: 500 });
  }
}

