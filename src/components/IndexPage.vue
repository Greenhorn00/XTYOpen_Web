<script >

import Aside from "@/components/Aside.vue";
import Header from "@/components/Header.vue";
import HeaderMobile from "@/components/HeaderMobile.vue";
import Music from "@/components/Music.vue";
export default {
  name:"IndexPage",
  components: {Music, HeaderMobile, Header, Aside},
  data(){
    return{
      isCollapse:true,
      isMobile: false, //手机端
      aside_width:'64px',//200px
      icon:"el-icon-s-unfold"
    }
  },
  mounted() {
    this.checkIfMobile();
    window.addEventListener('resize', this.checkIfMobile);
  },
  methods:{
    doCollapse(){
      console.log('收')

      this.isCollapse = !this.isCollapse
      if(!this.isCollapse){//展开
        this.aside_width='200px'
        this.icon="el-icon-s-fold"
      }else{//收起
        this.aside_width='64px'
        this.icon="el-icon-s-unfold"
      }
    },
    //检查手机
    checkIfMobile() {
      this.isMobile = window.innerWidth < 768; // Adjust the value based on your requirements
    },
  }
};
</script>

<template>
  <el-container style="height: 100%; border: 1px solid #eee; ">
    <el-aside width="aside_width" style="background-color: #777777; margin-left: -1px;" v-if="!this.isMobile" >
      <Aside :isCollapse="isCollapse"></Aside>
    </el-aside>

    <el-container style="height: 100%;">
      <Music></Music>
      <el-header v-if="!this.isMobile" style="text-align: right; font-size: 12px; height: 100%; background-color: #dadada; box-shadow: 0 0 5px #dadada, 0 0 10px #777777;">
        <Header @doCollapse = "doCollapse" :icon="icon"></Header>
      </el-header>
      <HeaderMobile v-if="this.isMobile" style="min-height: 60px;"></HeaderMobile>

      <el-main style="height: 100%;">
<!--        <Main></Main>-->
        <router-view/>
      </el-main>
    </el-container>
  </el-container>
</template>

<style scoped>
.el-header {
  //background-color: #8ea27a;
  color: #333;
  line-height: 60px;
}
.el-main{
  padding: 5px;
}

.el-aside {
  color: #333;
}
</style>