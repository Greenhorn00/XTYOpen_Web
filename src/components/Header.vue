<!-- eslint-disable vue/multi-word-component-names -->
<script>
export default {
  name: "Header",
  data() {
    return {
      greetingMessage: "", // 存储问候消息的变量
      greetingMessages: {
        morning: ["早上好", "早安", "嘿 这么早"],
        afternoon: ["下午好", "你好", "中午好"],
        evening: ["晚上好", "晚安", "记得休息"]
      },
      user: JSON.parse(sessionStorage.getItem('CurUser')),
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
      this.$emit('doCollapse')
    },
    setGreetingMessage() {
      const now = new Date();
      const hour = now.getHours();
      if (hour >= 5 && hour < 12) {
        // 早上
        this.greetingMessage = this.greetingMessages.morning[
            Math.floor(Math.random() * this.greetingMessages.morning.length)] + ',' + this.user.name;
      } else if (hour >= 12 && hour < 18) {
        // 下午
        this.greetingMessage = this.greetingMessages.afternoon[
            Math.floor(Math.random() * this.greetingMessages.afternoon.length)] + ',' + this.user.name;
      } else {
        // 晚上
        this.greetingMessage = this.greetingMessages.evening[
            Math.floor(Math.random() * this.greetingMessages.evening.length)] + ',' + this.user.name;
      }
    },
  },
  props: {
    icon: String
  },
};
</script>

<template>
  <div>
    <div style="display: flex;line-height: 50px;">
      <div style="position: relative;">
        <i :class="icon"
           style="font-size: 25px; position: absolute;top: 50%;transform: translateY(-50%); cursor: pointer"
           @click="collapse"></i>
      </div>
      <div style="position: relative; flex: 1; text-align: center; font-size: 20px; left: 60px;user-select: none;">
        <span>{{ greetingMessage }}</span>
      </div>
      <el-avatar :size="35" :src="this.user.avatar" shape="square"
                 style="margin-right: 12px; position: relative; top: 8px;">
        {{ this.user.name.charAt(0) }}
      </el-avatar>
      <el-dropdown>
        <span style="font-size: 16px; font-weight: bold">{{ this.user.name }}</span>
        <i class="el-icon-arrow-down" style="margin-left: 5px; margin-right: 10px;"></i>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item @click.native="toUser">个人中心</el-dropdown-item>
          <el-dropdown-item @click.native="logOut">退出</el-dropdown-item>
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