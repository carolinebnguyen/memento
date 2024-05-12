const express = require('express');
const morgan = require('morgan');
const timeout = require('connect-timeout');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

const PORT = process.env.PORT || 9000;

const app = express();
app.use(morgan('dev'));
app.use(timeout('5s'));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
  cors({
    origin: [
      'http://memento.carolinenguyen.me',
      'http://memento.us-east-2.elasticbeanstalk.com',
    ],
  })
);

app.use(express.static(path.resolve(__dirname, '../client/build')));

const userRoutes = require('./routes/userRoutes');
app.use('/api/user', userRoutes);

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
