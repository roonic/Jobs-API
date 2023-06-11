require('dotenv').config();
require('express-async-errors');
const express = require('express');
const connectDB = require('./db/connect')
const authRouter = require('./routes/auth')
const jobsRouter = require('./routes/jobs')
const authUser = require('./middleware/authentication')

// security
const helmet = require('helmet')
const cors = require('cors')
const rateLimit = require('express-rate-limit')
const xss = require('xss-clean')

const app = express();

// error handler
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

app.use(express.json());
// extra packages
app.set('trust proxy', 1)
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
}))
app.use(helmet())
app.use(cors())
app.use(xss())

// routes
app.use('/api/v1/auth', authRouter)
app.use('/api/v1/jobs', authUser, jobsRouter)

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 8000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI)
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
