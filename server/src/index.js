const express = require('express');
const path = require('path');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const mainRouter = require('./main/main.router');
const authRouter = require('./auth/auth.router');
const pageRouter = require('./page/page.router');
const userRouter = require('./user/user.router');
const workspaceRouter = require('./workspace/workspace.router');

const port = process.env.PORT || '8080';
const app = express();
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));

require('dotenv').config();

app.use(express.static(path.resolve(__dirname, '..', '..', 'client', 'dist')));
// app.use('/*', express.static(path.resolve(__dirname, '..', '..', 'client', 'dist')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRouter);
app.use('/api/page', pageRouter);
app.use('/api/workspace', workspaceRouter);
app.use('/api/user', userRouter);
app.use('/', mainRouter);

app.listen(port, () => {
  console.log('연결 성공');
});
