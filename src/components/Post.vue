<!-- eslint-disable vue/multi-word-component-names -->
<script >
export default {
  name: "Post",
  data(){
    return{
      postId:'',
      PostMain:[],
      isMobile: false,
      user:'',
    }
  },
  beforeMount() {
    this.loadPost();
    this.user = JSON.parse(sessionStorage.getItem('CurUser'));
  },
  created() {
    this.postId = this.$route.params.postId;
    // 使用postId做一些事情
  },
  methods:{
    loadPost() {
      this.$axios.post(this.$httpUrl + '/post/listPage', {
        param: {
          postId: this.$route.params.postId
        }
      }).then(res => res.data).then(res => {
        if (res.code === 200) {
          this.PostMain = res.data;
        } else {
          alert('获取失败')
        }
      })
    },
    post2(id){
      this.$prompt('发表您的评论', '评论', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputErrorMessage: '不能发空的喔'
      }).then(({ value }) => {
        this.$axios.post(this.$httpUrl + '/post2/save', {
          postId: id,
          userId: this.user.id,
          content: value
        }).then(res => res.data)
            .then(res => {
              if (res.code === 200) {
                this.$notify({
                  title: '感谢您的贡献，' + this.user.name,
                  message: '上传成功',
                  type: 'success'
                });
                this.loadPost();
              } else {
                this.$notify.error({
                  title: 'oops！发生了一些问题',
                  message: '服务器开小差啦~请稍后再试'
                });
              }
            })
      }).catch(() => {

      });
    },
    like(postId) {
      this.$axios.get(this.$httpUrl + '/post/like?id=' + postId).then(res => res.data)
          .then(res => {
            if (res.code === 200) {
              this.$message({
                showClose: true,
                message: '点赞成功',
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
    },
    copy(text){
      const textArea = document.createElement('textarea');
      textArea.textContent = text;
      textArea.style.position = 'fixed';
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy'); // 把要复制的内容拷贝到剪贴板
        this.$notify({
          title: '内容已复制',
          message: '您可以粘贴分享',
          type: 'success'
        });
      } catch(ex) {
        this.$notify({
          title: '复制失败',
          type: 'error'
        });
        return false;
      } finally {
        document.body.removeChild(textArea); // 移除插入的文本域节点
      }
    },
    goBack() {
      this.$router.go(-1); // Go back one step in history
    },
    checkIfMobile() {
      this.isMobile = window.innerWidth < 768; // Adjust the value based on your requirements
    },
  },
  mounted() {
    this.checkIfMobile();
    window.addEventListener('resize', this.checkIfMobile);
  },
}
</script>

<template>
  <div>
    <el-page-header style="height: 50px; align-items: center; margin-left: 2vw; margin-top: 3vw;" @back="goBack" content="帖子详情">
    </el-page-header>


    <div style="display: flex; flex-direction:column;   align-items: center; margin-top: 30px;">
      <el-card v-for="(item,i) in PostMain" :key="i" class="box-card"
               style="width: 60%; min-height: 300px; margin: 20px;">
        <div slot="header" style="display: flex; align-items: center; justify-content: space-between;">
          <div >
            <el-avatar :size="40" :src="item.post.avatar" style="margin: 0px 10px;">{{
                item.post.userno.charAt(0)
              }}</el-avatar>
            <span  v-if="!isMobile" style="position: relative; top: -12px;font-size: 1vw;">{{ item.post.userno }}</span>
          </div>

          <div style="position: relative; left: -25px;">
            <span style="font-weight: 10; font-size: 1vw; color: #777777">{{ item.post.id }}.</span>
            <span class="text2" style="padding-left: 10px;">{{ item.post.title }}</span>
          </div>

          <div style="font-weight: 10; font-size: 1vw; position: relative; top: -5px;">
            {{ new Date(item.post.time).getMonth() + 1 }}/{{ new Date(item.post.time).getDate() }} <br>
            {{ new Date(item.post.time).getHours() }}:{{ new Date(item.post.time).getMinutes() }}
          </div>
        </div>
        <div class="text item" style="white-space: pre-line; padding: 0px 15px; min-height: 150px; ">
          {{ item.post.name }}
        </div>
        <div style="display: flex; justify-content:flex-end;">
            <span
                style="font-weight: bold; color: #0043a1; text-shadow: 0px 2px 3px rgb(73,230,255); position: relative; top: 5px;">
              {{ item.post.likenum }}
            </span>
          <el-button circle icon="el-icon-thumb" size="small" style="margin-left: 10px;"
                     type="success" @click="like(item.post.id)"></el-button>
          <el-button circle icon="el-icon-share" size="small" style="margin-left: 10px;"
                     type="warning" @click="copy(item.post.name)"></el-button>
          <el-button circle icon="el-icon-chat-dot-square" size="small" style="margin-left: 10px;"
                     type="primary" @click="post2(item.post.id)"></el-button>
        </div>

        <div v-for="(item2,i) in item.post2" :key="i" >
          <el-divider v-if="i===0"></el-divider>
          <div style="width: 100%; min-height: 55px;display: flex; justify-content: space-between; ">
            <div style="display: flex; align-items:center;">
              <el-avatar :size="30" :src="item2.avatar" shape="square" style="margin: 0px 10px;">{{ item.post.userno.charAt(0) }}</el-avatar>
              <div>
                <span style="font-size: 12px; font-weight: lighter; color: #6e6e6e"> {{item2.userName}}</span>
                <el-tag size="mini" :type="item2.roleId === 0 ? 'danger' : (item2.roleId === 1 ? 'warning' : 'info')" v-if="item2.roleId !== 2" effect="plain" style="margin-left: 5px; font-size: 10px;">
                  {{ item2.roleId === 0 ? "超管" : (item2.roleId === 1 ? " 管理员" : " ") }}</el-tag>
                <br><span style="font-size: 16px; "> {{ item2.content }}</span>
              </div>
            </div>
            <div style="font-weight: 10; font-size: 14px; ">
              {{ new Date(item2.time).getMonth() + 1 }}/{{ new Date(item2.time).getDate() }}
              {{ new Date(item2.time).getHours() }}:{{ new Date(item2.time).getMinutes() }}
            </div>
          </div>
        </div>
      </el-card>
    </div>
  </div>


</template>

<style scoped>
.text{
  font-size: 1vw;
}
@media (min-width: 768px){
  .text2{
    font-size: 1.2vw;
  }
}
@media (min-width: 0px) and (max-width:768px){
  .text2{
    font-size: 1.2vw;
    position: relative;
    left: 20px;
  }
}
</style>