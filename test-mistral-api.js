// Test script to verify Mistral API integration
const testMistralAPI = async () => {
  try {
    console.log('Testing Mistral API endpoint...');
    
    const response = await fetch('http://localhost:3000/api/mistral', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: 'Explain color theory basics for digital artists',
        type: 'creative_learning'
      }),
    });

    console.log('Response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error:', errorText);
      return;
    }

    const data = await response.json();
    console.log('API Response:', data);
    
    if (data.text || data.response) {
      console.log('✅ Mistral API is working properly!');
      console.log('Response preview:', (data.text || data.response).substring(0, 200) + '...');
    } else {
      console.log('⚠️ API responded but with unexpected format:', data);
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
};

// Run the test
testMistralAPI();
