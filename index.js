const express = require('express');
const dotenv = require('dotenv');

const app = express();
dotenv.config({ path: './config/config.env' });
require('./config/db');

const qsRouter = require('./routes/questions');
const userRouter = require('./routes/users');
const authRouter = require('./routes/auth');
const errorHandler = require('./middlewares/error');

const port = process.env.PORT;

app.use(express.json());

app.use('/api/questions', qsRouter);
app.use('/api/users', userRouter);
app.use('/api/auth', authRouter);

app.use(errorHandler);

app.listen(port, () => console.log(`Server is listening on port ${port} `));
