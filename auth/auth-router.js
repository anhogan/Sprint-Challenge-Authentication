const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { jwtSecret } = require('../config/secrets');
const Users = require('./auth-model');

router.post('/register', validateUser, (req, res) => {
  const newUser = req.body;
  const hash = bcrypt.hashSync(newUser.password, 8);
  newUser.password = hash;

  Users.add(newUser)
    .then(user => {
      const token = generateToken(user);

      res.status(201).json({ user, token });
    })
    .catch(error => {
      res.status(500).json({ message: "The user could not be registered", error });
    });
});

router.post('/login', validateUser, (req, res) => {
  let { username, password } = req.body;

  Users.findBy({ username }).first()
    .then(user => {
      if (user && bcrypt.compareSync(password, user.password)) {
        const token = generateToken(user);

        res.status(200).json({ message: `Welcome ${user.username}`, token });
      } else {
        res.status(401).json({ message: "Invalid credentials" });
      };
    })
    .catch(error => {
      res.status(500).json({ message: "Uanble to log in", error });
    });
});

router.get('/logout', (req, res) => {
  const { authorization } = req.headers;

  if (authorization) {
    res.status(200).json({ message: "Successfully logged out" });
  } else {
    res.status(500).json({ message: "Already logged out" });
  };
});

function generateToken(user) {
  const payload = {
    subject: user.id,
    username: user.username
  };

  const options = {
    expiresIn: '1h'
  };

  return jwt.sign(payload, jwtSecret, options)
};

function validateUser(req, res, next) {
  if (Object.keys(req.body).length === 0) {
    res.status(400).json({ message: "Missing user data" });
  } else if (!req.body.username || !req.body.password) {
    res.status(400).json({ message: "Each user must have a username and a password" });
  } else {
    next();
  };
};

module.exports = router;
