const express = require('express');
const bodyParser = require('body-parser');
const bcrypt= require('bcrypt-nodejs');
const cors = require('cors');
const multer = require('multer');
const upload = multer().single('image');

const db = require("./database/connection");
const handleRegister= require('./controllers/register');
const handleSignin = require('./controllers/signin');
const { handleApiCall, handleImage } = require('./controllers/image');
const changeProfilePic = require('./controllers/profileChanger');
const deleteAccount = require('./controllers/deleteAccount');

const app =express();
app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => res.send(db.user));
app.post("/signin", (req, res) => handleSignin(req, res, db, bcrypt));
app.post('/register', (req, res) => handleRegister(req, res, db, bcrypt));
app.post('/imageurl', (req, res) => handleApiCall(req, res));
app.put('/image', (req, res) => handleImage(req, res, db));
app.post('/changeProfilePic/:id',  upload, (req, res) => changeProfilePic(req, res, db));
app.post('/deleteAccount/:id', (req, res) => deleteAccount(req, res, db, bcrypt));

app.all('*', (req, res) => res.status(404).send("Page Not Found"));

app.listen(process.env.PORT || 3000, () => {
  console.log(`app running on port ${process.env.PORT ? process.env.PORT : 3000}`);
})
