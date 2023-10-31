<script>
export default {
  name: "LogIn",
  data() {
    let checkOnlyNo = (rule, value, callback) => {
      //保证修改时顺利验证（id会重复）
      if (this.form.id) {
        return callback();
      }

      this.$axios.post(this.$httpUrl + '/user/findByNo', {
        pageSize: '',
        pageNum: '',
        param: {
          no: this.form.no
        }
      }).then(res => res.data).then(res => {
        if (res.code === 200) {
          callback(new Error('账号已存在'));
        } else {
          callback();
        }
      })
    };

    return {
      loading: false,
      confirm_disabled: false,
      centerDialogVisible: false,
      sexs: [
        {
          value: '1',
          label: '男'
        }, {
          value: '0',
          label: '女'
        }
      ],
      form: {
        id: '',
        no: '',
        name: '',
        password: '',
        age: '',
        sex: '',
        phone: '',
        roleId: '2',
        isvalid: 'Y',
        level: '0'
      },
      rulesNew: {
        no: [
          {required: true, message: '请输入账号', trigger: 'blur'},
          {min: 5, max: 10, message: '长度在 4 到 10 个字符', trigger: 'blur'},
          {validator: checkOnlyNo, trigger: 'blur'}
        ],
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
      },
      loginForm: {
        no: '',
        password: '',
      },
      rules: {
        no: [
          {required: true, message: '请输入账号', trigger: 'blur'}
        ],
        password: [
          {required: true, message: '请输入密码', trigger: 'blur'}
        ]
      },

    }
  },
  methods: {
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    add() {
      this.form.id = '';
      this.centerDialogVisible = true;
      this.$nextTick(() => {
        this.resetForm('form');
      })
    },
    save() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.loading = true;
          this.$axios.post(this.$httpUrl + '/user/save', this.form).then(res => res.data)
              .then(res => {
                if (res.code === 200) {
                  this.centerDialogVisible = false;
                  this.$message({
                    showClose: true,
                    message: '添加成功',
                    type: 'success',
                  });
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
    confirm() {
      this.confirm_disabled = true;
      this.$refs.loginForm.validate((valid) => {
        if(valid){
          this.$axios.post(this.$httpUrl + '/user/login',this.loginForm).then(res => res.data).then(res => {
            console.log(res)
            if(res.code == 200){

              this.$notify({
                title: '欢迎'+res.data.user.name,
                message: '欢迎回来',
                type: 'success'
              });
              // 储存
              sessionStorage.setItem("CurUser", JSON.stringify(res.data.user))
              this.$store.commit("setMenu",res.data.menu) // 设置传来路由

              console.log(res.data.menu)
              //跳转
              this.$router.replace('/Index')

            }else {
              this.confirm_disabled = false;
              this.$message({
                showClose: true,
                message: '账号或密码错误,或此账号已封',
                type: 'error',
              });
            }
          })
        }
      })
    },
    updateVideoSize() {
      const video = this.$refs.videoRef;
      video.style.width = `${window.innerWidth}px`;
      video.style.height = `${window.innerHeight}px`;
    },
    handleClose(done) {
      this.$confirm('确认关闭？您的信息不会保存')
          .then(() => {
            done();
          })
          .catch(() => {
          });
    },
  },
  mounted() {
    this.updateVideoSize();
    window.addEventListener('resize', this.updateVideoSize);
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.updateVideoSize);
  },
};
</script>

<template>
  <div >

    <div class="loginOutLine">
      <div class="loginOut">
        <h2 class="login-title">XTYOpen</h2>
        <el-form ref="loginForm"
                 :model="loginForm"
                 :rules="rules"
                 class="log-form"
                 label-width="60px"
                 style=" margin-top: 20px;">
          <el-form-item label="账号" prop="no">
            <el-col :span="21">
              <el-input
                  v-model="loginForm.no"
                  clearable
                  placeholder="账号"
                  type="text">
              </el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-col :span="21">
              <el-input
                  v-model="loginForm.password"
                  clearable
                  placeholder="账号"
                  show-password
                  type="password" @keyup.enter.native="confirm">
              </el-input>
            </el-col>
          </el-form-item>
          <el-form-item>
            <el-col>
              <el-button :disabled="confirm_disabled" style="width: 300px; margin-top: 5px;" type="primary"
                         @click="confirm"> 登陆
              </el-button>
            </el-col>
          </el-form-item>
          <el-form-item>
            <el-col>
              <el-button style="width: 300px;" type="success"
                         @click="add"> 注册
              </el-button>
            </el-col>
          </el-form-item>
        </el-form>
      </div>
    </div>

    <div class="video-container">
      <video ref="videoRef" class="video" autoplay muted loop>
        <source src="../assets/video/back.mp4" type="video/mp4" />
      </video>
    </div>

    <el-dialog
        :before-close="handleClose"
        :visible.sync="centerDialogVisible"
        center
        title="用户"
        width="30%">
      <el-form ref="form" :model="form" :rules="rulesNew" label-width="80px" status-icon>
        <el-form-item label="账号" prop="no">
          <el-col :span="20">
            <el-input v-model="form.no" :disabled=(!!form.id)></el-input>
          </el-col>
        </el-form-item>
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
        <el-button type="primary" @click="save" :loading="loading">{{ loading ? '提交中 ...' : '确 定' }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<style scoped>

.video-container {
  z-index: -100;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.video {
  object-fit: cover;
}

@media (min-width: 768px){
  .loginOutLine {
    display: flex;
    justify-content: center;

    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 700px;
  }

  .loginOut {
    width: 400px;
    padding: 50px 15px;
    background: transparent;
    box-shadow: 0 15px 20px rgba(0, 0, 0, 0);
    transition: .5s;
    backdrop-filter: blur(2px);
    -webkit-backdrop-filter: blur(2px);
    transition-delay: 4s; /* 4秒的延迟 */
  }

  .loginOutLine:hover .loginOut {
    background: #ffffffc1;
    box-shadow: 0 15px 20px rgba(0, 0, 0, .1);
    transition: .3s;
    border-radius: 10px;
    /* 上行是方框四角变得圆润些 */
    backdrop-filter: blur(5px);
    -webkit-backdrop-filter: blur(5px);
  }

  .loginOut h2 {
    position: relative;
    top: 40px;
    left: 11px;
    margin-bottom: 10px;
    text-align: center;
    color: rgb(255, 255, 255);
    font-size: 40px;
    transition: .5s;
    animation: xty 10s linear infinite;
    transition-delay: 4s; /* 4秒的延迟 */
  }

  .loginOutLine:hover .loginOut h2 {
    top: 0;
    color: #000;
    font-size: 25px;
    transition: 0.3s;
    animation: xt 1s linear infinite;
  }

  .log-form {
    opacity: 0;
    transition: .5s;
    transition-delay: 4s; /* 4秒的延迟 */
  }

  .loginOutLine:hover .loginOut .log-form {
    opacity: 1;
    transition: 0.1s;
  }
}
@media (min-width: 0px) and (max-width:768px){
  .loginOutLine {
    display: flex;
    justify-content: center;

    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 700px;
  }

  .loginOut {
    opacity: 1;
    width: 400px;
    padding: 50px 15px;
    background: #ffffffc1;
    box-shadow: 0 15px 20px rgba(0, 0, 0, .1);
    border-radius: 10px;
    /* 上行是方框四角变得圆润些 */
    backdrop-filter: blur(5px);
    -webkit-backdrop-filter: blur(5px);
  }

  .loginOut h2 {
    position: relative;
    left: 11px;
    margin-bottom: 10px;
    text-align: center;
    top: 0;
    color: #000;
    font-size: 25px;
    animation: xt 1s linear infinite;
  }

  .log-form {
    opacity: 1;
  }

}



@keyframes xty {
  0% {
    text-shadow: 0 0 10px #fff;
  }
  25% {
    text-shadow: 0 0 10px #fff,
    0 0 20px #fff,
    0 0 40px #fff;
  }
  50% {
    text-shadow: 0 0 10px #fff,
    0 0 20px #fff,
    0 0 40px #fff,
    0 0 80px #fff;
  }
  75% {
    text-shadow: 0 0 10px #fff,
    0 0 20px #fff,
    0 0 40px #fff;
  }
  100% {
    text-shadow: 0 0 10px #fff;
  }
}

@keyframes xt {
  0% {
    text-shadow: 0 0 0px #fff;
  }
  100% {
    text-shadow: 0 0 0px #fff;
  }
}
</style>