// Test script to verify Mistral API key
const API_KEY = 'OYSWZkr2GOl2IDJrctvrTb8FgEx1nFcC';

async function testMistralAPI() {
  try {
    console.log('Testing Mistral API with key:', API_KEY.substring(0, 10) + '...');
    
    const response = await fetch('https://api.mistral.ai/v1/models', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('Response status:', response.status);
    
    if (response.ok) {
      const data = await response.json();
      console.log('Available models:', data.data?.map(m => m.id) || 'No models found');
    } else {
      const errorText = await response.text();
      console.log('Error response:', errorText);
    }
  } catch (error) {
    console.error('Test failed:', error.message);
  }
}

testMistralAPI(); 