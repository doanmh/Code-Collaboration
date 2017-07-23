exports.getIndex = function (req, res) {
    if (req.isAuthenticated()) {
        Task.find({
            _id: { $in: req.user.tasks }
        }, function (err, tasks) {
            if (err) {
                console.log(err);
                res.render('error');
            } else {
                res.render('index', { title: 'Express', tasks: tasks });
            }
        });
    } else {
         res.render('index', { title: 'Express'});
    }
}