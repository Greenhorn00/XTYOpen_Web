<!-- eslint-disable vue/multi-word-component-names -->
<script >
export default{
  name:"UserText",
  data() {
    return {
      isMobile: false, //手机端
      isVisible: false,
      centerDialogVisible: false,
      loading: false,
      user: JSON.parse(sessionStorage.getItem('CurUser')),
      activeName:'first',
      pageSize: 9,
      pageNum: 1,
      total: 1,
      text: '',
      tableData: [],
      Post2tableData: [],
      form: {
        name: '',
        title: '',
      },
      rules: {
        name: [
          {required: true, message: '正文不得为空', trigger: 'blur'}
        ],
        title: [
          {required: true, message: '标题不得为空', trigger: 'blur'}
        ]
      }
    }
  },
  methods: {
    loadPost() {
      this.loadPost2();
      this.$axios.post(this.$httpUrl + '/post/listPage', {
        pageSize: this.pageSize,
        pageNum: this.pageNum,
        param: {
          userid: this.user.id,
          name: this.text
        }
      }).then(res => res.data).then(res => {
        if (res.code === 200) {
          this.tableData = res.data
          this.total = res.total
        } else {
          alert('获取失败')
        }
      })
    },
    loadPost2() {
      this.$axios.post(this.$httpUrl + '/post2/listPage', {
        param: {
          userId: this.user.id,
        }
      }).then(res => res.data).then(res => {
        if (res.code === 200) {
          this.Post2tableData = res.data
        }
      })
    },
    restParam() {
      this.text = '';
      this.loadPost();
    },
    save() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.loading = true;
          this.$axios.post(this.$httpUrl + '/post/save', {
            userid: this.user.id,
            name: this.form.name,
            title: this.form.title
          }).then(res => res.data)
              .then(res => {
                if (res.code === 200) {
                  this.centerDialogVisible = false;
                  this.$notify({
                    title: '感谢您的贡献，'+ this.user.name,
                    message: '上传成功',
                    type: 'success'
                  });
                  this.loadPost();
                  this.loading = false;
                } else {
                  this.$notify.error({
                    title: 'oops！发生了一些问题',
                    message: '服务器开小差啦~请稍后再试'
                  });
                  this.loading = false;
                }
              })
          this.resetForm('form');
        } else {
          return false;
        }
      });

    },
    update() {
      this.centerDialogVisible = true;
      this.$nextTick(() => {
        this.resetForm('form');
      })
    },
    like(userid) {
      this.$axios.get(this.$httpUrl + '/post/like?id=' + userid).then(res => res.data)
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

}
</script>

<template>
  <div>
    <el-tabs type="border-card">
      <el-tab-pane style="min-height: 85vh;">
        <span slot="label"><i class="el-icon-date"></i> 我的文章</span>
        <div style="display: flex;  flex-direction:column; justify-content: center; margin: 20px; ">
          <div style="display: flex; justify-content: center;">
            <el-input
                v-model="text"
                clearable
                placeholder="查询帖子"
                style="width: 400px;"
                @keyup.enter.native="loadPost"></el-input>

            <el-button circle icon="el-icon-search" style="margin-left: 10px;" @click="loadPost"></el-button>
            <el-button circle icon="el-icon-refresh-left" type="info" @click="restParam"></el-button>
          </div>

          <el-timeline class="timeline" >
            <el-timeline-item v-for="(item,i) in tableData" :key="i"  :timestamp="new Date(item.post.time).toDateString()" placement="top">
              <el-card class="box-card" style="min-height: 300px; margin: 20px;">
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
                <div class="text item" style="white-space: pre-line; padding: 0px 15px; min-height: 150px;">
                  {{ item.post.name }}
                </div>
                <div style="display: flex; justify-content:flex-end;">
            <span style="font-weight: bold; color: #0043a1; text-shadow: 0px 2px 3px rgb(73,230,255); position: relative; top: 5px;">
              {{ item.post.likenum }}
            </span>
                  <el-button circle icon="el-icon-thumb" size="small" style="margin-left: 10px;"
                             type="success" @click="like(item.post.id)"></el-button>
                  <el-button circle icon="el-icon-share" size="small" style="margin-left: 10px;"
                             type="primary" @click="copy(item.post.name)"></el-button>
                  <el-button icon="el-icon-delete-solid" size="small" style="margin-left: 10px;"
                             type="danger" @click="del(item.post.id)">删除</el-button>
                </div>

                <div v-for="(item2,i) in item.post2" :key="i" >
                  <el-divider v-if="i===0"></el-divider>
                  <div style="width: 100%; min-height: 50px;display: flex; justify-content: space-between; ">
                    <div style="display: flex; align-items:center;">
                      <el-avatar :size="30" :src="item2.avatar"  shape="square" style="margin: 0px 10px;">{{ item.post.userno.charAt(0) }}</el-avatar>
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
            </el-timeline-item>
          </el-timeline>
          <el-empty v-if="tableData.length === 0">
            <el-button type="success" @click="update">发表文章 !</el-button>
          </el-empty>
        </div>
      </el-tab-pane>

      <el-tab-pane style="min-height: 85vh;">
        <span slot="label"><i class="el-icon-chat-line-square"></i> 我的评论</span>
        <div style="display: flex;  flex-direction:column; justify-content: center; margin: 20px; ">
          <el-timeline class="timeline" >
            <el-timeline-item v-for="(item,i) in Post2tableData" :key="i"  :timestamp="new Date(item.time).toDateString()" placement="top">
              <el-card class="box-card" style="margin: 20px;">
                <div slot="header" style="display: flex; align-items: center; justify-content: space-between;">
                  <div>
                    <el-avatar :size="40" :src="item.avatar" shape="square" style="margin: 0px 10px;">{{ item.userName.charAt(0) }}</el-avatar>
                    <span v-if="!isMobile" style="position: relative; top: -12px;">{{ item.userName }}</span>
                  </div>
                  <div style="font-weight: 10; font-size: 16px; position: relative; top: -5px;">
                    {{ new Date(item.time).getMonth() + 1 }}/{{ new Date(item.time).getDate() }} <br>
                    {{ new Date(item.time).getHours() }}:{{ new Date(item.time).getMinutes() }}
                  </div>
                </div>
                <div class="text item" style="white-space: pre-line; padding: 0px 15px; min-height: 50px;">
                  {{ item.content }}
                </div>
                <div style="display: flex; justify-content:flex-end;">
                <span style="font-weight: bold; color: #0043a1; text-shadow: 0px 2px 3px rgb(73,230,255); position: relative; top: 5px;">
                  {{ item.likenum }}
                </span>
                  <el-button icon="el-icon-delete-solid" size="small" style="margin-left: 10px;"
                             type="danger" @click="delPost2(item.id)">删除</el-button>
                </div>
              </el-card>
            </el-timeline-item>
          </el-timeline>
          <el-empty v-if="Post2tableData.length === 0">
          </el-empty>
        </div>
      </el-tab-pane>
    </el-tabs>

    <el-button circle class="floating-button" icon="el-icon-plus" type="primary" @click="update"></el-button>
    <el-button v-if="isVisible" circle class="scroll-to-top" icon="el-icon-top" @click="scrollToTop"></el-button>
    <el-dialog
        :before-close="handleClose"
        :visible.sync="centerDialogVisible"
        center
        title="发表"
        width="40%">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px" status-icon>
        <el-form-item label="标题" prop="title">
          <el-col :span="20">
            <el-input v-model="form.title" type="textarea" style="font-size: 20px; font-weight: bold"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="正文" prop="name">
          <el-col :span="20">
            <el-input v-model="form.name"
                      :autosize="{ minRows: 8, maxRows: 12}"
                      placeholder="请输入正文"
                      style="font-size: 20px;"
                      type="textarea"></el-input>
          </el-col>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="centerDialogVisible = false; this.loading = false;">取 消</el-button>
        <el-button :loading="loading" type="primary" @click="save">{{ loading ? '提交中 ...' : '确 定' }}</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<style scoped>
@media (min-width: 768px){
  .timeline{
    margin-left: 22%;
  }
  .box-card{
    width: 60%;
  }
  .text2{
    font-size: larger;
  }
  .text{
    font-size: medium;
  }

  .floating-button {
    position: fixed;
    bottom: 30px;
    margin-left: 20px;
    font-size: 25px;
    box-shadow: 0px 5px 10px rgba(0, 0, 0, 0.2);
  }

  .scroll-to-top {
    position: fixed;
    bottom: 90px;
    margin-left: 20px;
    font-size: 25px;
    box-shadow: 0px 5px 10px rgba(0, 0, 0, 0.2);
  }
}
@media (min-width: 0px) and (max-width:768px){
  .timeline{
  }
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

  .floating-button {
    position: fixed;
    bottom: 30px;
    margin-left: 10px;
    font-size: 10px;
    box-shadow: 0px 5px 10px rgba(0, 0, 0, 0.2);
  }

  .scroll-to-top {
    position: fixed;
    bottom: 80px;
    margin-left: 10px;
    font-size: 10px;
    box-shadow: 0px 5px 10px rgba(0, 0, 0, 0.2);
  }
}
</style>