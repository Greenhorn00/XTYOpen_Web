<!-- eslint-disable vue/multi-word-component-names -->
<script>
export default {
  name: "Music",
  data() {
    return {
      isMobile:false,
      base_music1: "我会等",
      postUrl: this.$httpUrl,
      musicShow: false,
      musicIMG: require('../assets/img/music.jpg'),
      musicSearch: require('../assets/img/music.jpg'),
      musicPlayer: "el-icon-video-play",
      user: JSON.parse(sessionStorage.getItem('CurUser')),
      //已转动态加载
      // {
      //   title: '晴天',
      //   file: 'http://localhost:8090/static/music/nh.mp3',
      // img: '图片url'
      // },
      musicList: [
      ],
      currentMusicIndex: 0,
      audio: this.$music,
    }
  },
  created() {
    this.musicGet();
  },
  methods: {
    musicC() {
      this.musicShow = !this.musicShow;
    },
    musicGet() {
      this.$axios.get(this.$httpUrl + '/music/list?userId=' + this.user.id).then(res => res.data).then(res => {
        if (res.code === 200) {
          this.musicList = res.data;
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
        this.audio.pause();
        this.musicPlayer = "el-icon-video-play";
        this.musicGet();
        this.currentMusicIndex= 0;
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
        this.findMusic(music.title);
        this.musicPlayer = "el-icon-video-pause";
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
    findMusic(name){
      this.$axios.get(this.$httpUrl + '/searchImage/' + name ).then(res => res.data).then(res => {
        if (res.code === 200) {
          // 尝试创建一个Image对象
          const img = new Image();
          img.src = res.data;

          // 监听Image对象的load和error事件
          img.onload = () => {
            // 如果加载成功，则设置musicSearch为有效的图片URL
            this.musicSearch = res.data;
          };

          img.onerror = () => {
            // 如果加载失败，则设置musicSearch为备用的图片URL（this.musicIMG）
            this.musicSearch = this.musicIMG;
          };
        } else {
          this.musicSearch=this.musicIMG
        }
      })
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
    window.removeEventListener('keyup', this.checkIfMobile);
  }
};
</script>

<template>
  <div>
    <el-button circle class="floating-button" icon="el-icon-headset" type="primary" @click="musicC"></el-button>

    <el-dialog :visible.sync="musicShow" center fullscreen width="80%" custom-class="musicDialog">
      <video class="background-video" autoplay muted loop>
        <source src="../assets/video/ing.mp4" type="video/mp4">
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
            <el-avatar :class="{ 'rotate-avatar': !this.audio.paused }" :size="this.isMobile?250:350" :src="musicSearch ? musicSearch : musicIMG"
                       style="font-size: 100px;">
              <img :src=this.musicIMG />
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
             v-loading="musicList.length===0"
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
            :show-file-list="false"
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
  //background-image: url("../assets/video/ingame.gif");
  z-index: -10;
}
/deep/ .el-loading-mask{
  background-color: rgba(218, 218, 218, 0.1);
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