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
      haveUser: false,
      isMobile: false,
      haveUserIs:'',
      GoogleId: "903775319941-h0b8q3qvip0b7t6dubfa6ir9pqd65r6c.apps.googleusercontent.com",
      httpsBack: this.$httpUrl,
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
              }).catch(error => {
            // 在请求失败或超时时执行的操作
            console.log(error);
            this.loading = false;
            this.confirm_disabled = false;
            this.$message({
              showClose: true,
              message: '请求失败或超时，请重试',
              type: 'error',
            });
            this.$alert('<a href="'+ this.httpsBack + '/user/hi" target="_blank"> 点此授权访问 以使用此网站</a>', '抱歉`(*>﹏<*)′需要您的授权', {
              dangerouslyUseHTMLString: true,
              confirmButtonText: '好的，我已点击',
            });
          });
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
        if (valid) {
          this.loading=true;
          this.$axios.post(this.$httpUrl + '/user/login', this.loginForm).then(res => res.data).then(res => {
            console.log(res)
            if (res.code == 200) {

              this.$notify({
                title: '欢迎' + res.data.user.name,
                message: '欢迎回来',
                type: 'success'
              });
              // 储存
              sessionStorage.setItem("CurUser", JSON.stringify(res.data.user));
              this.$store.commit("setMenu", res.data.menu); // 设置传来路由
              // 以对象的形式保存账号密码
              const user = {
                no: res.data.user.no,
                password: res.data.user.password,
                name: res.data.user.name,
                avatar: res.data.user.avatar
              };
              localStorage.setItem("userLogIn", JSON.stringify(user));//记住密码
              this.loading=false;
              //跳转
              this.$router.replace('/Index')
            } else {
              this.loading=false;
              this.confirm_disabled = false;
              this.$message({
                showClose: true,
                message: '账号或密码错误',
                type: 'error',
              });
            }
          }).catch(error => {
            // 在请求失败或超时时执行的操作
            console.log(error);
            this.loading = false;
            this.confirm_disabled = false;
            this.$message({
              showClose: true,
              message: '请求失败或超时，请重试',
              type: 'error',
            });
            this.$alert(' <a href="'+ this.httpsBack + '/user/hi" target="_blank"> <img src="'+ require('../assets/img/help.png') +'" alt="" style="width: 100%;height:100%; display:block; margin: 10px 0;"> <button style="width: 100%;height: 50px; font-size: large;">前往授权此网站</button></a>', '抱歉`(*>﹏<*)′需要您的授权', {
              dangerouslyUseHTMLString: true,
              confirmButtonText: '好的，我已点击',
            });
          });
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
    callback(googleUser) {
      var tokens = googleUser.credential.split(".");
      var payload = JSON.parse(atob(tokens[1]));
      console.log(`user id ${payload.sub}`)
      console.log(`user name ${payload.name}`)
      console.log(`user picture ${payload.picture}`)
      console.log(`user email ${payload.email}`)
      this.$axios.post(this.$httpUrl + '/user/loginWithGoogle', {
        id: '',
        no: payload.sub.substr(0, 9),
        name: payload.name,
        password: '123',
        age: 18,
        sex: 0,
        phone: payload.email.substr(0, 17),
        roleId: '2',
        isvalid: 'Y',
        level: '0',
        avatar: payload.picture
      }).then(res => res.data)
          .then(res => {
            if (res.code == 200) {

              this.$notify({
                title: '欢迎' + res.data.user.name,
                message: '欢迎回来',
                type: 'success'
              });
              // 储存
              sessionStorage.setItem("CurUser", JSON.stringify(res.data.user))
              this.$store.commit("setMenu", res.data.menu) // 设置传来路由

              console.log(res.data.menu)
              //跳转
              this.$router.replace('/Index')

            } else {
              this.confirm_disabled = false;
              this.$message({
                showClose: true,
                message: '账号或密码错误',
                type: 'error',
              });
            }
          }).catch(error => {
        // 在请求失败或超时时执行的操作
        console.log(error);
        this.confirm_disabled = false;
        this.$message({
          showClose: true,
          message: '请求失败或超时，请重试',
          type: 'error',
        });
        this.$alert('<a href="'+ this.httpsBack + '/user/hi" target="_blank"> 前往授权访问以使用此网站</a>', '抱歉`(*>﹏<*)′需要您的授权', {
          dangerouslyUseHTMLString: true,
          confirmButtonText: '好的，我已点击',
        });
      });
    },
    checkIfMobile() {
      this.isMobile = window.innerWidth < 768; // Adjust the value based on your requirements
    },

  },
  mounted() {
    this.updateVideoSize();
    window.addEventListener('resize', this.updateVideoSize);
    this.checkIfMobile();
    window.addEventListener('resize', this.checkIfMobile);
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.updateVideoSize);
  },
  created() {
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    document.body.appendChild(script);

    window.addEventListener("load", () => {
      window.google.accounts.id.initialize({
        // 主要就是填写client_id
        client_id: this.GoogleId,
        auto_select: false,
        callback: this.callback,
      });
      // 设置按钮的样式等
      window.google.accounts.id.renderButton(
          document.getElementById("g_id_signin"),
          {
            size: "large",
            type: "standard",
            text: "signin_with",
          }
      );
    });
    let userLogIn = localStorage.getItem("userLogIn");
    if(userLogIn){
      userLogIn = JSON.parse(userLogIn);
      this.loginForm.no=userLogIn.no;
      this.loginForm.password=userLogIn.password;
      this.haveUserIs = {
        avatar: userLogIn.avatar,
        name: userLogIn.name,
      };
      this.haveUser = true;
    }
  }
};
</script>

<template>
  <div>
    <div class="loginOutLine">
      <div class="loginOut">
        <h2 class="login-title">XTYOpen</h2>
        <el-form ref="loginForm"
                 :model="loginForm"
                 :rules="rules"
                 class="log-form"
                 style=" margin-top: 20px;">
          <el-form-item v-if="this.haveUser">
            <el-col>
              <div style="margin-top: 1em; width: 100%; text-align: center; display: flex;flex-direction: column;justify-content: center;align-items: center;">
                <el-avatar :size="90" :src="(this.haveUser) ? this.haveUserIs.avatar : '#'">
                  {{ (this.haveUser) ? this.haveUserIs.name : "未登录" }}
                </el-avatar>
                <span style="font-size: large;">{{  (this.haveUser) ? this.haveUserIs.name : "未登录"}}</span>
              </div>
            </el-col>
          </el-form-item>
          <div v-if="!this.haveUser">
            <el-form-item label="" prop="no">
              <el-col >
                <el-input
                    v-model="loginForm.no"
                    clearable
                    placeholder="账号"
                    type="text">
                </el-input>
              </el-col>
            </el-form-item>
            <el-form-item label="" prop="password">
              <el-col >
                <el-input
                    v-model="loginForm.password"
                    clearable
                    placeholder="密码"
                    show-password
                    type="password" @keyup.enter.native="confirm">
                </el-input>
              </el-col>
            </el-form-item>
          </div>
          <el-form-item>
            <el-col style="display: flex; justify-content: space-between;">
              <el-button style="width: 30%; margin-top: 5px; font-size: large;"
                         @click="add"
                         v-if="!this.haveUser"> 注册
              </el-button>
              <el-button style="width: 30%; margin-top: 5px; font-size: large;"
                         @click="haveUser=false;"
                         v-if="this.haveUser"> 切换
              </el-button>
              <el-button :disabled="confirm_disabled" :loading="loading" style="width: 70%; margin-top: 5px; font-size: large;" type="primary"
                         @click="confirm"> 登陆
              </el-button>
            </el-col>
          </el-form-item>
          <div style="width: 100%;display: flex; justify-content: center;">
            <div id="g_id_signin" class="g_id_signin"></div>
          </div>

        </el-form>
      </div>
    </div>

    <div class="video-container">
      <video ref="videoRef" autoplay class="video" loop muted>
        <source src="../assets/video/back.mp4" type="video/mp4"/>
      </video>
    </div>

    <el-dialog
        :before-close="handleClose"
        :visible.sync="centerDialogVisible"
        :fullscreen=isMobile
        center
        title="- 新朋友 -"
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
        <el-button :loading="loading" type="primary" @click="save">{{ loading ? '提交中 ...' : '注 册' }}</el-button>
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

@media (min-width: 768px) {
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
    width: 325px;
    padding: 50px 15px 25px 15px;
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

@media (min-width: 0px) and (max-width: 768px) {
  .loginOutLine {
    display: flex;
    justify-content: center;
    width: 90%;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  .loginOut {
    opacity: 1;
    width: 100%;
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