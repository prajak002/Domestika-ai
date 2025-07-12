// Test script to verify Mistral API integration
const testAPI = async () => {
  try {
    console.log('Testing Mistral API...');
    
    const response = await fetch('http://localhost:3000/api/mistral', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: 'Hello, can you help me with my creative learning journey?',
        type: 'learning_recommendation',
        maxTokens: 100
      }),
    });

    console.log('Response status:', response.status);
    
    if (!response.ok) {
      const errorData = await response.text();
      console.error('API Error:', errorData);
      return;
    }

    const data = await response.json();
    console.log('API Response success:', data.success);
    console.log('Response text preview:', data.text?.substring(0, 100) + '...');
    
  } catch (error) {
    console.error('Test failed:', error);
  }
};

testAPI();
