const express = require('express');
const path = require('path');
const cors = require('cors');
const mainRouter = require('./main/main.router');
const authRouter = require('./auth/auth.router');
const editRouter = require('./edit/edit.router');
const pageRouter = require('./page/page.router');

const port = process.env.PORT || '8080';
const app = express();
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));

require('dotenv').config();

app.use(express.static(path.resolve(__dirname, '..', '..', 'client', 'dist')));
app.use('/page', express.static(path.resolve(__dirname, '..', '..', 'client', 'dist')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/', mainRouter);
app.use('/auth', authRouter);
app.use('/page', pageRouter);
app.use('/edit', editRouter);

app.listen(port, () => {
  console.log('연결 성공');
});
