process.env.NODE_ENV === "dev" && require("dotenv").config();
const express = require('express');
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


// Setting up the Router
const app = express();
// Defining the port where to run the up
// In devMode the port is 3000
// But In prod it will be the prod port
const port = process.env.PORT ?? 3000;

// Setting up middlewares
app.use(cors());
app.use(express.json());

// Routes (endpoints) of the API
app.get('/', (_req, res) => res.send("Smart Brain Api"));
app.post("/signin", (req, res) => handleSignin(req, res, db, bcrypt));
app.post('/register', (req, res) => handleRegister(req, res, db, bcrypt));
app.post('/imageUrl', (req, res) => handleApiCall(req, res));
app.put('/image', (req, res) => handleImage(req, res, db));
app.post('/changeProfilePic/:id',  upload, (req, res) => changeProfilePic(req, res, db));
app.post('/deleteAccount/:id', (req, res) => deleteAccount(req, res, db, bcrypt));

// Handling any request other than the above
app.all('*', (req, res) => res.status(404).send("Page Not Found"));

// Listening to the default port
app.listen(port, () => {
  console.log(`app running on port ${port}`);
});
