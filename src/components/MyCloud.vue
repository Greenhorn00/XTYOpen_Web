<!-- eslint-disable vue/multi-word-component-names -->
<script >
export default {
  name: "Header",
  data(){
    return{
      drawer:false,
      postUrl: this.$httpUrl,
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
          this.FileList = res.data;
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
  },
  created() {
    this.fileGet();
  },
}
</script>

<template>
<div>

  <el-button class="floating-button" icon="el-icon-upload" type="primary" @click="drawer=true;">上传</el-button>
  <el-empty v-if="FileList.length === 0">
    <el-button type="success" @click="drawer=true;">上传文件 !</el-button>
  </el-empty>
  <div style="height: 80vh;" v-if="FileList.length !== 0">
    <el-table
        :data="FileList"
        :header-cell-style="{ background:'#F0F0F0', color:'#000'}"
        border
        style="width: 95%; margin: 20px auto; box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);">
      <el-table-column label="文件名" prop="name">

      </el-table-column>
      <el-table-column label="路径" prop="file" >
      </el-table-column>
      <el-table-column label="操作" prop="operate" >
        <template slot-scope="scope">
          <a :href="scope.row.file" :download="scope.row.name" target="_blank">
            <el-button type="primary" slot="reference" icon="el-icon-download" style="margin-left: 10px;">下载</el-button>
          </a>
          <el-button slot="reference" icon="el-icon-delete-solid" type="danger" @click="fileDel(scope.row.file)" style=" margin-left: 10px;"></el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>

  <el-dialog :visible.sync="drawer">
    <el-upload
        :action="`${this.postUrl}/files/up/${this.user.id}`"
        :on-change="handleChange"
        multiple
        drag
        style=" margin: auto;">
      <i class="el-icon-upload" ></i>
      <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
    </el-upload>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="drawer = false">确 定</el-button>
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
</style>