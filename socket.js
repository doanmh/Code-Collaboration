'use strict'

var socketIO = require('socket.io');
var ot = require('ot');
var roomList = {};

module.exports = function (server) {
    var io = socketIO(server);
    io.on('connection', function (socket) {
        socket.on('joinRoom', function (data) {
            Task.findOne({ _id: data.room}, function(err, task) {
                if (err) {
                    console.log(err);
                    return null;
                }
                if (!roomList[data.room]) {
                    var socketIOServer = new ot.EditorSocketIOServer(task.content, [], data.room, function (socket, cb) {
                        task.content = this.document;
                        task.save(function(err) {
                            if (err) {
                                return cb(false);
                            }
                            cb(true);
                        });
                    });
                    roomList[data.room] = socketIOServer;
                }
                roomList[data.room].addClient(socket);
                roomList[data.room].setName(socket, data.username);

                socket.room = data.room;
                socket.join(data.room);
            })
        });
        socket.on('chatMessage', function (data) {
            io.to(socket.room).emit('chatMessage', data);
        });
        socket.on('disconnect', function () {
            socket.leave(socket.room);
        });
    })
}