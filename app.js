var express = require('express');
var app = express();
var mediaRouter = require('./routes/media');

app.use((req, res, next)=> {
  res.header("Access-Control-Allow-Origin", "http://localhost:4200");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use('/', mediaRouter);

app.listen(3000, ()=> {
  console.log('Listening');
});

module.exports = app;