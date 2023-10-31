<!-- eslint-disable vue/multi-word-component-names -->
<script>
// import request from "@/utils/request";
let socket;

export default {
  name: "Chat",
  data() {
    return {
      circleUrl: 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png',
      chatBack: './chatBack.jpg',
      user: JSON.parse(sessionStorage.getItem('CurUser')),
      isCollapse: false,
      users: [],
      historyChat: [],
      chatUser: '',
      text: "",
      messages: [],
      content: ''
    }

  },
  beforeMount() {
    this.user = JSON.parse(sessionStorage.getItem('CurUser'));
  },
  created() {
    this.init();
  },
  methods: {
    history(userNo){
      this.chatUser = userNo;
      this.content = '';
      this.users.forEach(user=>{
        if(user.username === userNo){
          user.newMessage=0;
        }
      })

      this.$axios.post(this.$httpUrl + '/message/history', {
        pageSize: '',
        pageNum: '',
        param: {
          user1: userNo,
          user2: this.user.no
        }
      }).then(res => res.data).then(res => {
        if (res.code === 200) {
         this.historyChat = res.data;
          this.historyChat.forEach((chatItem) => {
            // 对每个 chatItem 执行操作
            if(chatItem.fromNo === userNo){
              this.createContent(chatItem.fromAvatar ? chatItem.fromAvatar : this.circleUrl
                  , null, chatItem.content);
            }
            else {
              this.createContent(null
                  , this.user.avatar ? this.user.avatar : this.circleUrl, chatItem.content);
            }
          });
        }
      })
    },
    send() {
      if (!this.chatUser) {
        this.$message({type: 'warning', message: "请选择左侧聊天对象"})
        return;
      }
      if (!this.text || this.text === "") {
        this.$message({type: 'warning', message: "请输入内容"})
      } else {
        if (typeof (WebSocket) == "undefined") {
          console.log("您的浏览器不支持WebSocket");
        } else {
          console.log("您的浏览器支持WebSocket");
          // 组装待发送的消息 json
          // {"from": "zhang", "to": "admin", "text": "聊天文本"}
          let message = {from: this.user.no, to: this.chatUser, text: this.text}
          socket.send(JSON.stringify(message));  // 将组装好的json发送给服务端，由服务端进行转发
          this.messages.push({user: this.user.no, text: this.text})
          // 构建消息内容，本人消息
          this.createContent(null, this.user.avatar ? this.user.avatar : this.circleUrl, this.text)
          this.text = '';
        }
      }
    },
    createContent(remoteUser, nowUser, text) {  // 这个方法是用来将 json的聊天消息数据转换成 html的。
      let html
      // 当前用户消息
      if (nowUser) { // nowUser 表示是否显示当前用户发送的聊天消息，绿色气泡
        html = "<div class=\"el-row\" style=\"padding: 5px 0\">\n" +
            "  <div class=\"el-col el-col-22\" style=\"text-align: right; padding-right: 10px\">\n" +
            "    <div style=\"color: white; text-align: center; border-radius: 10px; font-family: sans-serif;" +
            " padding: 10px; width:auto; max-width: 25vw; word-wrap: break-word; display:inline-block !important; box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.3);" +
            " background-color: forestgreen;\">" + text + "</div>\n" +
            "  </div>\n" +
            "  <div class=\"el-col el-col-2\">\n" +
            "  <span class=\"el-avatar el-avatar--circle\" style=\"height: 40px; width: 40px; line-height: 40px;\">\n" +
            "    <img src=\"" + nowUser + "\" style=\"object-fit: cover;\">\n" +
            "  </span>\n" +
            "  </div>\n" +
            "</div>";
      } else if (remoteUser) {   // remoteUser表示远程用户聊天消息，蓝色的气泡
        html = "<div class=\"el-row\" style=\"padding: 5px 0\">\n" +
            "  <div class=\"el-col el-col-2\" style=\"text-align: right\">\n" +
            "  <span class=\"el-avatar el-avatar--circle\" style=\"height: 40px; width: 40px; line-height: 40px;\">\n" +
            "    <img src=\"" + remoteUser + "\" style=\"object-fit: cover;\">\n" +
            "  </span>\n" +
            "  </div>\n" +
            "  <div class=\"el-col el-col-22\" style=\" text-align: left; padding-left: 10px\">\n" +
            "    <div style=\"color: white; text-align: center; border-radius: 10px; font-family: sans-serif;" +
            " padding: 10px; width:auto; max-width: 25vw; word-wrap: break-word; display:inline-block !important; box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.3);" +
            " background-color: deepskyblue;\">" + text + "</div>\n" +
            "  </div>\n" +
            "</div>";
      }
      console.log(html)
      this.content += html;
      //下两行为滚动scrollDiv(refs上)到最下面
      this.$nextTick(() => {
        const container = this.$refs.scrollDiv;
        container.scrollTop = container.scrollHeight;
      });
    },
    init() {
      let username = this.user.no;
      console.log("当前用户：" + username);
      let _this = this;
      if (typeof (WebSocket) == "undefined") {
        console.log("您的浏览器不支持WebSocket");
      } else {
        console.log("您的浏览器支持WebSocket");
        let socketUrl = "ws://" + this.$httpUrl.replace("http://", "").replace(/\s/g, "") + "/imserver/" + username;
        if (socket != null) {
          socket.close();
          socket = null;
        }
        // 开启一个websocket服务
        socket = new WebSocket(socketUrl);
        //打开事件
        socket.onopen = function () {
          console.log("websocket已打开");
        };
        //  浏览器端收消息，获得从服务端发送过来的文本消息
        socket.onmessage = function (msg) {
          console.log("收到数据====" + msg.data)
          let data = JSON.parse(msg.data)  // 对收到的json数据进行解析， 类似这样的： {"users": [{"username": "zhang"},{ "username": "admin"}]}
          if (data.users) {  // 获取在线人员信息
            _this.users = data.users.filter(user => user.username !== username) // 获取当前连接的所有用户信息，并且排除自身，自己不会出现在自己的聊天列表里
            if (!_this.chatUser && data.users.length > 1) _this.history(data.users.filter(user => user.username !== username)[0].username);
          } else {
            // 如果服务器端发送过来的json数据 不包含 users 这个key，那么发送过来的就是聊天文本json数据
            //  // {"from": "zhang", "text": "hello"}
            if (data.from === _this.chatUser) {
              _this.messages.push(data)
              // 构建消息内容
              _this.createContent(data.avatar ? data.avatar : "https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png", null, data.text)
            }
            else {
              _this.users.forEach(user=>{
                if(user.username === data.from){
                  user.newMessage+=1;
                }
              });
            }
          }
        };
        //关闭事件
        socket.onclose = function () {
          console.log("websocket已关闭");
        };
        //发生了错误事件
        socket.onerror = function () {
          console.log("websocket发生了错误");
        }
      }
    },

  },


}

</script>

<template>
    <div>
      <el-row style="display: flex; justify-content: space-between; min-height: 94vh;">
        <el-col :span="4">
          <el-card style=" height: 100%; color: #333">
            <div style="padding-bottom: 10px; border-bottom: 1px solid #ccc">在线用户<span style="font-size: 12px">（点击开始聊天）</span>
            </div>
            <el-button style="width: 100%; padding: 10px 0;margin-top: 10px;" :disabled="true">
              <el-avatar :size="40" :src="this.user.avatar" style="margin-right: 12px;">我</el-avatar>
              <span style="font-size: 1.1vw; position:relative; top: -12px;">{{ this.user.name }}</span>
            </el-button>
            <div v-for="user in users" :key="user.username" style="padding: 10px 0; text-align: center;" @click="history(user.username)">
<!--              badge新消息气泡-->
              <el-badge :value="user.newMessage" :max="10" :hidden="user.newMessage===0" style="width: 100%;">
                <el-button style="width: 100%;">
                  <el-avatar :size="40" :src="user.avatar" style="margin-right: 12px;">
                    {{ user.username.charAt(0) }}
                  </el-avatar>
                  <span v-if="user.username !== chatUser" style="font-size: 1.1vw; position:relative; top: -12px;">{{ user.name }}</span>
                  <span v-if="user.username === chatUser" style="font-size: 1.1vw; font-weight: bold; color: limegreen; position:relative; top: -12px;">{{ user.name }}</span>
                  <el-tooltip class="item" effect="dark" content="在线用户" placement="right">
                    <i v-if="user.online===1" class="el-icon-connection el-icon--right" style="position: relative; top: -12px;"></i>
                  </el-tooltip>
                </el-button>
              </el-badge>
            </div>
          </el-card>
        </el-col>

        <el-col :span="24">
          <div :style="{ 'background-image': 'url(' + this.chatBack + ')'}" style="height: 100%;display: flex; align-items: center; flex-direction: column;">
            <div style="text-align: center; line-height: 50px; font-size: large; font-weight: bold; margin-bottom: -20px;">
              {{ chatUser?(chatUser): "请选择用户" }}
            </div>
            <el-divider></el-divider>
            <div ref="scrollDiv" style="height: 68vh; width: 75%; overflow:auto; margin-bottom: 10px;"
                 v-html="content"></div>
            <div style="width: 100%; display: flex; justify-items: center; justify-content: center;">
              <el-input v-model="text" :autosize="{ minRows: 2, maxRows: 3}" placeholder="请输入内容" resize="none"
                        show-word-limit
                        style="width: 80%; margin-right: 10px; font-size: large; box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1)"
                        type="textarea" @keyup.enter.native="send"></el-input>
              <el-button size="medium" type="primary" class="sendButton" @click="send">发送</el-button>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
</template>

<style scoped>
*{
  ::-webkit-scrollbar {
    /*隐藏滚轮*/
    display: none;
  }
}
.sendButton{
  box-shadow: 0 2px 12px 0 rgba(70, 65, 65, 0.1);
  transition: 0.3s;
}
.sendButton:hover{
  box-shadow: 0 0 20px #009dff,
  0 0 40px #3fbaff,
  0 0 80px #78cbff,
  0 0 120px #97d5ff;
  font-weight: bold;
}

</style>