// server.js

const express = require('express');
const path = require('path');

const app = express();

// Serve static files from public folder
app.use(express.static(path.join(__dirname, 'static'))); 
app.use(express.static(path.join(__dirname, 'public'))); 
app.use(express.static('public'));


// Handle GET requests to root URL
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname + '/static/english.html'));
});

// Start server 
const port = 3000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

app.get('/get_my_secret', (req, res) => {
  res.json({ mySecret: process.env.MY_SECRET 
  })
});