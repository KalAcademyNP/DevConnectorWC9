const express = require('express');
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const router = express.Router();
const User = require('../../models/User');

// @route   POST api/users/register
// @desc    Register user
// @access  Public
router.post('/register', (req, res) => {
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

module.exports = router;
