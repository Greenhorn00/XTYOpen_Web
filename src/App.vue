<template>
  <div id="app" ref="view">

    <router-view v-if="!devtoolsOpen"/>

<!--    提示已开启控制面板-->
    <el-dialog
        fullscreen
        center
        :visible.sync="devtoolsOpen"
        :before-close="refuse"
        >
      <el-result icon="info" :title="user?'你好，'+user.name:'你好，未登录者'" >
        <template slot="icon">
          <el-image style="width: 100px;" :src=imgSrc></el-image>
        </template>
        <template slot="extra">
          <div style="font-size: large;white-space: nowrap;">
            我们发现您<div style="display: inline; color: darkred;"> 正在使用控制台 </div> 这是不被允许的
            <div style="margin-top:5px;">如果您是网站开发人员 请输入开发密码</div>
          </div>
          <el-input
              v-model="devtoolsPass"
              clearable
              placeholder="开发密钥"
              show-password
              type="password" @keyup.enter.native="up"
              style="margin: 30px 0;">
          </el-input>
          <el-statistic :value="Date.now() + 1000 * 30" format="mm:ss:SSS" time-indices
                        v-if="devtoolsOpen"
                        @finish="refuse" suffix="后我们将关闭您的访问"
                        ref="statistic"
                        style="font-size: 20px;"
          >
          </el-statistic>
        </template>
      </el-result>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="up">我有密码，提交</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script >
//引入devtoolsDetector控制台监视
import * as devtoolsDetector from "devtools-detector";

export default {
  name: 'App',
  components: {
  },
  data(){
    return {
      user: JSON.parse(sessionStorage.getItem('CurUser')),

      devtoolsOpen:false,
      devtoolsPass:'',
      imgSrc:require('./assets/img/eye.gif'),
    }
  },
  watch:{//监视
    '$store.state.menu':{
      handler(val, old) {
        if(!old && this.user && this.user.no) {
          this.$store.commit("setMenu", val)
        }
      },
      immediate: true
    }
  },

  mounted() {
    // 创建一个 div 元素，并将其添加到页面中
    const view = document.createElement('div');
    this.$refs.view.appendChild(view);

    // 监听开发者工具打开事件，如果开发者工具被打开，则重定向到 about:blank 页面
    devtoolsDetector.addListener(isOpen => {
      if (isOpen) {
        this.user=JSON.parse(sessionStorage.getItem('CurUser'));
        this.devtoolsOpen=true;
      }
    });
    // 启动开发者工具检测器
    devtoolsDetector.launch();
  },
  methods:{
    refuse(){//未通过，跳转其他页面
      sessionStorage.clear()
      document.location.replace('about:blank');
    },
    up(){//发送通过密码以取消控制台限制
      this.$axios.post(this.$httpUrl + '/user/test?id=' + this.devtoolsPass,this.user?this.user:{
        no:'未登录用户'
      }).then(res => res.data).then(res => {
        if (res.code === 200) {
          this.$refs.statistic.suspend(true);//暂停计时
          this.devtoolsOpen=false;//关闭弹窗
          devtoolsDetector.stop();//关闭控制台检测
          sessionStorage.setItem("isClear", "Yes");
        } else {
          this.refuse();
        }
      }).catch(error => {
        console.log(error)
        this.refuse();
      });
    }
  }
}
</script>

<style>
#app {
    height: 100%;
}
</style>
