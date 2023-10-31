<!-- eslint-disable vue/multi-word-component-names -->

<script>
export default {
  name: "Aside",
  data() {
    return {

    }
  },
  computed:{ //创建时执行（有计算时用）
    "menu":{ //取出
      get (){
        return this.$store.state.menu //取出
      }
    }
  },
  props: { //props 上级可获取
    isCollapse: Boolean
  },
  methods: {
    logOut() {
      console.log('退出')
      this.$confirm('要退出了吗', '提示', {
        confirmButtonText: "好的",
        type: 'warning',
        center: true,
        closeOnClickModal: true
      }).then(() => {
        this.$notify({
          title: JSON.parse(sessionStorage.getItem('CurUser')).name,
          message: '您已退出登陆',
        });
        this.$router.replace('/')
        sessionStorage.clear()
      }).catch(() => {

      })
    },
  }
};
</script>

<template>
  <el-menu
      :collapse="isCollapse"
      active-text-color="#ffd04b"
      background-color="#545c64"
      class="el-menu-vertical-demo"
      default-active="/Home"
      router
      style="height: 100%; min-height: 100vh; "
      text-color="#fff">
    <el-menu-item index="/Home">
      <i class="el-icon-s-home"></i>
      <span slot="title">首页</span>
      <!--      slot="title"收缩时鼠标悬停显示这个标题-->
    </el-menu-item>
    <!--动态菜单-->
    <el-menu-item v-for="(item,i) in menu" :key="i"
                  :index="'/' + item.menuClick">
      <i :class="item.menuIcon"></i>
      <span slot="title">{{ item.menuName }}</span>
    </el-menu-item>

    <el-menu-item index="/Chat">
      <i class="el-icon-chat-line-round"></i>
      <span slot="title">聊天室</span>
    </el-menu-item>

    <el-menu-item index="/UserHome">
      <i class="el-icon-s-custom"></i>
      <span slot="title">个人中心</span>
    </el-menu-item>

<!--    <el-submenu index="/Set">
      <template slot="title"><i class="el-icon-setting"></i><span>设置</span></template>
      <el-menu-item-group>
        <el-menu-item index="Set-1">选项1</el-menu-item>
        <el-menu-item index="Set-2">选项2</el-menu-item>
      </el-menu-item-group>
    </el-submenu>-->

    <el-menu-item @click="logOut">
      <i class="el-icon-switch-button"></i>
      <span slot="title">退出登陆</span>
    </el-menu-item>
  </el-menu>
</template>
<!--文字动画关键-->
<style scoped>
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  min-height: 400px;
}
</style>