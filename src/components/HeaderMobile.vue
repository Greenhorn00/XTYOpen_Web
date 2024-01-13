<!-- eslint-disable vue/multi-word-component-names -->
<script>
export default {
  name: "HeaderMobile",
  data() {
    return {

    }
  },
  created() {
    // this.$router.push("/Home");
  },
  computed:{ //创建时执行（有计算时用）
    "menu":{ //取出
      get (){
        return this.$store.state.menu //取出
      }
    }
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
          title: this.user.name,
          message: '您已退出登陆',
        });
        this.$router.replace('/')
        sessionStorage.clear()
      }).catch(() => {

      })
    },

  },
};
</script>

<template>
  <div>
    <el-menu
        default-active="/Home"
        router
        class="el-menu-demo"
        mode="horizontal"
        style="text-align: center;">
      <el-menu-item index="/Home">
        <i class="el-icon-s-home"></i>
        <span slot="title">首页</span>
      </el-menu-item>
      <el-menu-item index="/UserHome">
        <i class="el-icon-s-custom"></i>
        <span slot="title">个人中心</span>
      </el-menu-item>
      <el-submenu >
        <template slot="title"><i class="el-icon-help"></i><span>更多</span></template>
        <el-menu-item-group>
          <el-menu-item index="/Chat">
            <i class="el-icon-chat-line-round"></i>
            <span slot="title">聊天室</span>
          </el-menu-item>
          <!--动态菜单-->
          <el-menu-item v-for="(item,i) in menu" :key="i"
                        :index="'/' + item.menuClick">
            <i :class="item.menuIcon"></i>
            <span slot="title">{{ item.menuName }}</span>
          </el-menu-item>
        </el-menu-item-group>
      </el-submenu>
    </el-menu>
  </div>
</template>

<style scoped>
.el-menu-demo{
  position: sticky;
  top: 0;
  z-index: 1000; /* 根据实际情况调整 z-index */
}
</style>