var express = require('express'); 
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server); //引入socket.io
var users = [];//用户名称
app.use('/', express.static(__dirname + '/chatroom'));
console.log('服务启动！');
server.listen(8282);

//socket
/*
 socket.emit()只有自己收得到这个事件
 io.sockets.emit()表示所有人都可以收到这个事件
 socket.broadcast.emit()是向除自己外的所有人发送事件
*/
io.sockets.on('connection', function (socket) {
    socket.on('login', function (username) {//注册名字
        if (users.indexOf(username) > -1) {
            socket.emit('existed');//名字已存在         ***
        } else {
            console.log('新用户：',username);
            socket.username = username;
            users.push(username);
            socket.emit('success');//名称保存成功        ***
        };
    });
    socket.on('sendMsg', function(msg) {//触发sendMsg事件
        //将消息发送到其他用户
        socket.broadcast.emit('newMsg', socket.username, msg);
    });
});