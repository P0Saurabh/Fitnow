const admin = require('firebase-admin');
const express = require('express');
const bodyParser = require('body-parser');

const serviceAccount = require('./fitnesswebsite-731b5-firebase-adminsdk-owcpa-d821d15f4f.json'); // Update path to your service account key

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://your-project-id.firebaseio.com' // Replace with your Firebase project's databaseURL
});

const app = express();
const port = process.env.PORT || 3000;  // Use the PORT environment variable if available

app.use(bodyParser.json());

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

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
