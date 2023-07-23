// Create web server
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { randomBytes } = require('crypto');

// Create express app
const app = express();
app.use(bodyParser.json());
app.use(cors());

// Create comments object
const commentsByPostId = {};

// Create routes
app.get('/posts/:id/comments', (req, res) => {
  // Return comments for a given post id
  res.send(commentsByPostId[req.params.id] || []);
});

app.post('/posts/:id/comments', (req, res) => {
  // Create a new comment
  const commentId = randomBytes(4).toString('hex');
  const { content } = req.body;
  const comments = commentsByPostId[req.params.id] || [];

  comments.push({ id: commentId, content, status: 'pending' });
  commentsByPostId[req.params.id] = comments;

  // Emit event to event bus
  res.status(201).send(comments);
});

app.listen(4001, () => {
  console.log('Listening on 4001');
});