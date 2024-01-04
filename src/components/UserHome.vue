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
      deadline5: new Date("2024-01-06"),
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
      <el-row :gutter="20"
              style="width: 84%; height: 70px; margin-top: 10px;padding: 10px; position: relative; left: 2%; box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1)">
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
          <el-descriptions :column="3" direction="vertical" style=" max-width: 500px; min-width: 350px;  margin: 30px 70px; padding: 20px 20px; box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1)"
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
              <el-progress :color="colors" :percentage=this.user.level class="dengJi" stroke-width="15"
                           type="dashboard"></el-progress>
            </el-descriptions-item>
          </el-descriptions>
          <el-button icon="el-icon-edit" size="mini" style="position: relative; top:-80px;left: 90px;" type="primary"
                     @click="mod()">修改信息
          </el-button>
        </div>

        <el-descriptions :column="2" direction="vertical" style="width: 300px;height: 320px;margin: 0 0 30px 0;padding: 20px 20px; box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1)"
                         title="文章发表">
          <el-descriptions-item label="文章数">{{ this.user.postnum }}</el-descriptions-item>
          <el-descriptions-item label="点赞量">{{ this.user.likes }}</el-descriptions-item>
          <el-descriptions-item label="放假：">
            <el-statistic
                :value="deadline5"
                format="DD天HH小时mm分钟"
                time-indices
                title="🚩距离放假还有："
            >
            </el-statistic>
          </el-descriptions-item>
        </el-descriptions>

        <div class="upload-demo"
             style="text-align: center;width: 400px; margin-left: 50px; box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1)">
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
            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
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
@media (min-width: 768px) {
  .dengJi {
    transform: scale(0.9);
  }

  .upload-demo {
    transform: scale(0.9);
  }

}

@media (min-width: 0px) and (max-width: 768px) {
  .dengJi {
    transform: scale(0.7);
  }

  .upload-demo {
    transform: scale(0.8);
  }

}
</style>