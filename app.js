import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import Sentiment from 'sentiment';
import bodyParser from 'body-parser';
import  sendEmail from './sendEmail.js'; 

const app = express();
const sentiment = new Sentiment();

const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

function analyzeComment(commentText) {
  const result = sentiment.analyze(commentText);
  return {
    text: commentText,
    sentiment: result.score < 0 ? 'negative' : 'positive'
  };
}

// Endpoint to handle comment submission
app.post('/submit-comment', async (req, res) => {
  const comment = req.body.comment;
  const analysis = analyzeComment(comment);

  if (analysis.sentiment === 'negative') {
    const subject = 'Negative Comment Received';
    const text = `A Negative comment was posted: ${analysis.text}`;
    await sendEmail(process.env.ADMIN_EMAIL, subject, text);
  }
  
  res.json(analysis);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
