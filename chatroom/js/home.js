var socket=io.connect();//建立链接
window.onload = function() {
    //初始化
    let chatroom = new ChatRoom();
    chatroom.init();
};
var ChatRoom = function() {
    this.socket = null;
};
    // socket.emit()触发事件
    // socket.on()监听事件
var that = this;
ChatRoom.prototype = {
    init: function () {//初始化
        this.socket = io.connect();
        this.socket.on('connect', function() {//建立成功
            //输入名字
            document.getElementById('loginName').style.display = 'block';
        });
        this.socket.on('existed', function() {//名字被占用
            alert('这个名字已经有人用了哦');
        });
        this.socket.on('success', function() {//注册成功
            console.log('成功')
            alert('创建成功，开始聊天吧！');
            document.getElementById('loginName').style.display = 'none';
            document.getElementById('chatWindow').style.display = 'block';
        });
        this.socket.on('newMsg', function(user, msg) {
            that.receivesMsg(user, msg);
        });
    },
};
//确定名字
saveName = () => {
    let userName = document.getElementById('userName').value;
    if (userName != '') {
        //如果输入了名字，则发起一个注册事件并将输入的昵称储存
        socket.emit('login', userName);
    } else {
        alert('是不是忘了输名字了?');
    };
}
//点击发送
sendMsg = () => {
    let msg = document.getElementById('sendMsg').value;
    if (msg != '') {
        socket.emit('sendMsg', msg); //把消息发送到服务器
        this.receivesMsg('me', msg); //把发送的消息显示到聊天窗
        msg = '';
    };
}
//接收消息
receivesMsg = (user, msg) => {
    let msglist = document.getElementById('main');
    let getmsg = document.createElement('div');
    let date = new Date().toTimeString().substr(0, 8);
    getmsg.innerHTML = `<h5>${user}<span>${date}</span></h5><li class="list-group-item ${user == 'me' && 'list-group-item-info'}">${msg}</li>`;
    msglist.appendChild(getmsg);
    msglist.scrollTop = msglist.scrollHeight;
}