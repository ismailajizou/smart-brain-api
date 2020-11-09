const express = require('express');
const bodyParser = require('body-parser');
const bcrypt= require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');
const multer = require('multer');
const upload = multer().single('image')

const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');
const profileChanger = require('./controllers/profileChanger');

const db = knex({
  client: 'pg',
  connection: {
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  }
});
const app =express();
app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => res.send(db.users))
app.post("/signin", signin.handleSignin(db, bcrypt));
app.post('/register', (req, res) => register.handleRegister(req, res, db, bcrypt));
app.get('/profile/:id', (req, res) => profile.handleProfile(req, res, db));
app.put('/image', (req, res) => image.handleImage(req, res, db));
app.post('/imageurl', (req, res) => image.handleApiCall(req, res));
app.post('/changeProfilePic',  upload,(req, res) => profileChanger.changeProfilePic(req, res, db));

app.listen(process.env.PORT || 3000, () => {
  console.log(`app running on port ${process.env.PORT ? process.env.PORT : 3000}`);
})