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
      thirdLoading: false,
      confirm_disabled: false,
      centerDialogVisible: false,
      haveUser: false,
      isMobile: false,
      haveUserIs:'',
      code:'',
      typeLog:'',
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
            if (res.code == 200) {

              this.$notify({
                title: res.data.user.name,
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
              this.$router.replace('/Home')
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
                title: res.data.user.name,
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
    thirdLog(){
      if(!this.code||this.code===''||this.code==null||this.code==="null") return;
      this.$axios.get(this.$httpUrl + '/user/thirdLog?type='+ this.typeLog +'&code=' + this.code).then(res => res.data).then(res => {
        if (res.code === 200) {
          this.$notify({
            title: res.data.user.name,
            message: '欢迎回家',
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
          // 直接在下一行调用 replace 方法
          let currentUrl = window.location.href;
          // 移除参数部分，即问号及其后面的内容
          let index = currentUrl.indexOf('?');
          if (index !== -1) {
            currentUrl = currentUrl.slice(0, index);
          }
          window.location.href = currentUrl + '#/Index';
        } else {
          this.loading=false;
          this.confirm_disabled = false;
          this.$message({
            showClose: true,
            message: '状态错误',
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
    },
    thirdClick(type){
      this.thirdLoading = true;
      this.$axios.get(this.$httpUrl + '/user/thirdLogin?type=' + type).then(res => res.data).then(res => {
        window.open(res, '_blank');
        this.thirdLoading = false;
      })
    }

  },
  mounted() {
    this.checkIfMobile();
    window.addEventListener('resize', this.checkIfMobile);

    const urlParams = new URLSearchParams(window.location.search);
    this.code = urlParams.get('code');
    this.typeLog = urlParams.get('type');
    if(this.code&&this.code!=='null'&&this.code!==''){
      this.thirdLog();
    }
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.checkIfMobile);
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
  <div style="background-color: #333333;">
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
                <el-avatar :size="100" :src="(this.haveUser) ? this.haveUserIs.avatar : '#'">
                  {{ (this.haveUser) ? this.haveUserIs.name : "未登录" }}
                </el-avatar>
                <span style="font-size: large;">{{  (this.haveUser) ? this.haveUserIs.name : "未登录"}}</span>
              </div>
            </el-col>
          </el-form-item>
          <div v-if="!this.haveUser" style="margin: 20px 0;">
            <el-form-item label="" prop="no">
              <el-col style="text-align: center;">
                <el-input
                    v-model="loginForm.no"
                    clearable
                    placeholder="账号"
                    type="text" style="width: 85%;">
                </el-input>
              </el-col>
            </el-form-item>
            <el-form-item label="" prop="password">
              <el-col style="text-align: center;">
                <el-input
                    v-model="loginForm.password"
                    clearable
                    placeholder="密码"
                    show-password
                    type="password" style="width: 85%;"
                    @keyup.enter.native="confirm">
                </el-input>
              </el-col>
            </el-form-item>
          </div>
          <el-form-item style="display: flex;justify-content: center;">
            <el-col style="display: flex; justify-content: space-between;width: 330px;">
              <el-button style="width: 30%; margin-top: 5px; font-size: large;"
                         @click="add"
                         v-if="!this.haveUser"> 注册
              </el-button>
              <el-button style="width: 30%; margin-top: 5px; font-size: large;"
                         @click="haveUser=false;"
                         v-if="this.haveUser"> 切换
              </el-button>
              <el-button :disabled="confirm_disabled" :loading="loading" style="width: 70%; margin-top: 5px; font-size: large;" type="primary"
                         @click="confirm">{{loading?"":(haveUser? "继续" : "登陆") }}
              </el-button>
            </el-col>
          </el-form-item>
<!--          <div style="width: 100%;display: flex; justify-content: center;">
            <div id="g_id_signin" class="g_id_signin"></div>
          </div>-->
          <el-divider ></el-divider>
          <div style="display: flex;justify-content: center;" v-loading="thirdLoading">
            <div style="cursor: pointer;margin-right: 50px;" @click="thirdClick('qq')" >
              <svg t="1710314148152" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4297" width="35" height="35"><path d="M511.09761 957.257c-80.159 0-153.737-25.019-201.11-62.386-24.057 6.702-54.831 17.489-74.252 30.864-16.617 11.439-14.546 23.106-11.55 27.816 13.15 20.689 225.583 13.211 286.912 6.767v-3.061z" fill="#FAAD08" p-id="4298"></path><path d="M496.65061 957.257c80.157 0 153.737-25.019 201.11-62.386 24.057 6.702 54.83 17.489 74.253 30.864 16.616 11.439 14.543 23.106 11.55 27.816-13.15 20.689-225.584 13.211-286.914 6.767v-3.061z" fill="#FAAD08" p-id="4299"></path><path d="M497.12861 474.524c131.934-0.876 237.669-25.783 273.497-35.34 8.541-2.28 13.11-6.364 13.11-6.364 0.03-1.172 0.542-20.952 0.542-31.155C784.27761 229.833 701.12561 57.173 496.64061 57.162 292.15661 57.173 209.00061 229.832 209.00061 401.665c0 10.203 0.516 29.983 0.547 31.155 0 0 3.717 3.821 10.529 5.67 33.078 8.98 140.803 35.139 276.08 36.034h0.972z" fill="#000000" p-id="4300"></path><path d="M860.28261 619.782c-8.12-26.086-19.204-56.506-30.427-85.72 0 0-6.456-0.795-9.718 0.148-100.71 29.205-222.773 47.818-315.792 46.695h-0.962C410.88561 582.017 289.65061 563.617 189.27961 534.698 185.44461 533.595 177.87261 534.063 177.87261 534.063 166.64961 563.276 155.56661 593.696 147.44761 619.782 108.72961 744.168 121.27261 795.644 130.82461 796.798c20.496 2.474 79.78-93.637 79.78-93.637 0 97.66 88.324 247.617 290.576 248.996a718.01 718.01 0 0 1 5.367 0C708.80161 950.778 797.12261 800.822 797.12261 703.162c0 0 59.284 96.111 79.783 93.637 9.55-1.154 22.093-52.63-16.623-177.017" fill="#000000" p-id="4301"></path><path d="M434.38261 316.917c-27.9 1.24-51.745-30.106-53.24-69.956-1.518-39.877 19.858-73.207 47.764-74.454 27.875-1.224 51.703 30.109 53.218 69.974 1.527 39.877-19.853 73.2-47.742 74.436m206.67-69.956c-1.494 39.85-25.34 71.194-53.24 69.956-27.888-1.238-49.269-34.559-47.742-74.435 1.513-39.868 25.341-71.201 53.216-69.974 27.909 1.247 49.285 34.576 47.767 74.453" fill="#FFFFFF" p-id="4302"></path><path d="M683.94261 368.627c-7.323-17.609-81.062-37.227-172.353-37.227h-0.98c-91.29 0-165.031 19.618-172.352 37.227a6.244 6.244 0 0 0-0.535 2.505c0 1.269 0.393 2.414 1.006 3.386 6.168 9.765 88.054 58.018 171.882 58.018h0.98c83.827 0 165.71-48.25 171.881-58.016a6.352 6.352 0 0 0 1.002-3.395c0-0.897-0.2-1.736-0.531-2.498" fill="#FAAD08" p-id="4303"></path><path d="M467.63161 256.377c1.26 15.886-7.377 30-19.266 31.542-11.907 1.544-22.569-10.083-23.836-25.978-1.243-15.895 7.381-30.008 19.25-31.538 11.927-1.549 22.607 10.088 23.852 25.974m73.097 7.935c2.533-4.118 19.827-25.77 55.62-17.886 9.401 2.07 13.75 5.116 14.668 6.316 1.355 1.77 1.726 4.29 0.352 7.684-2.722 6.725-8.338 6.542-11.454 5.226-2.01-0.85-26.94-15.889-49.905 6.553-1.579 1.545-4.405 2.074-7.085 0.242-2.678-1.834-3.786-5.553-2.196-8.135" fill="#000000" p-id="4304"></path><path d="M504.33261 584.495h-0.967c-63.568 0.752-140.646-7.504-215.286-21.92-6.391 36.262-10.25 81.838-6.936 136.196 8.37 137.384 91.62 223.736 220.118 224.996H506.48461c128.498-1.26 211.748-87.612 220.12-224.996 3.314-54.362-0.547-99.938-6.94-136.203-74.654 14.423-151.745 22.684-215.332 21.927" fill="#FFFFFF" p-id="4305"></path><path d="M323.27461 577.016v137.468s64.957 12.705 130.031 3.91V591.59c-41.225-2.262-85.688-7.304-130.031-14.574" fill="#EB1C26" p-id="4306"></path><path d="M788.09761 432.536s-121.98 40.387-283.743 41.539h-0.962c-161.497-1.147-283.328-41.401-283.744-41.539l-40.854 106.952c102.186 32.31 228.837 53.135 324.598 51.926l0.96-0.002c95.768 1.216 222.4-19.61 324.6-51.924l-40.855-106.952z" fill="#EB1C26" p-id="4307"></path></svg></div>
            <div style="cursor: pointer;margin-right: 50px;" @click="thirdClick('wx')" >
              <svg t="1710314464215" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="6203" width="35" height="35"><path d="M683.058 364.695c11 0 22 1.016 32.943 1.976C686.564 230.064 538.896 128 370.681 128c-188.104 0.66-342.237 127.793-342.237 289.226 0 93.068 51.379 169.827 136.725 229.256L130.72 748.43l119.796-59.368c42.918 8.395 77.37 16.79 119.742 16.79 11 0 21.46-0.48 31.914-1.442a259.168 259.168 0 0 1-10.455-71.358c0.485-148.002 128.744-268.297 291.403-268.297l-0.06-0.06z m-184.113-91.992c25.99 0 42.913 16.79 42.913 42.575 0 25.188-16.923 42.579-42.913 42.579-25.45 0-51.38-16.85-51.38-42.58 0-25.784 25.93-42.574 51.38-42.574z m-239.544 85.154c-25.384 0-51.374-16.85-51.374-42.58 0-25.784 25.99-42.574 51.374-42.574 25.45 0 42.918 16.79 42.918 42.575 0 25.188-16.924 42.579-42.918 42.579z m736.155 271.655c0-135.647-136.725-246.527-290.983-246.527-162.655 0-290.918 110.88-290.918 246.527 0 136.128 128.263 246.587 290.918 246.587 33.972 0 68.423-8.395 102.818-16.85l93.809 50.973-25.93-84.677c68.907-51.93 120.286-119.815 120.286-196.033z m-385.275-42.58c-16.923 0-34.452-16.79-34.452-34.179 0-16.79 17.529-34.18 34.452-34.18 25.99 0 42.918 16.85 42.918 34.18 0 17.39-16.928 34.18-42.918 34.18z m188.165 0c-16.984 0-33.972-16.79-33.972-34.179 0-16.79 16.927-34.18 33.972-34.18 25.93 0 42.913 16.85 42.913 34.18 0 17.39-16.983 34.18-42.913 34.18z" fill="#09BB07" p-id="6204"></path></svg>
            </div>
            <div style="cursor: pointer;" @click="thirdClick('github')" >
              <svg t="1710322704778" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3979" width="35" height="35"><path d="M511.957333 21.333333C241.024 21.333333 21.333333 240.981333 21.333333 512c0 216.832 140.544 400.725333 335.573334 465.664 24.490667 4.394667 32.256-10.069333 32.256-23.082667 0-11.690667 0.256-44.245333 0-85.205333-136.448 29.610667-164.736-64.64-164.736-64.64-22.314667-56.704-54.4-71.765333-54.4-71.765333-44.586667-30.464 3.285333-29.824 3.285333-29.824 49.194667 3.413333 75.178667 50.517333 75.178667 50.517333 43.776 75.008 114.816 53.333333 142.762666 40.789333 4.522667-31.658667 17.152-53.376 31.189334-65.536-108.970667-12.458667-223.488-54.485333-223.488-242.602666 0-53.546667 19.114667-97.322667 50.517333-131.669334-5.034667-12.330667-21.930667-62.293333 4.778667-129.834666 0 0 41.258667-13.184 134.912 50.346666a469.802667 469.802667 0 0 1 122.88-16.554666c41.642667 0.213333 83.626667 5.632 122.88 16.554666 93.653333-63.488 134.784-50.346667 134.784-50.346666 26.752 67.541333 9.898667 117.504 4.864 129.834666 31.402667 34.346667 50.474667 78.122667 50.474666 131.669334 0 188.586667-114.730667 230.016-224.042666 242.090666 17.578667 15.232 33.578667 44.672 33.578666 90.453334v135.850666c0 13.141333 7.936 27.605333 32.853334 22.869334C862.250667 912.597333 1002.666667 728.746667 1002.666667 512 1002.666667 240.981333 783.018667 21.333333 511.957333 21.333333z" p-id="3980"></path></svg>
            </div>

          </div>

        </el-form>
      </div>
    </div>

    <!--    以下根据是否为手机选择切换背景为MP4还是GIF格式-->
    <div class="video-container" v-if="!isMobile">
      <video ref="videoRef" autoplay class="video" loop muted>
        <source src="../assets/video/grassland.mp4" type="video/mp4"/>
      </video>
    </div>
    <div class="MobileBack" v-if="isMobile">
      <!--      gif全屏图-->
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
/deep/ .el-divider--horizontal{
  margin: 10px 0 15px 0;
}

.MobileBack{
  z-index: -100;
  position: fixed;
  background-image: url("../assets/video/ingame.gif");
  background-size: cover;
  background-position: center;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.video-container {
  z-index: -100;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background-color: #333333;
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
    width: 400px;
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
    top: 1.5em;
    margin-bottom: 10px;
    text-align: center;
    color: rgb(255, 255, 255);
    font-size: 60px;
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