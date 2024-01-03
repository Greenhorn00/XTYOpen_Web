<!-- eslint-disable vue/multi-word-component-names -->
<script>
//调用富文本编辑器
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";
import { quillEditor } from "vue-quill-editor";

export default {
  name: "Home",
  data() {
    return {
      postUrl: this.$httpUrl,
      quillUpdateImg:false,//加载图片
      isMobile: false, //手机端
      isVisible: false, //回到顶部
      centerDialogVisible: false,  //表单开关
      loading: false,  //加载中
      user: '',
      text: '',
      tableData: [],
      srcList: [
        'https://getwallpapers.com/wallpaper/full/a/2/2/1327355-best-fallout-4-vault-tec-wallpaper-1920x1200.jpg',
        'https://vignette.wikia.nocookie.net/scp/images/8/86/800px-SCP002.jpg/revision/latest?cb=20121125025010&path-prefix=es',
        this.$httpUrl + '/static/file/14/wg.png',
      ],

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
      },
      // 富文本编辑器
      editorOption: {
        placeholder: "请在这里输入内容",
        modules: {
          toolbar: {
            container: [
              ["bold", "italic", "underline", "strike"], //加粗，斜体，下划线，删除线
              ["blockquote", "code-block"], //引用，代码块
              [{ header: 1 }, { header: 2 }], // 标题，键值对的形式；1、2表示字体大小
              [{ list: "ordered" }, { list: "bullet" }], //列表
              [{ script: "sub" }, { script: "super" }], // 上下标
              [{ indent: "-1" }, { indent: "+1" }], // 缩进
              [{ direction: "rtl" }], // 文本方向
              [{ size: ["small", false, "large", "huge"] }], // 字体大小
              // [{ header: [1, 2, 3, 4, 5, 6, false] }], //几级标题
              [{ color: [] }, { background: [] }], // 字体颜色，字体背景颜色
              // [{ font: [] }], //字体
              [{ align: [] }], //对齐方式
              ["clean"], //清除字体样式
              ["image"] //上传图片、上传视频   "link" 链接  "video" 视频
            ],
            //重写图片上传事件
            handlers: {
              'image': function (value) {
                if (value) {
                  // 触发input框选择图片文件
                  document.querySelector('.avatar-uploader input').click()
                } else {
                  this.quill.format('image', false);
                }
              }
            },
          },
        },
      },
    }
  },
  methods: {
    loadPost() {
      this.$axios.post(this.$httpUrl + '/post/listPage', {
        param: {
          name: this.text
        }
      }).then(res => res.data).then(res => {
        if (res.code === 200) {
          this.tableData = res.data
        } else {
          alert('获取失败')
        }
      })
    },
    restParam() {
      this.text = '';
      this.loadPost();
    },
    post2(id) {
      this.$prompt('发表您的评论', '评论', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputErrorMessage: '不能发空的喔'
      }).then(({value}) => {
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
    save() {
      //由于富文本编辑器生成的代码块只有pre标签,没有code标签,而前端的回显需要code标签,所以需要做处理
      let newContent = this.form.name.replace(
          /<pre class="ql-syntax" spellcheck="false">/g,
          '<pre class="ql-syntax line-numbers language-js" spellcheck="false"><code class="language-js">'
      );
      newContent = newContent.replace(/<\/pre>/g, "</code></pre>");
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.loading = true;
          this.$axios.post(this.$httpUrl + '/post/save', {
            userid: this.user.id,
            name: newContent,
            title: this.form.title
          }).then(res => res.data)
              .then(res => {
                if (res.code === 200) {
                  this.centerDialogVisible = false;
                  this.$notify({
                    title: '感谢您的贡献，' + this.user.name,
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
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    copy(text) {
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
      } catch (ex) {
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
    //检查手机
    checkIfMobile() {
      this.isMobile = window.innerWidth < 768; // Adjust the value based on your requirements
    },
    goToPost(postId) {
      this.$router.push('/Post/' + postId);
    },
    //图片上传成功钩子函数
    handleAvatarSuccess(res) {
      // res为图片服务器返回的数据
      // 获取富文本组件实例
      let quill = this.$refs.myQuillEditor.quill
      // 如果上传成功
      if (res.sinaPath !== null) {
        // 获取光标所在位置
        let length = quill.selection.savedRange.index;
        // 插入图片  res.info为服务器返回的图片地址
        quill.insertEmbed(length, 'image', res.data)
        // 调整光标到最后
        quill.setSelection(length + 1)
        this.quillUpdateImg = false;
      } else {
        this.$message.error('图片插入失败')
      }
    },
    //图片上传前钩子函数
    beforeAvatarUpload(file) {
      // 显示loading动画
      console.log(file);
      this.quillUpdateImg = true
    },
//图片上传失败钩子函数
    handleAvatarError() {
      // loading动画消失
      this.quillUpdateImg = false
      this.$message.error('图片插入失败')
    },
  },
  beforeMount() {
    this.loadPost();
    this.user = JSON.parse(sessionStorage.getItem('CurUser'));
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
  components: {
    quillEditor
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
  <div id="body" class="light-mode">

    <el-button circle class="floating-button" icon="el-icon-plus" type="primary" @click="update"></el-button>
    <el-button v-if="isVisible" circle class="scroll-to-top" icon="el-icon-top" @click="scrollToTop"></el-button>

    <div style="display: flex;  flex-direction:column; justify-content: center;">
      <el-carousel :interval="4000" height="300px" style="margin-top: 10px; margin-bottom: 20px;" type="card">
        <el-carousel-item v-for="(item, index) in srcList" :key="index"
                          style="display: flex; justify-content: center; align-items: center;">
          <el-image
              :preview-src-list="srcList"
              :src="item"
              class="imgs"
              style="width: 550px;">
          </el-image>
        </el-carousel-item>
      </el-carousel>
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

      <div style="display: flex; flex-direction:column;   align-items: center; margin-top: 30px;">
        <el-card v-for="(item,i) in tableData" :key="i" class="box-card"
                 style="width: 60%; min-height: 16vw; margin: 20px;">
          <div @click="goToPost(item.post.id)">
            <div style="display: flex; align-items: center; justify-content: start;margin-top: 0.2vw; margin-bottom: 2vw;">
              <span class="text2" style="padding-left: 0.5vw;">{{ item.post.title }}</span>
            </div>
            <div style="display: flex; justify-content:space-between;height: 14vw;">
              <div class="text item" style=" padding-left:0.5vw; min-height: 18px; max-height: 90%; width: 40%;">

                <div class="ql-editor" v-html="item.post.name" v-highlight></div>
<!--                {{ item.post.name | truncate(200) }}-->
              </div>
              <el-image :src="item.post.avatar" style="width: 40%;height: 15vw;position: relative;top: -2vw;">
                <div slot="error" style="width: 100%;height: 100%;display: flex;justify-content: center;align-items: center;font-size: 14px;color: #858383;vertical-align: middle;background: #f5f7fa;">
                  {{ item.post.userno }}
                </div>
              </el-image>
            </div>
            <div style="display: flex; justify-content:space-between;">
              <div style="display: flex;align-items: center;">
                <el-avatar :size="30" :src="item.post.avatar" style="margin: 0px 5px;">{{
                    item.post.userno.charAt(0)
                  }}
                </el-avatar>
                <span v-if="!isMobile" style=" font-size: 0.7vw;">{{ item.post.userno }}</span>
                <div style="display: flex; justify-content:flex-end;">
                  <el-button icon="el-icon-thumb" size="small" style="margin-left: 10px;"
                             @click="like(item.post.id)">{{ item.post.likenum }}
                  </el-button>
                  <el-button icon="el-icon-chat-dot-square" size="small" style="margin-left: 5px;"
                             @click="post2(item.post.id)">{{ item.post2.length }} </el-button>
                  <el-button circle icon="el-icon-share" size="small" style="margin-left: 5px;"
                             @click="copy(item.post.name)"></el-button>
                </div>
              </div>

              <div style="font-weight: 10; font-size: 0.8vw;position: relative;top: 0.6vw;">
                {{ new Date(item.post.time).getMonth() + 1 }}/{{ new Date(item.post.time).getDate() }}
                {{ new Date(item.post.time).getHours() }}:{{ new Date(item.post.time).getMinutes() }}
              </div>
            </div>
          </div>
        </el-card>
      </div>
    </div>

    <el-dialog
        :before-close="handleClose"
        :visible.sync="centerDialogVisible"
        center
        title="发表"
        width="80%"
        >
      <el-form ref="form" :model="form" :rules="rules" label-width="80px" status-icon>
        <el-form-item label="标题" prop="title" style="position: relative;left: 5vw;">
          <el-col :span="20" >
            <el-input v-model="form.title" style="font-size: 20px; font-weight: bold" placeholder="请输入标题" type="textarea"></el-input>
          </el-col>
        </el-form-item>
<!--        <el-form-item label="正文" prop="name">
          <el-col :span="20">
            <el-input v-model="form.name"
                      :autosize="{ minRows: 8, maxRows: 12}"
                      placeholder="请输入正文"
                      style="font-size: 20px;"
                      type="textarea"></el-input>
          </el-col>
        </el-form-item>-->
      </el-form>
      <el-row v-loading="quillUpdateImg">
        <quill-editor ref="myQuillEditor" v-model="form.name" :options="editorOption">
        </quill-editor>
      </el-row>
      <!-- elementUI上传图片组件 -->
      <el-upload class="avatar-uploader"
                 :action="`${this.postUrl}/files/upPost`"
                 :show-file-list="false"
                 :on-success="handleAvatarSuccess"
                 :on-error="handleAvatarError"
                 :before-upload="beforeAvatarUpload">
      </el-upload>

      <span slot="footer" class="dialog-footer">
        <el-button @click="centerDialogVisible = false; this.loading = false;">取 消</el-button>
        <el-button :loading="loading" type="primary" @click="save">{{ loading ? '提交中 ...' : '确 定' }}</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<style scoped>
.text {
  font-size: 0.9vw;
  ::-webkit-scrollbar {
    /*隐藏滚轮*/
    display: none;
  }
}
.editor {
  line-height: normal !important;
  height: 800px;
}
.ql-snow .ql-tooltip[data-mode='link']::before {
  content: '请输入链接地址:';
}
.ql-snow .ql-tooltip.ql-editing a.ql-action::after {
  border-right: 0px;
  content: '保存';
  padding-right: 0px;
}
.ql-snow .ql-tooltip[data-mode='video']::before {
  content: '请输入视频地址:';
}
.ql-snow .ql-picker.ql-size .ql-picker-label::before,
.ql-snow .ql-picker.ql-size .ql-picker-item::before {
  content: '14px';
}
.ql-snow .ql-picker.ql-size .ql-picker-label[data-value='small']::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value='small']::before {
  content: '10px';
}
.ql-snow .ql-picker.ql-size .ql-picker-label[data-value='large']::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value='large']::before {
  content: '18px';
}
.ql-snow .ql-picker.ql-size .ql-picker-label[data-value='huge']::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value='huge']::before {
  content: '32px';
}
.ql-snow .ql-picker.ql-header .ql-picker-label::before,
.ql-snow .ql-picker.ql-header .ql-picker-item::before {
  content: '文本';
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value='1']::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value='1']::before {
  content: '标题1';
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value='2']::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value='2']::before {
  content: '标题2';
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value='3']::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value='3']::before {
  content: '标题3';
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value='4']::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value='4']::before {
  content: '标题4';
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value='5']::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value='5']::before {
  content: '标题5';
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value='6']::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value='6']::before {
  content: '标题6';
}


@media (min-width: 768px) {
  .quill-editor {
    width: 90%;
    margin: 0 auto;
    height: 20vw;
    padding-bottom: 3.5vw;
  }
  .imgs {
    height: 100%;
  }

  .text2 {
    font-size: 1.3vw;
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

@media (min-width: 0px) and (max-width: 768px) {
  .imgs {
    height: 50%;
  }

  .text2 {
    font-size: 1.2vw;
    position: relative;
    left: 20px;
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