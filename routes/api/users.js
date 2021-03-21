const express = require('express');
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const router = express.Router();
const User = require('../../models/User');
const keys = require('../../config/keys');
const validateRegisterInput = require('../../validation/register');
const validateLoginInput = require('../../validation/login');

// @route   POST api/users/register
// @desc    Register user
// @access  Public
router.post('/register', (req, res) => {
  //Validations
  const {errors, isValid} = validateRegisterInput(req.body);
  if (!isValid){
    return res.status(400).json(errors);
  }
  User.findOne({email: req.body.email})
    .then(user => {
      if (user){
        return res.status(400).json({email: 'Email already exists'});
      } else {
        const avatar = gravatar.url(req.body.email, {
          s: '200', //Size
          r: 'pg', //rating
          d: 'mm' //default
        });

        bcrypt.genSalt(10, (err, salt) => {
          if (err) {
            return res.status(500).json({password: 'Password encryption failed'});
          } 

          bcrypt.hash(req.body.password, salt, (err, hash) => {
            if (err) {
            return res.status(500).json({password: 'Password encryption failed'});
            }
            const newUser = new User({
              name: req.body.name,
              email: req.body.email,
              password: hash,
              avatar
            });
            newUser.save()
              .then(user => res.json(user))
              .catch(err => console.log(err))
          })
        })

      }
    })
    .catch(err => console.log(err))
})


// @route   POST api/users/login
// @desc    Login the user
// @access  Public
router.post('/login', (req, res) => {
  //Validations
  const {errors, isValid} = validateLoginInput(req.body);
  if (!isValid){
    return res.status(400).json(errors);
  }

  const email = req.body.email;
  const password = req.body.password;

  User.findOne({email})
    .then(user => {
      if (!user){
        return res.status(404).json({email: 'User not found'});
      }

      //check password
      bcrypt.compare(password, user.password)
        .then(isMatch => {
          if (!isMatch){
            return res.status(400).json({password: 'Password Mismatch'});
          } else {
            const payload = { 
              id: user.id,
              name: user.name,
              avatar: user.avatar
            };
            jwt.sign(
              payload, 
              keys.secretOrKey,
              {expiresIn: 3600},
              (err, token) => {
                return res.json({token: 'Bearer ' + token})
              })
          }
        })
    })
    .catch(err => console.log(err));
})


// @route   GET api/users/current
// @desc    Return current user info
// @access  Private
router.get(
  '/current', 
  passport.authenticate('jwt', {session: false}), 
  (req, res) => {
    return res.json(req.user);
})

module.exports = router;
