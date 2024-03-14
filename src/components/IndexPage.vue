<script >

import Header from "@/components/Header.vue";
import HeaderMobile from "@/components/HeaderMobile.vue";
import Music from "@/components/Music.vue";
export default {
  name:"IndexPage",
  components: {Music, HeaderMobile, Header},
  data(){
    return{
      isCollapse:true,
      isMobile: false, //手机端
      aside_width:'64px',//200px
      icon:"el-icon-s-unfold",
      headerClass:"top",
    }
  },
  mounted() {
    this.checkIfMobile();
    window.addEventListener('resize', this.checkIfMobile);
    window.addEventListener('scroll', this.topClass);
  },
  destroyed() {
    window.removeEventListener('scroll', this.topClass);
    window.removeEventListener('resize', this.checkIfMobile);
  },
  methods:{
    topClass(){
      if (window.scrollY < 100) this.headerClass = "";
      else this.headerClass = "top"
    },
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
      this.isMobile = window.innerWidth < 800; // Adjust the value based on your requirements
    },
  }
};
</script>

<template>
  <el-container style="height: 100%; border: 1px solid #eee; ">
<!--    <el-aside width="aside_width" style="background-color: #777777; margin-left: -1px;" v-if="!this.isMobile" >-->
<!--      <Aside :isCollapse="isCollapse"></Aside>-->
<!--    </el-aside>-->

    <Music></Music>

    <el-container style="height: 100%;">
      <el-header v-if="!this.isMobile" style="text-align: right; font-size: 12px; height: 100%;">
        <Header :class="headerClass" ></Header>
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
.top{
  position: fixed;left: 0;top: 0;  z-index: 10;width: 100%;
  background-color: rgba(255, 255, 255, 0.8);
}
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