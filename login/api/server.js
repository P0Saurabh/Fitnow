const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(cors()); // Enable CORS for all routes

const apiKey = "AIzaSyCn_09xXc9VQbQRoF9dUGBkRP4up-wgSVw"; // Replace with your actual Gemini API key
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-1.0-pro", // Adjust the model as per your requirements
});

app.post('/chat', async (req, res) => {
  const userInput = req.body.message;

  try {
    const chatSession = model.startChat({
      history: [
        {
          role: "user",
          parts: [
            { text: userInput },
          ],
        },
      ],
    });

    const result = await chatSession.sendMessage(userInput);
    res.json({ response: result.response.text() });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while processing your request.' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
