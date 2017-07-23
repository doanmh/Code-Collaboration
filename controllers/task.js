exports.createTask = function (req, res) {
    if (req.isAuthenticated()) {
        req.checkBody('name', 'Empty Name').notEmpty();

        var errors = req.validationErrors();

        if (errors) {
            return res.redirect('/');
        }

        var newTask = new Task();
        newTask.name = req.body.name;
        newTask.description = req.body.description;
        newTask.date = (new Date()).toString();
        newTask.save(function (err, data) {
            if (err) {
                console.log(err);
                res.render('index', {
                    errorMessages: err
                });
            } else {
                res.redirect('/task/' + data._id);
            }
        });

        User.update({ _id: req.session.passport.user }, {
            $push: { tasks: newTask._id }
        }, function (err, user) {
            if (err) {
                console.log(err);
                res.render('error');
            }
        });
    }

};

exports.getTask = function (req, res) {
    if (req.isAuthenticated()) {
        if (req.params.id) {
            Task.findOne({ _id: req.params.id }, function (err, data) {
                if (err) {
                    console.log(err);
                    res.render('error');
                }
                if (data) {
                    res.render('task', { content: data.content, description: data.description, roomId: data.id });
                } else {
                    res.render('error');
                }
            });
        } else {
            res.render('error');
        }
    } else {
        res.render('error');
    }
}