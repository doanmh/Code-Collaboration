var nodemailer = require('nodemailer');
var config = require('../config/config.js');

var transporter = nodemailer.createTransport(config.mailer);

exports.getContact = function(req, res) {
    res.render('contact', { title: 'Code Collaboration'});
};

exports.postContact = function(req, res) {
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
}