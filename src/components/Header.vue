<!-- eslint-disable vue/multi-word-component-names -->
<script>
export default {
  name: "Header",
  data() {
    return {
      greetingMessage: "", // 存储问候消息的变量
      greetingMessages: {
        morning: ["早喔", "早上好喔", "嘿 这么早"],
        afternoon: ["午睡了嘛", "元气满满", "中午好"],
        evening: ["吃点好的", "睡个好觉", "记得休息"]
      },
      user: JSON.parse(sessionStorage.getItem('CurUser')),
      menuFont:true,
      icon:"el-icon-s-fold",
    }
  },
  created() {
    this.$router.push("/Home");
    this.setGreetingMessage(); // 在组件创建时设置问候消息
    setInterval(this.setGreetingMessage, 3600000); // 每小时更新一次问候消息
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
      // this.$emit('doCollapse')
      this.menuFont = !this.menuFont;
      if (!this.menuFont) this.icon="el-icon-s-unfold";
      else this.icon = "el-icon-s-fold";
    },
    setGreetingMessage() {
      const now = new Date();
      const hour = now.getHours();
      if (hour >= 5 && hour < 12) {
        // 早上
        this.greetingMessage = this.greetingMessages.morning[
            Math.floor(Math.random() * this.greetingMessages.morning.length)] + '，' + this.user.name;
      } else if (hour >= 12 && hour < 18) {
        // 下午
        this.greetingMessage = this.greetingMessages.afternoon[
            Math.floor(Math.random() * this.greetingMessages.afternoon.length)] + '，' + this.user.name;
      } else {
        // 晚上
        this.greetingMessage = this.greetingMessages.evening[
            Math.floor(Math.random() * this.greetingMessages.evening.length)] + '，' + this.user.name;
      }
    },
  },
  computed:{ //创建时执行（有计算时用）
    "menu":{ //取出
      get (){
        return this.$store.state.menu //取出
      }
    }
  },
};
</script>

<template>
  <div>
    <div style="display: flex;line-height: 50px; align-items: center;">
      <div style="position: relative;">
        <el-menu
            class="el-menu-vertical-demo"
            default-active="/Home"
            background-color="transparent"
            mode="horizontal"
            router>
          <el-menu-item>
            <i :class="icon"
               style="font-size: 25px; cursor: pointer;"
               @click="collapse"></i>
          </el-menu-item>
          <el-menu-item index="/Home">
            <i class="el-icon-s-home"></i>
            <span v-if="menuFont" slot="title">首页</span>
            <!--      slot="title"收缩时鼠标悬停显示这个标题-->
          </el-menu-item>
          <!--动态菜单-->
          <el-menu-item v-for="(item,i) in menu" :key="i"
                        :index="'/' + item.menuClick">
            <i :class="item.menuIcon"></i>
            <span v-if="menuFont" slot="title">{{ item.menuName }}</span>
          </el-menu-item>

          <el-menu-item index="/Chat">
            <i class="el-icon-chat-line-round"></i>
            <span v-if="menuFont" slot="title">聊天</span>
          </el-menu-item>

          <el-menu-item index="/UserHome">
            <i class="el-icon-s-custom"></i>
            <span v-if="menuFont" slot="title">个人中心</span>
          </el-menu-item>
        </el-menu>
      </div>
      <div style="flex: 1; text-align: center; font-size: large;user-select: none;overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
        <span>{{ greetingMessage }}</span>
      </div>
      <el-avatar :size="35" :src="this.user.avatar" shape="square"
                 style="margin-right: 12px;">
        {{ this.user.name.charAt(0) }}
      </el-avatar>
      <el-dropdown>
        <span style="font-size: 16px; font-weight: bold">{{ this.user.name }}</span>
        <i class="el-icon-arrow-down" style="margin-left: 5px; margin-right: 10px;"></i>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item @click.native="toUser">个人中心</el-dropdown-item>
          <el-dropdown-item @click.native="logOut">退出登陆</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>

  </div>
</template>

<style scoped>
* {
  user-select: none;
  ::-webkit-scrollbar {
    /*隐藏滚轮*/
    display: none;
  }
}
</style>