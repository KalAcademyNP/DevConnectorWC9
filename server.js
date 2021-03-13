const express = require('express');
const mongoose = require('mongoose');
const keys = require('./config/keys');
const users = require('./routes/api/users');
const profile = require('./routes/api/profile');
const posts = require('./routes/api/posts');
const app = express();

//Body-parser config
app.use(express.urlencoded({extended: false}));
app.use(express.json());

//Db config
const db = keys.mongoURI;
mongoose
  .connect(db)
  .then(() => console.log('Mongodb connected'))
  .catch(err => console.log(err) );

//First route
app.get('/', (req,res) => res.send('Hello World') );
app.use('/api/users', users);
app.use('/api/profile', profile);
app.use('/api/posts', posts);

const port = 8000;
app.listen(port, () => console.log(`Server is running on port ${port}`));
