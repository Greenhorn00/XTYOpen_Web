<!-- eslint-disable vue/multi-word-component-names -->
<script>
export default {
  name: "Header",
  data() {
    return {
      base_music1:"我会等",
      postUrl: this.$httpUrl,
      musicShow: false,
      drawer:false,
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
      if (this.musicShow) {
        setTimeout(() => {
          this.musicShow = false;
        }, 20000); // 30秒后将 musicShow 设置为 false
      }
    },
    musicGet() {
      this.$axios.get(this.$httpUrl + '/music/list?userId=' + this.user.id).then(res => res.data).then(res => {
        if (res.code === 200) {
          this.musicList = res.data;
          this.$notify({
            title: "音乐加载成功",
            message: '~来听听歌叭~',
            type: 'success'
          });
        } else {
          this.$notify({
            title: "音乐加载失败",
            message: '服务器开小差啦~ 请稍后再试',
            type: 'error'
          });
        }
      })
    },
    musicDel(file){
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        console.log(this.audio.src +"这个这个"+ file)
        if(this.audio.src === file){
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
        });
        this.audio.play();
        this.musicPlayer = "el-icon-video-pause";
      } else {
        this.audio.pause();
        this.$notify({
          title: "已暂停",
          message: "您已暂停音乐",
          iconClass: "el-icon-headset",
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
        iconClass: "el-icon-headset"
      });
      this.audio.play();
      this.musicPlayer = "el-icon-video-pause";
    },
    mDown() {
      this.currentMusicIndex--;
      if (this.currentMusicIndex === -1) {
        this.currentMusicIndex = this.musicList.length - 1;
      }
      const music = this.musicList[this.currentMusicIndex];
      this.audio.src = music.file;
      this.$notify({
        title: "正在为您播放：" + music.title,
        message: "祝您愉快~",
        iconClass: "el-icon-headset"
      });
      this.audio.play();
      this.musicPlayer = "el-icon-video-pause";
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
      const isMP3 = file.type === 'audio/mpeg' || file.type === 'audio/mp3';
      if (!isMP3) {
        this.$message({
          showClose: true,
          message: '抱歉，只能上传 MP3 格式的音乐',
          type: 'error'
        });
        return false;
      }
      return true;
    },

  },
  props: {
    icon: String
  },

};
</script>

<template>
  <div >
    <el-button circle class="floating-button" icon="el-icon-headset" type="primary" @click="musicC"></el-button>
    <el-button v-if="musicShow" circle class="musicR" icon="el-icon-setting" @click="drawer = true;"></el-button>
    <div v-if="musicShow" class="floating-contor">
      <el-button v-if="musicShow" class="floating-inside" icon="el-icon-arrow-left" size="small"
                 @click="mDown"></el-button>
      <el-button v-if="musicShow" :icon="this.musicPlayer" class="floating-inside" size="small"
                 @click="mPlay"></el-button>
      <el-button v-if="musicShow" class="floating-inside" icon="el-icon-arrow-right" size="small"
                 @click="mUp"></el-button>
    </div>

    <div style="display: flex;line-height: 50px;">
      <div style="position: relative;">
        <i :class="icon"
           style="font-size: 25px; position: absolute;top: 50%;transform: translateY(-50%); cursor: pointer"
           @click="collapse"></i>
      </div>
      <div style="position: relative; flex: 1; text-align: center; font-size: 20px; left: 60px;">
        <span>{{ greetingMessage }}</span>
      </div>
      <el-avatar :size="35" :src="this.user.avatar" shape="square" style="margin-right: 12px; position: relative; top: 8px;">
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

    <el-upload
        :action="`${this.postUrl}/music/up/${this.user.id}`"
        :before-upload="beforeUpload"
        :on-change="handleChange"
        accept=".mp3"
        multiple
        style="width: 0;height: 0;">
      <el-button v-if="musicShow" circle class="musicNew" icon="el-icon-upload"></el-button>
    </el-upload>

    <el-dialog :visible.sync="drawer">
      <el-table
          :data="musicList"
          :header-cell-style="{ background:'#F0F0F0', color:'#000'}"
          border
          style="width: 95%; margin: 20px auto; box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);">
        <el-table-column label="音乐名" prop="title" width="260">
          <template slot-scope="scope">
            <el-tag disable-transitions color="#fff"  style="font-size: large; margin-left: 20px;" >
              {{ scope.row.title }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="路径" prop="file" width="400">
        </el-table-column>
        <el-table-column label="操作" prop="operate">
          <template slot-scope="scope">
            <el-button slot="reference" type="danger" @click="musicDel(scope.row.file)" style="margin-left: 10px;"
                       :disabled="scope.row.title==='我会等' || scope.row.title==='晴天'">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="drawer = false">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<style scoped>
@media (min-width: 768px) {
  .musicNew {
    color: #3a8ee6;
    z-index: 1;
    position: fixed;
    bottom: 150px;
    right: 20px;
    font-size: 25px;
  }

  .musicR {
    color: #3a8ee6;
    z-index: 1;
    position: fixed;
    bottom: 90px;
    right: 20px;
    font-size: 25px;
  }

  .floating-contor {
    position: fixed;
    bottom: 30px;
    right: 20px;
    width: 225px;
    height: 50px;
    display: flex;
  }

  .floating-inside {
    z-index: 1;
    font-size: large;
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
  .musicNew {
    color: #3a8ee6;
    z-index: 1;
    position: fixed;
    bottom: 110px;
    right: 20px;
    font-size: 10px;
  }

  .musicR {
    color: #3a8ee6;
    z-index: 1;
    position: fixed;
    bottom: 70px;
    right: 20px;
    font-size: 10px;
  }

  .floating-contor {
    z-index: 1;
    position: fixed;
    bottom: 30px;
    right: 15px;
    width: 225px;
    height: 40px;
    display: flex;
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