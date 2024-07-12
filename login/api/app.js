const admin = require('firebase-admin');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Firebase Admin SDK setup
const serviceAccount = require('./login/api/fitnesswebsite-731b5-firebase-adminsdk-owcpa-d821d15f4f.json'); // Update path to your service account key

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://your-project-id.firebaseio.com' // Replace with your Firebase project's databaseURL
});

// Google Generative AI (Gemini) setup
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({
  model: 'gemini-1.0-pro',
});

// Express setup
const app = express();
const port = process.env.PORT || 3000; // Use the PORT environment variable if available

app.use(bodyParser.json());
app.use(cors()); // Enable CORS for all routes

// Serve static files (like index.html) from a directory
app.use(express.static('public'));

// Firebase ID token verification function
async function verifyIdToken(idToken) {
  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const uid = decodedToken.uid;
    return { uid, ...decodedToken };
  } catch (error) {
    console.error('Error verifying ID token:', error);
    return null;
  }
}

// API endpoint to verify Firebase ID token
app.post('/api/verifyToken', async (req, res) => {
  const idToken = req.body.idToken;
  try {
    const user = await verifyIdToken(idToken);
    if (user) {
      res.status(200).json({ message: 'User verified', user });
    } else {
      res.status(401).json({ message: 'Invalid ID token or user not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error });
  }
});

// API endpoint to interact with Gemini AI
app.post('/api/generateResponse', async (req, res) => {
  const userInput = req.body.userInput;
  try {
    const chatSession = model.startChat({
      generationConfig: {
        temperature: 0.9,
        topP: 1,
        topK: 1,
        maxOutputTokens: 2048,
        responseMimeType: 'text/plain',
      },
      history: [
        {
          role: 'user',
          parts: [{ text: userInput }],
        },
      ],
    });

    const result = await chatSession.sendMessage();
    const botResponse = result.response.text();
    res.status(200).json({ response: botResponse });
  } catch (error) {
    console.error('Error generating response from Gemini:', error);
    res.status(500).json({ message: 'Failed to generate response from Gemini', error });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
