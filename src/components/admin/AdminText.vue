<!-- eslint-disable vue/multi-word-component-names -->
<script>
export default {
  name: "AdminText",
  data() {
    return {
      isMobile: false, //手机端
      isVisible: false,
      pageSize: 12,
      pageNum: 1,
      user: '',
      text: '',
      tableData: [],
    }
  },
  methods: {
    loadPost() {
      this.$axios.post(this.$httpUrl + '/post/listPage', {
        pageSize: this.pageSize,
        pageNum: this.pageNum,
        param: {
          name: this.text
        }
      }).then(res => res.data).then(res => {
        if (res.code === 200) {
          if(res.data.length === 0){
            this.$message({
              showClose: true,
              message: '没有更多啦',
              type: 'info'
            });
          }
          this.tableData = [...this.tableData, ...res.data];
        } else {
          alert('获取失败')
        }
      })
    },
    searchLoad(){
      this.tableData = [];
      this.pageNum = 1;
      this.loadPost();
    },
    autoLoad(){
      this.pageNum += 1;
      this.loadPost();
    },
    restParam() {
      this.text = '';
      this.tableData = [];
      this.pageNum = 1;
      this.loadPost();
    },
    del(id) {
      this.$confirm('确认删除这条帖子吗？')
          .then(() => {
            this.$axios.get(this.$httpUrl + '/post/delete?id=' + id).then(res => res.data)
                .then(res => {
                  if (res.code === 200) {
                    this.$message({
                      showClose: true,
                      message: '删除成功',
                      type: 'success',
                    });
                    this.loadPost();
                  } else {
                    this.$message({
                      showClose: true,
                      message: '服务器开小差啦~请稍后重试',
                      type: 'error'
                    });
                  }
                })
          })
          .catch(() => {
          });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    delPost2(id){
      this.$confirm('确认删除这条评论吗？')
          .then(() => {
            this.$axios.get(this.$httpUrl + '/post2/delete?id=' + id).then(res => res.data)
                .then(res => {
                  if (res.code === 200) {
                    this.$message({
                      showClose: true,
                      message: '删除成功',
                      type: 'success',
                    });
                    this.loadPost();
                  } else {
                    this.$message({
                      showClose: true,
                      message: '服务器开小差啦~请稍后重试',
                      type: 'error'
                    });
                  }
                })
          })
          .catch(() => {
          });
    },

    //滚动到顶部
    handleScroll() {
      this.isVisible = window.scrollY > 100; // 设置一个阈值，当页面滚动超过100像素时显示按钮
    },
    scrollToTop() {
      window.scrollTo({
        top: 0,
        behavior: 'smooth' // 平滑滚动到顶部
      });
    },
    handleClose(done) {
      this.$confirm('确认关闭？您的信息不会保存')
          .then(() => {
            done();
          })
          .catch(() => {
          });
    },
    //检查手机
    checkIfMobile() {
      this.isMobile = window.innerWidth < 768; // Adjust the value based on your requirements
    },
  },
  beforeMount() {
    this.user = JSON.parse(sessionStorage.getItem('CurUser'));
    this.loadPost();
  },
  //滚动到顶部
  created() {
    window.addEventListener('scroll', this.handleScroll);
  },
  destroyed() {
    window.removeEventListener('scroll', this.handleScroll);
    window.removeEventListener('resize', this.checkIfMobile);
  },
  mounted() {
    this.checkIfMobile();
    window.addEventListener('resize', this.checkIfMobile);
  },
  filters: {
    truncate: function (text, length, clamp) {
      clamp = clamp || "...";
      length = length || 30;

      if (text.length <= length) {
        return text;
      } else {
        return text.substring(0, length) + clamp;
      }
    },
  },
}
</script>

<template>
  <div style="background-color: #dadada">

    <el-button v-if="isVisible" circle class="scroll-to-top" icon="el-icon-top" @click="scrollToTop"></el-button>

    <div style="display: flex;  flex-direction:column; justify-content: center; padding-top: 20px;">
      <div style="display: flex; justify-content: center;">
        <el-input
            v-model="text"
            clearable
            placeholder="查询帖子"
            style="width: 400px;"
            @keyup.enter.native="searchLoad"></el-input>

        <el-button circle icon="el-icon-search" style="margin-left: 10px;" @click="searchLoad"></el-button>
        <el-button circle icon="el-icon-refresh-left" type="info" @click="restParam"></el-button>
      </div>

      <div style="display: flex;flex-wrap: wrap; justify-content: center; align-items: stretch;  margin-top: 10px;">
        <el-card v-for="(item,i) in tableData" :key="i" class="box-card"
                 style="min-height: 600px;  margin: 20px;">
          <div slot="header" style="display: flex; align-items: center; justify-content: space-between;">
            <div>
              <el-avatar :size="40" :src="item.post.avatar" style="margin: 0px 10px;">{{ item.post.userno.charAt(0) }}</el-avatar>
              <span v-if="!isMobile" style="position: relative; top: -12px;">{{ item.post.userno }}</span>
            </div>

            <div style="position: relative; left: -25px;">
              <span style="font-weight: 10; font-size: 16px; color: #777777">{{ item.post.id }}.</span>
              <span class="text2" style="padding-left: 10px;">{{ item.post.title }}</span>
            </div>

            <div style="font-weight: 10; font-size: 16px; position: relative; top: -5px;">
              {{ new Date(item.post.time).getMonth() + 1 }}/{{ new Date(item.post.time).getDate() }} <br>
              {{ new Date(item.post.time).getHours() }}:{{ new Date(item.post.time).getMinutes() }}
            </div>
          </div>
          <div class="text item" style="white-space: pre-line; padding: 0 15px; height: 500px;">
            <div class="ql-editor" v-html="item.post.name" v-highlight></div>
          </div>
          <div style="display: flex; justify-content:flex-end;">
            <span style="font-weight: bold; color: #0043a1; text-shadow: 0px 2px 3px rgb(73,230,255); position: relative; top: 5px;">
              点赞量{{ item.post.likenum }}
            </span>
            <el-button icon="el-icon-delete-solid" size="small" style="margin-left: 10px;"
                       type="danger" @click="del(item.post.id)">删除
            </el-button>
          </div>

          <div v-for="(item2,i) in item.post2" :key="i" >
            <el-divider v-if="i===0"></el-divider>
            <div style="width: 100%; min-height: 50px;display: flex; justify-content: space-between; ">
              <div style="display: flex; align-items:center;">
                <el-avatar :size="30" :src="item2.avatar"  shape="square" style="margin: 0px 10px;">{{ item.post.userno.charAt(0) }}</el-avatar>
                <div>
                  <span style="font-size: 12px; font-weight: lighter; color: #6e6e6e"> {{item2.userName}}</span>
                  <!--                  <el-tag size="mini" type="danger">标签五</el-tag>-->
                  <br><span style="font-size: 16px; "> {{ item2.content }}</span>
                </div>
              </div>
              <div style="font-weight: 10; font-size: 14px; ">
<!--                {{ new Date(item2.time).getMonth() + 1 }}/{{ new Date(item2.time).getDate() }}
                {{ new Date(item2.time).getHours() }}:{{ new Date(item2.time).getMinutes() }}-->
                <el-button icon="el-icon-delete-solid" size="mini" style="margin-left: 10px; margin-top: 10px;"
                           type="warning" @click="delPost2(item2.id)">删除
                </el-button>
              </div>
            </div>
          </div>
        </el-card>
        <div style="width: 100%; margin: 20px 0; text-align: center;">
          <el-button style="width: 50%;" @click="autoLoad">更多</el-button>
        </div>
      </div>
    </div>

  </div>
</template>

<style scoped>
@media (min-width: 768px){
  .box-card{
    width: 45%;
  }
  .text2{
    font-size: larger;
  }
  .text{
    font-size: medium;
  }

  .scroll-to-top {
    position: fixed;
    bottom: 30px;
    margin-left: 20px;
    font-size: 25px;
    box-shadow: 0px 5px 10px rgba(0, 0, 0, 0.2);
  }
}
@media (min-width: 0px) and (max-width:768px){
  .box-card{
    width: 90%;
  }
  .text2{
    font-size: 15px;
    position: relative;
    left: 20px;
  }
  .text{
    font-size: small;
  }

  .scroll-to-top {
    position: fixed;
    bottom: 30px;
    margin-left: 10px;
    font-size: 10px;
    box-shadow: 0px 5px 10px rgba(0, 0, 0, 0.2);
  }
}
</style>