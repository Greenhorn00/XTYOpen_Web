<!-- eslint-disable vue/multi-word-component-names -->
<script >
export default {
  name: "Header",
  data(){
    return{
      drawerUp:false,
      postUrl: this.$httpUrl,
      sizeGB: 0,
      sizeT: 0,
      sizeFull: false,
      isMobile: false,
      customColors: [
        {color: '#0c9600', percentage: 20},
        {color: '#005b00', percentage: 40},
        {color: '#984747', percentage: 60},
        {color: '#bd3434', percentage: 80},
        {color: '#ce0000', percentage: 100}
      ],
      user: JSON.parse(sessionStorage.getItem('CurUser')),
      FileList: [ //已转动态加载
        // {
        //   name: '1.text',
        //   file: 'http://localhost:8090/static/music/nh.mp3'
        // },

      ],
    }
  },
  methods:{
    updateOpen(){
      this.drawerUp = true;
    },

    fileGet() {
      this.$axios.get(this.$httpUrl + '/files/list?userId=' + this.user.id).then(res => res.data).then(res => {
        if (res.code === 200) {
          this.FileList = res.data.list;
          this.sizeGB = res.data.size;
          this.sizeT = this.sizeGB/0.05 > 100 ? 100 : this.sizeGB/0.05;
          if (this.sizeGB/0.05 >= 100) this.sizeFull = true;
        } else {
          this.$message({
            showClose: true,
            message: '文件加载失败..',
            type: 'error'
          });
        }
      })
    },
    fileDel(file){
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$axios.get(this.$httpUrl + '/files/del?file=' + file).then(res => res.data).then(res => {
          if (res.code === 200) {
            this.fileGet();
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
    handleChange(file, fileList) {
      console.log(fileList);
      if (file.response && file.response.code === 200) {
        this.$message({
          showClose: true,
          message: '上传成功',
          type: 'success'
        });
        this.fileGet();
      } else if (file.response && file.response.code === 400) {
        this.$message({
          showClose: true,
          message: '文件上传失败，请稍后再试',
          type: 'error'
        });
      }
    },
    checkIfMobile() {
      this.isMobile = window.innerWidth < 800; // Adjust the value based on your requirements
    },
    format(percentage) {
      return percentage >= 100 ? '满' : `${percentage.toFixed(0)}%`;
    },
  },
  created() {
    this.fileGet();
  },
  mounted() {
    this.checkIfMobile();
    window.addEventListener('resize', this.checkIfMobile);
  },
}
</script>

<template>
<div>

  <el-button class="floating-button" icon="el-icon-upload" type="primary" @click="updateOpen" :disabled="sizeFull">上传</el-button>
  <el-empty v-if="FileList.length === 0">
    <el-button type="success" @click="updateOpen">上传文件 !</el-button>
  </el-empty>
  <div style="height: 80vh; overflow-y: auto;" v-if="FileList.length !== 0">
    <div style="display: flex;justify-content: start;align-items: center; margin-left: 2.5vw;margin-top: 10px;">
      <div style="display: flex;">
        已用空间：
        <el-progress :percentage=sizeT :format="format" :color="customColors" :stroke-width=20 style="width: 180px;"></el-progress>
      </div>
      <div style="color: #9a9a9a">
        您的云盘上限为 7GB
      </div>
    </div>

    <div style="margin-top: 10px;display: flex;flex-wrap: wrap;">
      <div style="position: relative;
                  width: 180px;
                  min-height: 180px;
                  border-radius: 10px;
                  margin: 1em 1em;
                  padding: 0.5em;
                  text-align: center;
                  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);"
           v-for="(item,i) in FileList" :key="i" >
        <i class="el-icon-folder" style="font-size: 50px;margin-top: 5px;"></i>
        <div style="word-wrap: break-word;">{{item.name}}</div>

        <div style="position: absolute;left: 0; bottom: 10px;width: 100%; display: flex; justify-content: space-evenly;">
          <a :href="item.file" :download="item.name" target="_blank">
            <el-button slot="reference" icon="el-icon-download" style="font-size: 25px;background-color: transparent;"></el-button>
          </a>
          <button class="delButton" @click="fileDel(item.file)">
            <svg viewBox="0 0 448 512" class="svgIcon"><path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"></path></svg>
          </button>
        </div>
      </div>
    </div>

  </div>

  <el-dialog :visible.sync="drawerUp" center title="上传文件" :fullscreen=isMobile>
    <div style="text-align: center;">
      <el-upload
          :action="`${this.postUrl}/files/up/${this.user.id}`"
          :on-change="handleChange"
          multiple
          drag>
        <i class="el-icon-upload" ></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
      </el-upload>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="drawerUp = false">好的</el-button>
    </div>
  </el-dialog>
</div>
</template>

<style scoped>
.floating-button {
  z-index: 2;
  position: fixed;
  bottom: 30px;
  margin-left: 20px;
  font-size: 16px;
  box-shadow: 0px 5px 10px rgba(0, 0, 0, 0.2);
}
/deep/ .el-upload{
  width: 100%;
}
/deep/ .el-upload .el-upload-dragger{
  width: 100%;
  height: 200px;
}

.delButton {
  width: 60px;
  height: 45px;
  border-radius: 5px;
  background-color: transparent;
  border: none;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  //box-shadow: 0 0 20px rgba(0, 0, 0, 0.164);
  cursor: pointer;
  transition-duration: .3s;
  overflow: hidden;
  position: relative;
}

.svgIcon {
  width: 12px;
  transition-duration: .3s;
}

.svgIcon path {
  fill: #464646;
}

.delButton:hover {
  transition-duration: .3s;
  align-items: center;
}

.delButton:hover .svgIcon {
  width: 50px;
  transition-duration: .3s;
  transform: translateY(60%);
}

.delButton::before {
  position: absolute;
  top: -20px;
  content: "Delete";
  color: #464646;
  transition-duration: .3s;
  font-size: 2px;
}

.delButton:hover::before {
  font-size: 13px;
  opacity: 1;
  transform: translateY(30px);
  transition-duration: .3s;
}
</style>