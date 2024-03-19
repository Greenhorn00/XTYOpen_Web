<!-- eslint-disable vue/multi-word-component-names -->
<script xmlns:https="http://www.w3.org/1999/xhtml">

export default {
  name: "UserHome",
  components: {},
  data() {
    return {
      postUrl: this.$httpUrl,
      // imageUrl: this.$httpUrl + '/static/img/Background.jpg',
      imageUrl: require('../assets/img/Background.jpg'),
      centerDialogVisible: false,
      user: JSON.parse(sessionStorage.getItem('CurUser')),
      loading: false,
      deadline5: new Date("2024-03-02"),
      collectPost:[],
      colors: [
        {color: '#f56c6c', percentage: 20},
        {color: '#e6a23c', percentage: 40},
        {color: '#5cb87a', percentage: 60},
        {color: '#1989fa', percentage: 80},
        {color: '#6f7ad3', percentage: 100}
      ],
      form: {
        id: '',
        name: '',
        password: '',
        age: '',
        sex: '',
        phone: '',
      },
      rules: {
        name: [
          {required: true, message: '请输入名称', trigger: 'blur'}
        ],
        password: [
          {required: true, message: '请输入密码', trigger: 'blur'}
        ],
        sex: [
          {required: true, message: '请输入性别', trigger: 'blur'}
        ],
        age: [
          {required: true, message: '请输入年龄', trigger: 'blur'},
          {type: 'number', message: '年龄必须为数字'}
        ],
      }
    }
  },
  methods: {
    loadPost() {
      this.$axios.post(this.$httpUrl + '/user/find', this.form).then(res => res.data)
          .then(res => {
            if (res.code == 200) {
              sessionStorage.setItem("CurUser", JSON.stringify(res.data))
              this.user = res.data;
            }
          })
      this.$nextTick(() => {
        this.$axios.get(this.$httpUrl + '/userpost/list?userId=' + this.user.id).then(res => res.data)
            .then(res => {
              if (res.code === 200) {
                this.collectPost = res.data;
              }
            })
      })
    },
    goToPost(postId) {
      this.$router.replace('/Post/' + postId);
    },
    delCollectPost(postId){
      this.$axios.get(this.$httpUrl + '/userpost/del?userId=' + this.user.id + '&postId=' + postId).then(res => res.data)
          .then(res => {
            if (res.code === 200) {
              this.$message({
                showClose: true,
                message: '已取消收藏',
                type: 'success',
              });
              this.loadPost();
            }
          })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    mod() {
      this.centerDialogVisible = true;
      this.$nextTick(() => {
        this.form.id = this.user.id;
        this.form.name = this.user.name;
        this.form.password = this.user.password;
        this.form.age = this.user.age;
        this.form.sex = this.user.sex + '';
        this.form.phone = this.user.phone;
      })
    },
    save() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.loading = true;
          this.$axios.post(this.$httpUrl + '/user/update', this.form).then(res => res.data)
              .then(res => {
                if (res.code === 200) {
                  this.centerDialogVisible = false;
                  this.$message({
                    showClose: true,
                    message: '修改成功',
                    type: 'success',
                  });
                  this.loadPost();
                  this.loading = false;
                } else {
                  this.$message({
                    showClose: true,
                    message: '服务器开小差啦~请稍后重试',
                    type: 'error'
                  });
                }
              })
          this.resetForm('form');
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
// 确认关闭
    handleClose(done) {
      this.$confirm('确认关闭？您的信息不会保存')
          .then(() => {
            done();
          })
          .catch(() => {
          });
    },
    handleChange(file, fileList) {
      console.log(fileList);
      if (file.response && file.response.code === 200) {
        this.$message({
          showClose: true,
          message: '更新成功',
          type: 'success'
        });
        sessionStorage.setItem("CurUser", JSON.stringify(file.response.data));
        this.$user = file.response.data;
        this.user = file.response.data;
      } else if (file.response && file.response.code === 400) {
        this.$message({
          showClose: true,
          message: '更新失败',
          type: 'error'
        });
      }
    },
    beforeUpload(file) {
      const isJPG = file.type === 'image/jpeg';
      const isPNG = file.type === 'image/png';
      if (!isJPG && !isPNG) {
        this.$message({
          showClose: true,
          message: '抱歉，只能上传 JPG 或 PNG 格式的图片',
          type: 'error'
        });
        return false;
      }
      return true;
    },

    autoLoad() {
      this.$axios.post(this.$httpUrl + '/user/find', {
        id: this.user.id
      }).then(res => res.data)
          .then(res => {
            if (res.code === 200) {
              this.user = res.data;
              sessionStorage.setItem("CurUser", JSON.stringify(res.data));
            }
          })
    }
  },
  created() {
    this.loadPost();
    this.interval = setInterval(this.autoLoad, 60000); // 30秒
  },
  beforeDestroy() {
    clearInterval(this.interval); // 清除定时器以防止内存泄漏
  },
}
</script>
<!--http://localhost:8090/img/Background.jpg-->
<template>
  <div>
    <!--        :style="{ 'background-image': 'url(' + imageUrl + ')' }"-->
    <div
            :style="{ 'background-image': 'url(' + imageUrl + ')' }"
        style="display: flex; justify-content: center; align-items: center; flex-direction: column;  padding-bottom: 60px;">
      <div style="margin-top: 40px; margin-bottom: 20px">
        <el-avatar :size="200" :src=this.user.avatar style="font-size: 40px;">{{ this.user.name.charAt(0) }}</el-avatar>
      </div>
      <span style="font-size: 30px; font-weight: lighter">{{ this.user.name }}</span>
    </div>

    <div style="display: flex;flex-direction: column;
  justify-content: center;
  align-items: center;">
      <el-row :gutter="20" class="userRow">
        <el-col :span="6">
          <div>
            <el-statistic
                :value="this.user.likes"
                group-separator=","
                title="获赞量"
            ></el-statistic>
          </div>
        </el-col>
        <el-col :span="6">
          <div>
            <el-statistic
                :value="this.user.postnum"
                group-separator=","
                title="文章数"
            ></el-statistic>
          </div>
        </el-col>
        <el-col :span="6">
          <div>
            <el-statistic
                :value="this.user.level"
                group-separator=","
                title="等级"
            ></el-statistic>
          </div>
        </el-col>
        <el-col :span="6">
          <div>
            <el-statistic
                :value="this.user.age"
                group-separator=","
                title="年龄"
            ></el-statistic>
          </div>
        </el-col>
      </el-row>
      <div style="display: flex; justify-content:  space-around; align-items: center; flex-wrap: wrap;">
        <div>
          <el-descriptions :column="3" direction="vertical" class="userContent"
                           title="个人信息">
            <el-descriptions-item label="账号">{{ this.user.no }}</el-descriptions-item>
            <el-descriptions-item label="用户名">{{ this.user.name }}</el-descriptions-item>
            <el-descriptions-item :span="2" label="年龄">{{ this.user.age }}</el-descriptions-item>
            <el-descriptions-item label="性别">
              {{ this.user.sex == 1 ? "男" : "女" }}
            </el-descriptions-item>
            s
            <el-descriptions-item label="手机号">{{ this.user.phone }}</el-descriptions-item>
            <el-descriptions-item label="等级">
              <el-progress :color="colors" :percentage=parseInt(this.user.level) class="dengJi" :stroke-width=15
                           type="dashboard"></el-progress>
            </el-descriptions-item>
          </el-descriptions>
          <el-button icon="el-icon-edit" size="mini" style="position: relative; top:-80px;left: 90px;" type="primary"
                     @click="mod()">修改信息
          </el-button>
        </div>

        <el-descriptions class="postS" :column="1" direction="vertical" style="padding: 20px 20px; box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1)"
                         title="我的收藏">
          <el-descriptions-item :label=" collectPost.length + ' 篇文章'" >
            <div style="height: 100%;overflow-y: auto;">
              <div class="postTitle" v-for="(item,i) in collectPost" :key="i">
                <div @click="goToPost(item.post.id)"
                     style="width: 100%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                  {{item.post.title}}
                </div>
                <i @click="delCollectPost(item.post.id)" class="el-icon-delete" ></i>
              </div>
            </div>
            <el-empty v-if="collectPost.length===0" description="快添加喜欢的文章叭" :image-size="120"></el-empty>
          </el-descriptions-item>

        </el-descriptions>

        <div class="upload-demo">
          <h2 style="font-size: 16px; font-weight: normal; margin: 15px;  text-shadow: 0 0 5px #6dacfd, 0 0 10px #e1eaff; ">
            更新头像</h2>
          <el-upload
              :action="`${this.postUrl}/user/up/${this.user.id}`"
              :before-upload="beforeUpload"
              :on-change="handleChange"
              accept=".jpg,.jpeg,.png"
              drag
              multiple
              style="margin-bottom: 15px;">
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">将图片拖到此处，或<em>点击上传</em></div>
          </el-upload>
        </div>

      </div>
    </div>
    <el-dialog
        :before-close="handleClose"
        :visible.sync="centerDialogVisible"
        center
        title="用户"
        width="30%">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px" status-icon>
        <el-form-item label="名称" prop="name">
          <el-col :span="20">
            <el-input v-model="form.name"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-col :span="20">
            <el-input v-model="form.password" show-password></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="性别" prop="sex">
          <el-radio-group v-model="form.sex" size="small">
            <el-radio-button label="1">男</el-radio-button>
            <el-radio-button label="0">女</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="年龄" prop="age">
          <el-col :span="20">
            <el-input v-model.number="form.age"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="电话" prop="phone">
          <el-col :span="20">
            <el-input v-model="form.phone"></el-input>
          </el-col>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="centerDialogVisible = false">取 消</el-button>
        <el-button :loading="loading" type="primary" @click="save">{{ loading ? '提交中 ...' : '确 定' }}</el-button>
      </span>
    </el-dialog>
  </div>


</template>

<style scoped>
*{
  user-select: none;
}
/deep/ .el-upload{
  width: 100%;
}
/deep/ .el-upload .el-upload-dragger{
  width: 100%;
  height: 240px;
}
.postTitle{
  color: #777777;
  margin-bottom: 5px;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.postTitle :hover{
  color: black;
}
@media (min-width: 768px) {
  .dengJi {
    transform: scale(0.9);
  }
  .userRow{
    width: 84%;
    height: 70px;
    margin-top: 10px;
    padding: 10px;
    position: relative;
    left: 2%;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1)
  }

  .userContent{
    max-width: 500px;
    min-width: 350px;
    margin: 30px 70px;
    padding: 20px 20px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1)
  }

  .upload-demo {
    text-align: center;
    width: 250px;
    height: 320px;
    margin-left: 50px;
    position: relative;
    top: -15px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1)
  }
  .postS{
    width: 450px;height: 320px;margin: 0 0 30px 0;
  }

}

@media (min-width: 0px) and (max-width: 768px) {
  .dengJi {
    transform: scale(0.7);
  }

  .userRow{
    width: 100%;
    height: 70px;
    padding: 10px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1)
  }

  .userContent{
    width: 100%;
    height: 320px;
    margin: 5px 0;
    padding: 15px 15px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1)
  }

  .upload-demo {
    text-align: center;
    width: 90%;
    height: 320px;
    margin-bottom: 20px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1)
  }

  .postS{
    width: 90%;height: 320px;margin: 0 0 30px 0;
  }

}
</style>