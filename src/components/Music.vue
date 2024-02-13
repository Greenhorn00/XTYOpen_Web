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

      duration:0,//总时长
      currentPercentage:0,//进度

      isWYY:false,//判断网易云列表

      addWYYShow:false,//导入网易云界面 显示
      addWYYPass:false,//导入网易云界面 是否有cookie
      addWYYUrl:'',//网易云登陆二维码
      addUrl:'',//导入链接

      dragging: false, //3个拖动参数 是否拖动
      offsetX: 0, //x轴
      offsetY: 0, //y轴
      smallMusicShow:true,
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
      if(!this.smallMusicShow) {
        this.smallMusicShow=true;
      }
    },

    musicChangeList(){
      if(this.isWYY){
        this.musicGet();
      }
      else {
        this.musicGetWYY();
      }
    },
    musicGet() {
      this.$axios.get(this.$httpUrl + '/music/list?userId=' + this.user.id).then(res => res.data).then(res => {
        if (res.code === 200) {
          this.musicList = res.data;
          this.isWYY = false;
        } else {
          this.$notify({
            title: "音乐加载失败",
            message: '服务器开小差啦~ 请稍后再试',
            type: 'error',
          });
        }
      })
    },
    musicGetWYY(){
      this.$axios.get(this.$httpUrl + '/music/listWYY?userId=' + this.user.id).then(res => res.data).then(res => {
        if (res.code === 200) {
          if(res.data) this.musicList = res.data;
          else {
            this.$message({
              showClose: true,
              message: '您还没有导入网易云歌单喔',
              type: 'info'
            });
          }
          this.isWYY = true;
        } else {
          this.$notify({
            title: "音乐加载失败",
            message: '服务器开小差啦~ 请稍后再试',
            type: 'error',
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
    musicDelWYY(title) {
      this.$confirm('是否删除《'+title+'》?   此音乐可能为网易云vip歌曲无法播放', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        this.$axios.post(this.$httpUrl + '/music/delWYY' ,{
          param: {
            userId : this.user.id,
            title : title
          }
        }).then(res => res.data).then(res => {
          if (res.code === 200) {
            this.musicGetWYY();
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
        this.musicPlay();
      } else {
        this.musicPause();
      }

      this.audio.onended = () => {
        this.mUp();
      };
    },
    musicPlay(){
      if(!this.audio.paused) return;
      if (this.audio.currentTime){
        const currentTime = this.audio.currentTime;
        this.audio.play();
        this.audio.currentTime = currentTime;
      }else {
        const music = this.musicList[this.currentMusicIndex];
        this.audio.src = music.file;
        this.$notify({
          title: "正在为您播放：" + music.title,
          message: "祝您愉快~ ",
          iconClass: "el-icon-headset",
        });
        this.audio.play();
        this.findMusic(music.title);
      }

      this.musicPlayer = "el-icon-video-pause";
    },
    musicPause(){
      this.audio.pause();
      this.musicPlayer = "el-icon-video-play";
    },

    mUp() {
      this.currentMusicIndex++;
      if (this.currentMusicIndex === this.musicList.length) {
        this.currentMusicIndex = 0;
      }
      const music = this.musicList[this.currentMusicIndex];

      musicCheckUrl(music.file).then((available) => {
        if(!available){
          this.musicDelWYY(music.title); //检查音乐可用并提示删除
          this.mUp();
        }
      });

      this.audio.src = music.file;
      if(!this.isMobile){
        this.$notify({
          title: "正在为您播放：" + music.title,
          message: "祝您愉快~",
          iconClass: "el-icon-headset",
        });
      }
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

      musicCheckUrl(music.file).then((available) => {
        if(!available){
          this.musicDelWYY(music.title); //检查音乐可用并提示删除
        }
      });

      this.audio.src = music.file;
      if(!this.isMobile){
        this.$notify({
          title: "正在为您播放：" + music.title,
          message: "祝您愉快~",
          iconClass: "el-icon-headset",
        });
      }
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

      musicCheckUrl(music.file).then((available) => {
        if(!available){
          this.musicDelWYY(music.title); //检查音乐可用并提示删除
          this.mUp();
        }
      });

      this.audio.src = music.file;
      this.$notify({
        title: "正在为您播放：" + music.title,
        message: "祝您愉快~",
        iconClass: "el-icon-headset",
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
    seekTo(event) {
      if (!this.audio) return;
      const progress = event.offsetX / event.target.clientWidth;
      this.audio.currentTime = progress * this.audio.duration;
    },

    UpMusicButton() {
      this.$refs.uploadMusicButton.click(); // 调用el-upload的内部小按钮的点击实现上传
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

    addWYYBtn(){
      this.addWYYCheck();
      this.addWYYShow = true;
    },
    addWYYCheck(){
      this.addWYYUrl='';
      this.addUrl='';
      this.$axios.get(this.$httpWYY + '/wyyCheck').then(res => res.data).then(res => {
        if (res.code === 200) {
          this.addWYYPass = true;
        } else if ((res.code === 400)) {
          this.addWYYPass=false;
          this.addWYYUrl=res.url;
        }
        else {
          this.addWYYPass=false;
          this.$message({
            showClose: true,
            message: '出错啦！',
            type: 'error'
          });
        }
      }).catch(error => {
        console.log(error)
        this.addWYYPass=false;
        this.$message({
          showClose: true,
          message: '爬虫服务器链接失败啦！',
          type: 'error'
        });
        this.addWYYShow = false;
      })
    },
    addWYY(url){
      this.$axios.post(this.$httpWYY + '/wyyAdd',{
        id: this.user.id,
        url: url
      }).then(res => res.data).then(res => {
        if (res.code === 200) {
          this.$message({
            showClose: true,
            message: '此歌单导入成功！',
            type: 'success'
          });
          this.addWYYShow=false;
          this.musicGetWYY();
        } else if ((res.code === 400)) {
          this.$message({
            showClose: true,
            message: '导入失败或链接无音乐',
            type: 'error'
          });
        }
      }).catch(error => {
        console.log(error)
        this.addWYYPass=false;
        this.$message({
          showClose: true,
          message: '爬虫服务器链接失败啦！',
          type: 'error'
        });
      })
    },

    // 拖动函数
    startDrag(event) {
      this.dragging = true;
      this.offsetX = event.clientX - this.$refs.audioPlayer.offsetLeft;
      this.offsetY = event.clientY - this.$refs.audioPlayer.offsetTop;
      document.addEventListener('mousemove', this.doDrag);
      document.addEventListener('mouseup', this.stopDrag);
    },
    doDrag(event) {
      if (this.dragging) {
        const x = event.clientX - this.offsetX;
        const y = event.clientY - this.offsetY;
        this.$refs.audioPlayer.style.left = x + 'px';
        this.$refs.audioPlayer.style.top = y + 'px';
      }
    },
    stopDrag() {
      this.dragging = false;
      document.removeEventListener('mousemove', this.doDrag);
      document.removeEventListener('mouseup', this.stopDrag);
    },
  },
  mounted() {
    this.checkIfMobile();
    window.addEventListener('resize', this.checkIfMobile);
    // 在组件挂载时添加键盘事件监听器
    window.addEventListener('keyup', this.handleKeyPress);

    this.audio.addEventListener('loadedmetadata', () => {
      this.duration = this.audio.duration;
    });
    this.audio.addEventListener('timeupdate', () => {
      this.currentPercentage = (this.audio.currentTime / this.duration) * 100;
    });
  },
  beforeDestroy() {
    // 在组件销毁前移除键盘事件监听器，以防止内存泄漏
    window.removeEventListener('keyup', this.handleKeyPress);
    window.removeEventListener('resize', this.checkIfMobile);
  }
};

function musicCheckUrl(file) {
  return new Promise((resolve) => {
    const audio = new Audio(file);
    audio.oncanplay = () => {
      resolve(true); // 音乐可用
    };
    audio.onerror = () => {
      resolve(false); // 音乐不可用
    };
  });
}
</script>

<template>
  <div >
<!--    <el-button circle class="floating-button" icon="el-icon-headset" type="primary" @click="musicC"></el-button>-->

    <div style="position: fixed;right: 5px;bottom: 5px;width: 300px;height: 80px; z-index: 100;" ref="audioPlayer" @mousedown="startDrag" v-if="smallMusicShow">
      <div class="audio-player">
        <div class="album-cover">
          <el-avatar :class="{ 'rotate-avatar': !this.audio.paused }" :size="64" :src="musicSearch ? musicSearch : musicIMG"
                     style="font-size: 100px;">
            <img :src=this.musicIMG />
          </el-avatar>
        </div>
        <div class="player-controls">
          <div class="song-info">
            <div class="song-title">
              {{ this.currentMusicIndex > -1 && this.musicList[this.currentMusicIndex] ? this.musicList[this.currentMusicIndex].title : "Music" }}
              <button class="pause-btn newButton" style="position: absolute;top: 5px;right: 0;" @click="musicC">
                <svg class="icon" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" fill="currentColor" height="18" width="18"><path d="M63.989383 105.442494l0 268.396843c0 18.935258 15.368012 34.304294 34.304294 34.304294 18.936281 0 34.304294-15.369036 34.304294-34.304294L132.597971 180.156126l218.107483 218.176045c12.82919 12.830213 33.618679 12.830213 46.515407 0 12.830213-12.897751 12.830213-33.686217 0-46.51643l-218.176045-218.107483 193.683211 0c18.935258 0 34.304294-15.369036 34.304294-34.304294 0-18.935258-15.369036-34.304294-34.304294-34.304294L104.331183 65.09967C79.288834 65.09967 63.989383 77.999468 63.989383 105.442494L63.989383 105.442494z"></path><path d="M917.688719 65.09967 649.290853 65.09967c-18.935258 0-34.304294 15.369036-34.304294 34.304294 0 18.936281 15.369036 34.304294 34.304294 34.304294l193.683211 0-218.176045 218.107483c-12.830213 12.82919-12.830213 33.618679 0 46.51643 12.897751 12.830213 33.686217 12.830213 46.515407 0L889.420909 180.156126l0 193.683211c0 18.935258 15.369036 34.304294 34.304294 34.304294 18.936281 0 34.304294-15.369036 34.304294-34.304294L958.029496 105.442494C958.029496 77.999468 942.79963 65.09967 917.688719 65.09967L917.688719 65.09967z"></path><path d="M104.331183 957.013353l268.397866 0c18.935258 0 34.304294-15.368012 34.304294-34.304294 0-18.936281-15.369036-34.304294-34.304294-34.304294L179.045839 888.404766l218.176045-218.107483c12.830213-12.82919 12.830213-33.618679 0-46.515407-12.897751-12.830213-33.686217-12.830213-46.515407 0l-218.107483 218.176045L132.598994 648.27471c0-18.935258-15.368012-34.304294-34.304294-34.304294-18.936281 0-34.304294 15.369036-34.304294 34.304294l0 268.397866C63.989383 944.115602 79.288834 957.013353 104.331183 957.013353L104.331183 957.013353z"></path><path d="M958.029496 916.671553 958.029496 648.27471c0-18.935258-15.368012-34.304294-34.304294-34.304294-18.935258 0-34.304294 15.369036-34.304294 34.304294l0 193.683211L671.313425 623.781876c-12.82919-12.830213-33.618679-12.830213-46.515407 0-12.830213 12.897751-12.830213 33.686217 0 46.515407l218.176045 218.107483L649.290853 888.404766c-18.935258 0-34.304294 15.368012-34.304294 34.304294 0 18.936281 15.369036 34.304294 34.304294 34.304294l268.397866 0C942.79963 957.013353 958.029496 944.115602 958.029496 916.671553L958.029496 916.671553z"></path></svg>
              </button>
            </div>
            <p class="artist">ZYJ</p>
          </div>
          <div class="progress-bar">
            <el-progress :percentage="currentPercentage?currentPercentage:0" stroke-width="4"
                         color="rgba(218,218,218,0.7)" define-back-color="#4f4f4f" :show-text=false></el-progress>
          </div>
          <div class="buttons">
            <button class="pause-btn" @click="mDown"><svg viewBox="0 0 16 16" class="bi bi-skip-backward-fill" fill="currentColor" height="16" width="16" xmlns="http://www.w3.org/2000/svg"> <path d="M.5 3.5A.5.5 0 0 0 0 4v8a.5.5 0 0 0 1 0V8.753l6.267 3.636c.54.313 1.233-.066 1.233-.697v-2.94l6.267 3.636c.54.314 1.233-.065 1.233-.696V4.308c0-.63-.693-1.01-1.233-.696L8.5 7.248v-2.94c0-.63-.692-1.01-1.233-.696L1 7.248V4a.5.5 0 0 0-.5-.5z"></path> </svg></button>
            <button class="play-btn" @click="musicPlay"><svg viewBox="0 0 16 16" class="bi bi-play-fill" fill="currentColor" height="16" width="16" xmlns="http://www.w3.org/2000/svg" style="color: white"> <path fill="white" d="m11.596 8.697-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393z"></path> </svg></button>
            <button class="pause-btn" @click="musicPause"><svg viewBox="0 0 16 16" class="bi bi-pause-fill" fill="currentColor" height="16" width="16" xmlns="http://www.w3.org/2000/svg" style="color: white"> <path fill="white" d="M5.5 3.5A1.5 1.5 0 0 1 7 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5zm5 0A1.5 1.5 0 0 1 12 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5z"></path> </svg></button>
          </div>
        </div>
      </div>
    </div>


    <el-dialog :visible.sync="musicShow" center fullscreen width="80%" custom-class="musicDialog" style="line-height: 60px;">
      <video class="background-video" autoplay muted loop>
        <source src="../assets/video/ing.mp4" type="video/mp4">
      </video>
      <div style="display: flex;justify-content: space-between; z-index: 10;">
        <div style="height: 100%; width:15%;" v-if="!this.isMobile">
          <div style="display: flex;align-content: center;color: #dadada; line-height: 45px;">
            <el-avatar :size="45" :src="this.user.avatar" style="margin-right: 12px;">
              {{ this.user.name.charAt(0) }}
            </el-avatar>
            <div style="font-size: medium;user-select: none;">
              {{ this.user.name }}
            </div>
          </div>
          <div style="margin-top: 10px;width: 140px; display: flex; flex-direction: column;">
            <el-button style="color: #ffffff; margin-bottom: 10px;  border:none; width: 100%;" :style="{'background-color': isWYY ? 'rgba(86,86,86,0.8)' : 'rgba(194,12,12,0.5)'}"  @click="musicChangeList()">{{isWYY? '本地歌单' : '网易云歌单'}}</el-button>
            <el-button style="background-color: transparent; color: #ffffff; width: 100%; margin: 0;" @click="addWYYBtn()">导入网易云歌单</el-button>
          </div>
        </div>

        <div style="position: absolute; top: 0;left: 0; height: 100%; width: 100%; display: grid;place-items: center;z-index: -1;">
          <div style="text-align: center;position: relative; top: -3em;">
            <el-avatar :class="{ 'rotate-avatar': !this.audio.paused }" :size="this.isMobile?250:350" :src="musicSearch ? musicSearch : musicIMG"
                       style="font-size: 100px;">
              <img :src=this.musicIMG />
            </el-avatar>
            <div style="font-size: 30px; text-align: center;color: #dadada;">
              {{ this.currentMusicIndex > -1 && this.musicList[this.currentMusicIndex] ? this.musicList[this.currentMusicIndex].title : "Music" }}
              <i class="el-icon-cherry"></i>
            </div>
          </div>
        </div>
        <div style="height: 80vh; width: 15%;
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
                       @click="isWYY? musicDelWYY(item.title) : musicDel(item.file)" icon="el-icon-delete">
            </el-button>
          </div>
        </div>
      </div>
      <div v-if="musicShow" class="floating-contor">
        <el-progress :percentage="currentPercentage?currentPercentage:0" @click.native="seekTo"
                     class="progressMusic"
                     color="rgba(218,218,218,0.7)" define-back-color="rgba(218,218,218,0.3)" :show-text=false></el-progress>
        <el-button v-if="musicShow" class="floating-inside" icon="el-icon-close" size="medium"
                   @click="musicC"></el-button>
        <el-button v-if="musicShow" class="floating-inside" icon="el-icon-arrow-left" size="medium"
                   @click="mDown"></el-button>
        <el-button v-if="musicShow" :icon="this.musicPlayer" class="floating-inside" size="medium"
                   @click="mPlay"></el-button>
        <el-button v-if="musicShow" class="floating-inside" icon="el-icon-arrow-right" size="medium"
                   @click="mUp"></el-button>
        <el-button v-if="musicShow" class="floating-inside" icon="el-icon-upload2" size="medium"
                   @click="UpMusicButton"></el-button>
        <el-upload
            :action="`${this.postUrl}/music/up/${this.user.id}`"
            :before-upload="beforeUpload"
            :on-change="handleChange"
            accept="audio/mp3,audio/m4a"
            multiple
            :show-file-list=false>
          <button ref="uploadMusicButton" style="opacity: 0;"></button>
        </el-upload>
      </div>

<!--      导入网易云-->
      <el-dialog
          :visible.sync="addWYYShow"
          append-to-body
          fullscreen>
        <div v-loading.fullscreen.lock="!addWYYUrl&&!addWYYPass&&addWYYShow"
             element-loading-text="请稍后 ..."></div>
        <div v-if="!addWYYPass">
          <el-result icon="info" title="请使用手机网易云扫码登陆" v-if="addWYYUrl">
            <template slot="icon">
              <el-image style="width: 300px;" :src=addWYYUrl></el-image>
            </template>
            <template slot="extra">
              <div style="font-size: large;white-space: nowrap; margin-bottom: 40px;">
                <div style="margin-top:5px;">扫码完成后请点击检查</div>
              </div>
              <el-button @click="addWYYShow=false">关闭</el-button>
              <el-button type="primary" icon="el-icon-refresh" @click="addWYYCheck">检查</el-button>
            </template>
          </el-result>
        </div>
        <div v-if="addWYYPass">
          <el-result icon="success" title="请粘贴您要导入的歌单页面链接">
            <template slot="extra">
              <div style="font-size: large;white-space: nowrap;">
                我们会导入您的歌单，但是网易云<div style="display: inline; color: darkred;"> VIP音乐 </div>无法播放
                <div style="margin-top:5px;">对此，如果您有更好的爬虫 欢迎加入我们 ~</div>
              </div>
              <el-input v-model="addUrl"
                        clearable
                        placeholder="歌单网址"
                        @keyup.enter.native="addWYY(addUrl)"
                        style="margin: 30px 0;"></el-input>
              <el-button @click="addWYYShow=false">关闭</el-button>
              <el-button type="primary" @click="addWYY(addUrl)">提交</el-button>
            </template>
          </el-result>
        </div>
      </el-dialog>
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

.audio-player {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 300px;
  height: 80px;
  background-color: rgba(110, 110, 110, 0.9);
  border-radius: 8px;
  padding: 8px;
  box-sizing: border-box;
}

.album-cover {
  width: 64px;
  height: 64px;
  background-color: #fff;
  border-radius: 50%;
  margin-right: 12px;
}

.player-controls {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

.song-info {
  margin-bottom: 4px;
}

.song-title {
  max-width: 200px;
  font-size: 16px;
  color: #fff;
  margin: 0;
  overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
}

.artist {
  font-size: 12px;
  color: #b3b3b3;
  margin: 0;
}

.progress-bar {
  width: 90%;
  height: 4px;
  border-radius: 2px;
  overflow: hidden;
}

.buttons {
  margin-top: 5px;
  display: flex;
}

.buttons button {
  background: none;
  border: none;
  cursor: pointer;
  outline: none;
}
.newButton{
  background: none;
  border: none;
  cursor: pointer;
  outline: none;
}

.play-btn,
.pause-btn {
  font-size: 16px;
  color: #fff;
  margin-right: 8px;
  transition: transform 0.2s ease-in-out;
}

.play-btn:hover,
.pause-btn:hover {
  transform: scale(1.2);
}

@media (min-width: 768px) {
  .progressMusic{
    width: 40em;position: absolute;top: -3em;
  }

  .floating-contor {
    position: absolute;
    bottom: 20px;
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
  .progressMusic{
    width: 25em;position: absolute;top: -3em;
  }

  .floating-contor {
    position: absolute;
    bottom: 20px;
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