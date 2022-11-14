const express = require('express');
const path = require('path');
const mainRouter = require('./routes/main.router');

const port = process.env.PORT || '8080';
const app = express();

app.use(express.static(path.resolve(__dirname, '..', 'client', 'dist')));
app.use(express.urlencoded({ extended: true }));

app.use('/', mainRouter);

app.listen(port, () => {
  console.log('http://localhost:8080');
});
