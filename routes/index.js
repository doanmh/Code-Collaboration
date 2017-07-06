var express = require('express');
var router = express.Router();
var nodemailer = require('nodemailer');
var config = require('../config.js');

var transporter = nodemailer.createTransport(config.mailer);

/* TODO
  
  Move all the route to the app.js file
 */

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.route('/contact')
  .get(function(req, res, next) {
    res.render('contact', { title: 'Code Collaboration'});
  })
  .post(function(req, res, next) {
    req.checkBody('name', 'Empty name').notEmpty();
    req.checkBody('email', 'Invalid email').isEmail();
    req.checkBody('message', 'Empty message').notEmpty();
    var errors = req.validationErrors();
    if (errors) {
      res.render('contact', {
        title: 'Code Collaboration',
        name: req.body.name,
        email: req.body.email,
        message: req.body.message,
        errorMessages: errors
      });
    } else {
      var mailOption = {
        from: 'Code Collaboration',
        to: '',
        subject: 'You got a new message from visitor',
        text: 'From: ' + req.body.email + '\n' + req.body.message
      }
      transporter.sendMail(mailOption, function(error, info) {
        if (error) {
          return console.log(error);
        }
        res.render('thank', { title: 'Code Collaboration'});
      });
    }
  });

router.get('/login', function(req, res, next) {
  res.render('login', {title: 'Login to you account'});
})

router.get('/register', function(req, res, next) {
  res.render('register', {title: 'Register a new account'});
})

module.exports = router;
