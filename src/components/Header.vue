<!-- eslint-disable vue/multi-word-component-names -->
<script>
export default {
  name: "Header",
  data() {
    return {
      isMobile:false,
      base_music1: "我会等",
      postUrl: this.$httpUrl,
      musicShow: false,
      musicIMG: require('../assets/img/music.jpg'),
      musicPlayer: "el-icon-video-play",
      greetingMessage: "", // 存储问候消息的变量
      greetingMessages: {
        morning: ["早上好", "早安", "嘿 这么早"],
        afternoon: ["下午好", "你好", "中午好"],
        evening: ["晚上好", "晚安", "记得休息"]
      },
      user: JSON.parse(sessionStorage.getItem('CurUser')),

      musicList: [ //已转动态加载
        // {
        //   title: '晴天',
        //   file: 'http://localhost:8090/static/music/nh.mp3'
        // },
      ],
      currentMusicIndex: 0,
      audio: this.$music,
    }
  },
  created() {
    this.$router.push("/Home");
    this.setGreetingMessage(); // 在组件创建时设置问候消息
    setInterval(this.setGreetingMessage, 3600000); // 每小时更新一次问候消息
    this.musicGet();
  },
  methods: {
    toUser() {
      console.log('aaaToUser')
      this.$router.push("/UserHome")
    },
    logOut() {
      console.log('退出')
      this.$confirm('要退出了吗', '提示', {
        confirmButtonText: "好的",
        type: 'warning',
        center: true,
        closeOnClickModal: true
      }).then(() => {
        this.$notify({
          title: this.user.name,
          message: '您已退出登陆',
        });
        this.$router.replace('/')
        sessionStorage.clear()
      }).catch(() => {

      })
    },
    collapse() {
      this.$emit('doCollapse')
    },
    setGreetingMessage() {
      const now = new Date();
      const hour = now.getHours();
      if (hour >= 5 && hour < 12) {
        // 早上
        this.greetingMessage = this.greetingMessages.morning[
            Math.floor(Math.random() * this.greetingMessages.morning.length)] + ',' + this.user.name;
      } else if (hour >= 12 && hour < 18) {
        // 下午
        this.greetingMessage = this.greetingMessages.afternoon[
            Math.floor(Math.random() * this.greetingMessages.afternoon.length)] + ',' + this.user.name;
      } else {
        // 晚上
        this.greetingMessage = this.greetingMessages.evening[
            Math.floor(Math.random() * this.greetingMessages.evening.length)] + ',' + this.user.name;
      }
    },

    musicC() {
      this.musicShow = !this.musicShow;
    },
    musicGet() {
      this.$axios.get(this.$httpUrl + '/music/list?userId=' + this.user.id).then(res => res.data).then(res => {
        if (res.code === 200) {
          this.musicList = res.data;
          this.$notify({
            title: "音乐加载成功",
            message: '~来听听歌叭~',
            position: 'bottom-left',
            type: 'success'
          });
        } else {
          this.$notify({
            title: "音乐加载失败",
            message: '服务器开小差啦~ 请稍后再试',
            type: 'error',
            position: 'bottom-left',
          });
        }
      })
    },
    musicDel(file) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if (this.audio.src === file) {
          this.mUp();
        }
        this.$axios.get(this.$httpUrl + '/music/del?file=' + file).then(res => res.data).then(res => {
          if (res.code === 200) {
            this.musicGet();
            this.$message({
              showClose: true,
              message: '删除成功',
              type: 'success'
            });
          } else {
            this.$message({
              showClose: true,
              message: '删除失败',
              type: 'error'
            });
          }
        })
      }).catch(() => {
      });
    },
    mPlay() {
      if (this.audio.paused) {
        const music = this.musicList[this.currentMusicIndex];
        this.audio.src = music.file;
        this.$notify({
          title: "正在为您播放：" + music.title,
          message: "祝您愉快~ ",
          iconClass: "el-icon-headset",
          position: 'bottom-left',
        });
        this.audio.play();
        this.musicPlayer = "el-icon-video-pause";
        this.findMusic(music.title);
      } else {
        this.audio.pause();
        this.$notify({
          title: "已暂停",
          message: "您已暂停音乐",
          iconClass: "el-icon-headset",
          position: 'bottom-left',
        });
        this.musicPlayer = "el-icon-video-play";
      }

      this.audio.onended = () => {
        this.mUp();
      };
    },
    mUp() {
      this.currentMusicIndex++;
      if (this.currentMusicIndex === this.musicList.length) {
        this.currentMusicIndex = 0;
      }
      const music = this.musicList[this.currentMusicIndex];
      this.audio.src = music.file;
      this.$notify({
        title: "正在为您播放：" + music.title,
        message: "祝您愉快~",
        iconClass: "el-icon-headset",
        position: 'bottom-left',
      });
      this.audio.play();
      this.musicPlayer = "el-icon-video-pause";
      this.findMusic(music.title);
      this.audio.onended = () => {
        this.mUp();
      };
    },
    mDown() {
      if (!this.audio.paused) this.audio.pause();
      this.currentMusicIndex--;
      if (this.currentMusicIndex === -1) {
        this.currentMusicIndex = this.musicList.length - 1;
      }
      const music = this.musicList[this.currentMusicIndex];
      this.audio.src = music.file;
      this.$notify({
        title: "正在为您播放：" + music.title,
        message: "祝您愉快~",
        iconClass: "el-icon-headset",
        position: 'bottom-left',
      });
      this.audio.play();
      this.musicPlayer = "el-icon-video-pause";
      this.findMusic(music.title);

      this.audio.onended = () => {
        this.mUp();
      };
    },
    musicClickPlay(index) {
      if (!this.audio.paused) this.audio.pause();
      this.currentMusicIndex = index;
      const music = this.musicList[this.currentMusicIndex];
      this.audio.src = music.file;
      this.$notify({
        title: "正在为您播放：" + music.title,
        message: "祝您愉快~",
        iconClass: "el-icon-headset",
        position: 'bottom-left',
      });
      this.audio.play();
      this.musicPlayer = "el-icon-video-pause";
      this.findMusic(music.title);

      this.audio.onended = () => {
        this.mUp();
      };
    },

    handleChange(file, fileList) {
      console.log(fileList);
      if (file.response && file.response.code === 200) {
        this.$notify({
          title: "上传成功 ~",
        });
        this.musicGet();
      } else if (file.response && file.response.code === 400) {
        this.$notify({
          title: "上传失败",
          message: "服务器开小差啦~ 请稍后再试",
          type: 'error'
        });
      }
    },
    beforeUpload(file) {
      const isMP3 = file.type === 'audio/mpeg' || file.type === 'audio/mp3'|| file.type === 'audio/m4a';
      if (!isMP3) {
        this.$message({
          showClose: true,
          message: '抱歉，只能上传 MP3/m4a 格式的音乐',
          type: 'error'
        });
        return false;
      }
      return true;
    },
    checkIfMobile() {
      this.isMobile = window.innerWidth < 800; // Adjust the value based on your requirements
    },

    handleKeyPress(event) {
      if(this.musicShow) {
        // 判断按下的键是什么，然后执行相应的操作
        switch (event.key) {
          case 'ArrowLeft':
            this.mDown();
            break;
          case ' ':
            this.mPlay();
            break;
          case 'ArrowRight':
            this.mUp();
            break;
            // 可以添加其他键的处理逻辑
        }
      }

    },
    findMusic(name){
      this.$axios.get(this.$httpUrl + '/searchImage/' + name ).then(res => res.data).then(res => {
        if (res.code === 200) {
          this.musicIMG=res.data
        } else {
          this.musicIMG='./music.jpg'
        }
      })
    },

  },
  props: {
    icon: String
  },
  mounted() {
    this.checkIfMobile();
    window.addEventListener('resize', this.checkIfMobile);
    // 在组件挂载时添加键盘事件监听器
    window.addEventListener('keyup', this.handleKeyPress);
  },
  beforeDestroy() {
    // 在组件销毁前移除键盘事件监听器，以防止内存泄漏
    window.removeEventListener('keyup', this.handleKeyPress);
  }
};
</script>

<template>
  <div>
    <el-button circle class="floating-button" icon="el-icon-headset" type="primary" @click="musicC"></el-button>

    <div style="display: flex;line-height: 50px;">
      <div style="position: relative;">
        <i :class="icon"
           style="font-size: 25px; position: absolute;top: 50%;transform: translateY(-50%); cursor: pointer"
           @click="collapse"></i>
      </div>
      <div style="position: relative; flex: 1; text-align: center; font-size: 20px; left: 60px;user-select: none;">
        <span>{{ greetingMessage }}</span>
      </div>
      <el-avatar :size="35" :src="this.user.avatar" shape="square"
                 style="margin-right: 12px; position: relative; top: 8px;">
        {{ this.user.name.charAt(0) }}
      </el-avatar>
      <el-dropdown>
        <span style="font-size: 16px; font-weight: bold">{{ this.user.name }}</span>
        <i class="el-icon-arrow-down" style="margin-left: 5px; margin-right: 10px;"></i>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item @click.native="toUser">个人中心</el-dropdown-item>
          <el-dropdown-item @click.native="logOut">退出</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>

    <el-dialog :visible.sync="musicShow" center fullscreen=true width="80%" custom-class="musicDialog">
      <video class="background-video" autoplay muted loop>
        <source src="../assets/video/ingame.mp4" type="video/mp4">
      </video>
      <div style="width: 92vw; height: 70vh; display: flex;z-index: 10;position: absolute; left: 6%;">
        <div style="height: 100%; width:15%;" v-if="!this.isMobile">
          <div style="display: flex;align-content: center; color: #dadada;">
            <el-avatar :size="45" :src="this.user.avatar" style="margin-right: 12px;position: relative;top:0.5em;">
              {{ this.user.name.charAt(0) }}
            </el-avatar>
            <div style="font-size: medium;user-select: none;">{{ this.user.name }}</div>
          </div>
        </div>
        <div style="height: 100%; width: 100%; display: flex;flex-direction: column;">
          <div style="text-align: center;margin-top: 10%;">
            <el-avatar :class="{ 'rotate-avatar': !this.audio.paused }" :size="this.isMobile?250:350" icon="el-icon-headset" :src="this.musicIMG"
                       style="font-size: 100px;">
            </el-avatar>
          </div>
          <div style="font-size: 30px; text-align: center;color: #dadada;">
            {{ this.currentMusicIndex > -1 && this.musicList[this.currentMusicIndex] ? this.musicList[this.currentMusicIndex].title : "Music" }}
            <i class="el-icon-cherry"></i>
          </div>
        </div>
        <div style="height: 100%; width: 15%;
             background: transparent;backdrop-filter: blur(5px);border-radius: 10px;
             -webkit-backdrop-filter: blur(5px); overflow-y: auto;"
             v-if="!this.isMobile">

          <div v-for="(item, index) in musicList" :key="index"
               style="width: 100%; height: 3em; margin: 0.5em; color: #dadada;
            font-size: medium; display: flex;align-items: center; justify-content: space-between;">
            <div style="user-select: none; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" @click="musicClickPlay(index)">
              {{ item.title }}
            </div>
            <el-button :disabled="item.title==='我会等' || item.title==='晴天'" size="mini" style="margin:0 10px;background-color: transparent;"
                       @click="musicDel(item.file)" icon="el-icon-delete">
            </el-button>
          </div>

        </div>
      </div>
      <div v-if="musicShow" class="floating-contor">
        <el-button v-if="musicShow" class="floating-inside" icon="el-icon-close" size="medium"
                   @click="musicC"></el-button>
        <el-button v-if="musicShow" class="floating-inside" icon="el-icon-arrow-left" size="medium"
                   @click="mDown"></el-button>
        <el-button v-if="musicShow" :icon="this.musicPlayer" class="floating-inside" size="medium"
                   @click="mPlay"></el-button>
        <el-button v-if="musicShow" class="floating-inside" icon="el-icon-arrow-right" size="medium"
                   @click="mUp"></el-button>
        <el-upload
            :action="`${this.postUrl}/music/up/${this.user.id}`"
            :before-upload="beforeUpload"
            :on-change="handleChange"
            accept="audio/mp3,audio/m4a"
            multiple
            show-file-list="false"
            style="width: 0;height: 0;"
            v-if="!this.isMobile">
          <el-button v-if="musicShow" class="floating-inside"
                     icon="el-icon-upload2" size="medium"></el-button>
        </el-upload>
      </div>
    </el-dialog>
  </div>
</template>

<style scoped>
* {
  user-select: none;
  ::-webkit-scrollbar {
    /*隐藏滚轮*/
    display: none;
  }
}
/deep/ .musicDialog {
  background-color: #333333;
  z-index: -10;
}
.background-video {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover; /* 视频尺寸适应容器 */
  z-index: -1;
}
.floating-inside {
  background-color: transparent;
  color: #dadada;
  backdrop-filter: blur(5px);
  transition: .2s;
}
.floating-inside:hover {
  color: #00bcff;
  box-shadow: 0 0 5px #00bcff, 0 0 10px #a7e3fa;
}

.rotate-avatar {
  animation: lightAndRotate 10s linear infinite;
}
@keyframes lightAndRotate {
  0%
  {
    box-shadow: 0 0 10px #fff;
    transform: rotate(0deg);
  }
  50%
  {
    box-shadow: 0 0 10px #fff,
    0 0 20px #fff,
    0 0 40px #fff,
    0 0 60px #fff;
  }
  100%
  {
    box-shadow: 0 0 10px #fff;
    transform: rotate(360deg);
  }
}

@media (min-width: 768px) {

  .floating-contor {
    position: absolute;
    top: 90%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 90%;
    height: 50px;
    display: flex;
    justify-content: center;
  }

  .floating-inside {
    z-index: 1;
    font-size: 25px;
    margin: 0 10px;
  }

  .floating-button {
    z-index: 1;
    position: fixed;
    bottom: 30px;
    right: 20px;
    font-size: 25px;
    box-shadow: 0px 5px 10px rgba(0, 0, 0, 0.2);
  }
}

@media (min-width: 0px) and (max-width: 768px) {

  .floating-contor {
    position: absolute;
    top: 90%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 90%;
    height: 50px;
    display: flex;
    justify-content: center;
  }


  .floating-inside {
    z-index: 1;
    font-size: medium;
  }

  .floating-button {
    z-index: 1;
    position: fixed;
    bottom: 30px;
    right: 20px;
    font-size: 10px;
    box-shadow: 0px 5px 10px rgba(0, 0, 0, 0.2);
  }
}


</style>