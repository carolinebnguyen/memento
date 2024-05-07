const express = require('express');
const morgan = require('morgan');
const timeout = require('connect-timeout');
const cookieParser = require('cookie-parser');
const path = require('path');

const PORT = process.env.PORT || 9000;

const app = express();
app.use(morgan('dev'));
app.use(timeout('5s'));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Server serves files for the built frontend
app.use(express.static(path.resolve(__dirname, '../client/build')));

// Handle GET requests to /api/test route
app.get('/api/test', function (req, res) {
  res.json({ message: 'Hello Snowie!', from: 'Caroline' });
});

// All other GET requests not handled before will default to index.html
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
