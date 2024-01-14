<!-- eslint-disable vue/multi-word-component-names -->
<script >
export default {
  name: "Header",
  data(){
    return{
      drawer:false,
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
      this.isMobile = window.innerWidth < 768; // Adjust the value based on your requirements
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

  <el-button class="floating-button" icon="el-icon-upload" type="primary" @click="drawer=true;" :disabled="sizeFull">上传</el-button>
  <el-empty v-if="FileList.length === 0">
    <el-button type="success" @click="drawer=true;">上传文件 !</el-button>
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
    <el-table
        :data="FileList"
        :header-cell-style="{ background:'#F0F0F0', color:'#000'}"
        border
        style="width: 95%; margin: 10px auto; box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);">
      <el-table-column label="文件名" prop="name">

      </el-table-column>
      <el-table-column label="下载路径" prop="file" >
      </el-table-column>
      <el-table-column label="操作" prop="operate" >
        <template slot-scope="scope">
          <a :href="scope.row.file" :download="scope.row.name" target="_blank">
            <el-button type="primary" slot="reference" icon="el-icon-download" style="margin-left: 10px;">下载</el-button>
          </a>
          <el-button slot="reference" icon="el-icon-delete-solid" type="danger" @click="fileDel(scope.row.file)" style=" margin-left: 10px;">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>

  <el-dialog :visible.sync="drawer" center title="上传文件" :fullscreen=isMobile>
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
      <el-button type="primary" @click="drawer = false">好的</el-button>
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
</style>