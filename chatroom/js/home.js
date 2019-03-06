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
            $('#loginName').css('display', 'block');
        });
        this.socket.on('disconnect', function() {//断开链接
            $('#loginName').css('display', 'none');
            $('#chatWindow').css('display', 'none');
            $('#message').innerHTML = '与服务器断开连接，检查重连';
        });
        this.socket.on('existed', function() {//名字被占用
            alert('这个名字已经有人用了哦');
        });
        this.socket.on('success', function() {//注册成功
            alert('创建成功，开始聊天吧！');
            $('#loginName').css('display', 'none');
            $('#chatWindow').css('display', 'block');
        });
        this.socket.on('newMsg', function(user, msg) {//接收到新消息
            that.receivesMsg(user, msg);
        });
        $('#saveName').click(function() {
            let userName = $('#userName').val();
            if (userName != '') { //如果输入了名字，则发起一个注册事件并将输入的昵称储存
                that.socket.emit('login', userName);
            } else {
                alert('是不是忘了输名字了?');
            };
        })
        $('#sendMsg').click(function() {//点击发送
            let msg = $('#msgInp').val();
            $('#msgInp').val('');
            if (msg != '') {
                that.socket.emit('sendMsg', msg); //把消息发送到服务器
                that.receivesMsg('me', msg); //把发送的消息显示到聊天窗
            };
        })
        $('#msgInp').keyup(function(e) {
            let msg = $('#msgInp').val();
            if (e.keyCode == 13 && msg != '') {//enter键发送消息
                $('#msgInp').val('');
                that.socket.emit('sendMsg', msg);
                that.receivesMsg('me', msg);
            };
        })
        $('#openEmoji').popover({
            title: '我的表情',
            placement: 'top',
            content: "<div id='emojiList'></div>",
            html: true,
            trigger: 'focus'
        });
        $('#openEmoji').click(function () {
            that.loadEmoji();
        });
    },
    receivesMsg: function (user, msg) {//接收消息
        let getmsg = document.createElement('div');
        let date = new Date().toTimeString().substr(0, 8);
        let reg = /\[:\d+\]/g;
        let item = reg.exec(msg);
        if(item) {
            let index = item[0].slice(2,3);
            msg = msg.replace(item[0], `<img src='../emoji/${index}.jpg'/>`);
        }
        getmsg.innerHTML = `<h5>${user}<span>${date}</span></h5><li class="list-group-item ${user != 'me' && 'list-group-item-info'}"><p>${msg}</p></li>`;
        $('#main').append(getmsg);
        $('#main').scrollTop($('#main')[0].scrollHeight);
    },
    loadEmoji: function () {//加载图片
        let box = document.createDocumentFragment();
        for (let i = 9; i > 0; i--) {
            let emojis = document.createElement('img');
            emojis.src = '../emoji/' + i + '.jpg';
            emojis.title = i;
            box.appendChild(emojis);
        };
        $('#emojiList').append(box);
        $('#emojiList img').click(function (e) {
            $('#msgInp').val($('#msgInp').val() + '[:' + e.target.title + ']');
            $('#msgInp').focus();
        })
    }
};