window.onload = function() {
    //初始化
    let chatroom = new ChatRoom();
    chatroom.init();
};
var ChatRoom = function() {
    this.socket = null;
};
/* 
  socket.emit()触发事件
  socket.on()监听事件
*/
ChatRoom.prototype = {
    init: function () {//初始化
        var that = this;
        this.socket = io.connect();
        this.socket.on('connect', function() {//建立成功
            //输入名字
            document.getElementById('loginName').style.display = 'block';
        });
        this.socket.on('disconnect', function() {//断开链接
            document.getElementById('loginName').style.display = 'none';
            document.getElementById('chatWindow').style.display = 'none';
            document.getElementById('message').innerHTML = '与服务器断开连接，刷新重连';
        });
        this.socket.on('existed', function() {//名字被占用
            alert('这个名字已经有人用了哦');
        });
        this.socket.on('success', function() {//注册成功
            alert('创建成功，开始聊天吧！');
            document.getElementById('loginName').style.display = 'none';
            document.getElementById('chatWindow').style.display = 'block';
        });
        this.socket.on('newMsg', function(user, msg) {//接收到新消息
            that.receivesMsg(user, msg);
        });
        document.getElementById('saveName').addEventListener('click', function() {//确定名字
            let userName = document.getElementById('userName').value;
            if (userName != '') {
                //如果输入了名字，则发起一个注册事件并将输入的昵称储存
                that.socket.emit('login', userName);
            } else {
                alert('是不是忘了输名字了?');
            };
        }, false);
        document.getElementById('sendMsg').addEventListener('click', function() {//点击发送
            let msgInp = document.getElementById('msgInp');
            let msg = msgInp.value;
            msgInp.value = '';
            if (msg != '') {
                that.socket.emit('sendMsg', msg); //把消息发送到服务器
                that.receivesMsg('me', msg); //把发送的消息显示到聊天窗
            };
        }, false);
        document.getElementById('msgInp').addEventListener('keyup', function(e) {
            let msgInp = document.getElementById('msgInp');
            let msg = msgInp.value;
            if (e.keyCode == 13 && msg != '') {//enter键发送消息
                msgInp.value = '';
                that.socket.emit('sendMsg', msg);
                that.receivesMsg('me', msg);
            };
        }, false);
    },
    receivesMsg: function (user, msg) {//接收消息
        let msglist = document.getElementById('main');
        let getmsg = document.createElement('div');
        let date = new Date().toTimeString().substr(0, 8);
        getmsg.innerHTML = `<h5>${user}<span>${date}</span></h5><li class="list-group-item ${user != 'me' && 'list-group-item-info'}">${msg}</li>`;
        msglist.appendChild(getmsg);
        msglist.scrollTop = msglist.scrollHeight;
    }
};