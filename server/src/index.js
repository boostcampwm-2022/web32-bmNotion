const express = require('express');
const path = require('path');
const cors = require('cors');

const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const mainRouter = require('./main/main.router');
const authRouter = require('./auth/auth.router');
const pageRouter = require('./page/page.router');
const userRouter = require('./user/user.router');
const blockRouter = require('./block/block.router');
const workspaceRouter = require('./workspace/workspace.router');
const sseConnect = require('./sse/sse.connect');

const port = process.env.PORT || '8080';
const app = express();

const server = app.listen(port, () => {
  console.log('http://localhost:8080');
});

const sse = sseConnect(server, app);
app.set('sse', sse);

app.use(cors({ origin: 'http://localhost:3000', credentials: true }));

require('dotenv').config();

app.use(bodyParser.raw({ limit: '10mb', type: 'application/octet-stream' }));
app.use(express.static(path.resolve(__dirname, '..', '..', 'client', 'dist')));
// app.use('/*', express.static(path.resolve(__dirname, '..', '..', 'client', 'dist')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRouter);
app.use('/api/page', pageRouter);
app.use('/api/workspace', workspaceRouter);
app.use('/api/user', userRouter);
app.use('/api/block', blockRouter);
app.use('/', mainRouter);
