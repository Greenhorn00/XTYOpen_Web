<script >

import Aside from "@/components/Aside.vue";
import Header from "@/components/Header.vue";

export default {
  name:"IndexPage",
  components: {Header, Aside},
  data(){
    return{
      isCollapse:true,
      aside_width:'64px',//200px
      icon:"el-icon-s-unfold"
    }
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
    }
  }
};
</script>

<template>
  <el-container style="height: 100%; border: 1px solid #eee; ">
    <el-aside width="aside_width" style="background-color: rgb(238, 241, 246); margin-left: -1px">
      <Aside :isCollapse="isCollapse"></Aside>
    </el-aside>

    <el-container style="height: 100%;">
      <el-header style="text-align: right; font-size: 12px; height: 100%; background-color: #dadada; box-shadow: 0 0 5px #dadada, 0 0 10px #777777;">
        <Header @doCollapse = "doCollapse" :icon="icon"></Header>
      </el-header>

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