const express = require('express');
const mongoose = require('mongoose');
const app = express();

app.get('/', (req, res) => res.send('hello there'));

var db = require('./config/keys').mongoURI;
mongoose
  .connect(db)
  .then(() => console.log('MONGODB CONNECTED'))
  .catch(err => console.log(err));

const port  = process.env.PORT || 5000;

app.listen(port, () => console.log(`SERVER RUNNING ON PORT ${port}`));
