var passport = require('passport');

exports.getLogin = function (req, res, next) {
    res.render('login', { title: 'Login to you account' });
}

exports.postLogin = function (req, res, next) {
    req.checkBody('email', 'Invalid Email').isEmail();
    req.checkBody('password', 'Empty Password').notEmpty();

    var errors = req.validationErrors();

    if (errors) {
        return res.render('login', {
            errorMessages: errors
        });
    }

    passport.authenticate('local', function (err, user, info) {
        if (err) {
            return next(user);
        }
        if (!user) {
            return res.redirect('/login');
        }
        req.logIn(user, function (err) {
            if (err) {
                return next(err);
            }
            return res.redirect('/');
        });
    })(req, res, next);
}

exports.getRegister = function (req, res, next) {
    res.render('register', { title: 'Register a new account' });
}

exports.postRegister = function (req, res, next) {
    req.checkBody('name', 'Empty Name').notEmpty();
    req.checkBody('email', 'Invalid Email').isEmail();
    req.checkBody('password', 'Empty Password').notEmpty();
    req.checkBody('password', 'Password does not match').equals(req.body.confirmPassword).notEmpty();

    var errors = req.validationErrors();
    if (errors) {
        res.render('register', {
            name: req.body.name,
            email: req.body.email,
            errorMessages: errors
        });
    } else {
        var user = new User();
        user.name = req.body.name;
        user.email = req.body.email;
        user.setPassword(req.body.password);
        user.save(function (err) {
            if (err) {
                res.render('register', {
                    errorMessages: errors,
                });
            } else {
                res.redirect('/login');
            }
        });
    }
}

exports.getLogout = function (req, res) {
    req.logout();
    res.redirect('/');
}