const express = require('express');
const path = require('path');
const mainRouter = require('./main/main.router');
const apiRouter = require('./api/api.router');

const port = process.env.PORT || '8080';
const app = express();

app.use(express.static(path.resolve(__dirname, '..', 'client', 'dist')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/', mainRouter);
app.use('/api', apiRouter);

app.listen(port, () => {});
