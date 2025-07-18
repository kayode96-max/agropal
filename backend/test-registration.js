const axios = require('axios');

async function testRegistration() {
  try {
    const userData = {
      name: "Test User Frontend",
      email: "testfrontend" + Date.now() + "@example.com", // Make email unique
      password: "password123",
      phone: "+2347012345678",
      location: {
        state: "Lagos",
        localGovernment: "Ikeja"
      },
      profile: {
        primaryCrops: ["Rice", "Maize"],
        preferredLanguage: "en"
      }
    };

    console.log('Sending registration request...');
    console.log('Data:', JSON.stringify(userData, null, 2));

    const response = await axios.post('http://localhost:5001/api/auth/register', userData, {
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 10000
    });

    console.log('Success!');
    console.log('Status:', response.status);
    console.log('Response:', response.data);
  } catch (error) {
    console.error('Error occurred:');
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Error data:', error.response.data);
    } else {
      console.log('Network error:', error.message);
    }
  }
}

testRegistration();
