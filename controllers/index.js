exports.getIndex = function (req, res) {
    if (req.isAuthenticated()) {
        Task.find({
            _id: { $in: req.user.tasks }
        }, function (err, tasks) {
            if (err) {
                console.log(err);
                res.render('error');
            } else {
                res.render('index', {tasks: tasks });
            }
        });
    } else {
         res.render('index');
    }
}

exports.getAbout = function(req, res) {
    res.render('about');
}