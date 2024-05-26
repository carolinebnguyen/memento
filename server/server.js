require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const timeout = require('connect-timeout');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const path = require('path');
const { verifyAccessToken } = require('./utils/authUtils');

const app = express();
app.use(morgan('dev'));
app.use(timeout('5s'));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
  cors({
    origin: [
      'http://localhost:3000',
      'http://memento.carolinenguyen.me',
      'http://memento.us-east-2.elasticbeanstalk.com',
    ],
  })
);

app.use(express.static(path.resolve(__dirname, '../client/build')));

app.use('/api/auth', require('./routes/auth'));
app.use('/api/**', verifyAccessToken);
app.use('/api/users', require('./routes/users'));
app.use('/api/posts', require('./routes/posts'));
app.use('/api/notifications', require('./routes/notifications'));
app.use('/api/comments', require('./routes/comments'));
app.use('/api/messages', require('./routes/messages'));

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
});

const PORT = process.env.PORT || 9000;
app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
