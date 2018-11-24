const express = require('express');
const router = express.Router();
const User = require('../../models/User')
const bcrypt = require('bcryptjs');
const gravatar = require('gravatar');
const jwt = require('jsonwebtoken');
const keys = require('../../config/keys');

// @route     GET api/users/test
// @desc      Tests users route
// @access    Public
router.get('/test', (req, res) => res.json({"msg": "USERS WORKS"}));

// @route     GET api/users/register
// @desc      Register user
// @access    Public
router.post('/register', (req, res) => {
  User.findOne({ email: req.body.email })
  .then(user => {
    if(user) {
      return res.status(400).json({ email: 'EMAIL ALREADY EXISTS' });
    } else {
      const avatar = gravatar.url(req.body.email, {
        s: '200', // -SIZE
        r: 'pg',  // -RATING
        d: 'mm'   // -DEFAULT
      });
      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        avatar,
        password: req.body.password
      });

      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if(err) throw err;
          newUser.password = hash;
          newUser.save()
          .then(user => res.json(user))
          .catch(err => console.log(err));
        })
      });
    }
  });
});

// @route     GET api/users/login
// @desc      Login User
// @access    Public

router.post('/login', (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  // Find User by EMAIL
  User.findOne({email})
    .then(user => {
      // Check for User
      if(!user) res.status(404).json({email: 'User not found'})

      // Check Password
      bcrypt.compare(password, user.password)
        .then(isMatch => {
          if(isMatch) {
            // User matched, CREATE PAYLOAD
            const payload = {
              id: user.id,
              name: user.name,
              avatar: user.avatar
            };
            // Sign Token
            jwt.sign(
              payload,
              keys.key,
              { expiresIn: 3600 },
              (err, token) => {
                res.json({
                  success: true,
                  token: 'Bearer ' + token
                });
              });
          } else {
            return res.status(400).json({password: 'FUCK-OFF DONNY!'});
          }
        });
    });
});

module.exports = router;
