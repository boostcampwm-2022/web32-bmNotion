const express = require('express');
const path = require('path');
const mainRouter = require('./main/main.router.js');

const port = process.env.PORT || '8080';
const app = express();

require('dotenv').config();

app.use(express.static(path.resolve(__dirname, '..', 'client', 'dist')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/', mainRouter);

app.listen(port, () => { });

