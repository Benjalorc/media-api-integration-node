var express = require('express');
var app = express();
var mediaRouter = require('./routes/media');

app.use('/', mediaRouter);

app.listen(3000, ()=> {
  console.log('Listening');
});

module.exports = app;