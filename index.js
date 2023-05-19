const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
require('dotenv').config();

const path = require('path');

const mongoose = require('mongoose');

mongoose
  .connect(process.env.DB)
  .then(() => {
    console.log('Successfully connected to database');
  })
  .catch((error) => {
    console.log('database connection failed. exiting now...');
    console.error(error);
    process.exit(1);
  });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const { userRouter } = require('./routes/userRoutes');
const { authRouter } = require('./routes/authRoutes');
const { topicsRouter } = require('./routes/topicRoutes');
const { tagsRouter } = require('./routes/tagsRoutes');
const { upvoteRouter } = require('./routes/upvoteRoutes');
const { commentsRouter } = require('./routes/commentRoutes');

app.use(cors());

app.use('/user', userRouter);
app.use('/auth', authRouter);
app.use('/tags', tagsRouter);
app.use('/topics', topicsRouter);
app.use('/comments', commentsRouter);
app.use('/', upvoteRouter);

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const port = process.env.PORT || 8080;

const start = async () => {
  try {
    app.listen(port);
  } catch (err) {
    console.error(`Error on server startup: ${err.message}`);
  }
};

start();

const errorHandler = (err, req, res, next) => {
  if (err.statusCode) {
    res.status(err.statusCode).json({ error: err.message });
  } else {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
// ERROR HANDLER
app.use(errorHandler);
