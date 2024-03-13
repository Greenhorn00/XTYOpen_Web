<!-- eslint-disable vue/multi-word-component-names -->
<script>
export default {
  name: "UserContour",
  data() {
    let checkOnlyNo = (rule, value, callback) => {
      //保证修改时顺利验证（id会重复）
      if (this.form.id) {
        return callback();
      }

      this.$axios.post(this.$httpUrl + '/user/findByNo', {
        pageSize: '',
        pageNum: '',
        param: {
          no: this.form.no
        }
      }).then(res => res.data).then(res => {
        if (res.code === 200) {
          callback(new Error('账号已存在'));
        } else {
          callback();
        }
      })
    };

    return {
      loading: false,
      pageSize: 9,
      pageNum: 1,
      total: 1,
      tableData: [],
      name: '',
      sex: '',
      sexs: [
        {
          value: '1',
          label: '男'
        }, {
          value: '0',
          label: '女'
        }
      ],
      centerDialogVisible: false,
      form: {
        id: '',
        no: '',
        name: '',
        password: '',
        age: '',
        sex: '',
        phone: '',
        isvalid: 'Y'
      },
      rules: {

        no: [
          {required: true, message: '请输入账号', trigger: 'blur'},
          {min: 4, max: 19, message: '长度在 4 到 19 个字符', trigger: 'blur'},
          {validator: checkOnlyNo, trigger: 'blur'}
        ],
        name: [
          {required: true, message: '请输入名称', trigger: 'blur'}
        ],
        password: [
          {required: true, message: '请输入密码', trigger: 'blur'}
        ],
        sex: [
          {required: true, message: '请输入性别', trigger: 'blur'}
        ],
        age: [
          {required: true, message: '请输入年龄', trigger: 'blur'},
          {type: 'number', message: '年龄必须为数字'}
        ],
      }
    }
  },
  methods: {
    loadGet() {
      this.$axios.get(this.$httpUrl + '/user/list').then(res => res.data).then(res => {
        console.log(res)
        this.tableData = res
      })
    },
    loadPost() {
      this.$axios.post(this.$httpUrl + '/user/listPageN', {
        pageSize: this.pageSize,
        pageNum: this.pageNum,
        param: {
          name: this.name,
          sex: this.sex
        }
      }).then(res => res.data).then(res => {
        console.log(res)
        if (res.code === 200) {
          this.tableData = res.data
          this.total = res.total
        } else {
          alert('获取失败')
        }
      })
    },
    // 重置
    restParam() {
      this.name = '';
      this.sex = '';
      this.loadPost();
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    // 修改
    mod(row) {
      this.centerDialogVisible = true;
      this.$nextTick(() => {
        this.form.id = row.id;
        this.form.no = row.no;
        this.form.name = row.name;
        this.form.password = row.password;
        this.form.age = row.age;
        this.form.sex = row.sex + '';
        this.form.phone = row.phone;
      })
    },
    // 删除
    del(id) {
      console.log(id)

      this.$axios.get(this.$httpUrl + '/user/delete?id='+ id).then(res => res.data).then(res => {
        if (res.code == 200) {
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
    },
    // 添加信息
    add() {
      this.form.id = '';
      this.centerDialogVisible = true;
      this.$nextTick(() => {
        this.resetForm('form');
      })
    },
    save() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          if (this.form.id) {
            this.doMod();
          } else {
            this.doSave();
          }
          this.resetForm('form');
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    doMod() {
      this.loading = true;
      this.$axios.post(this.$httpUrl + '/user/update', this.form).then(res => res.data)
          .then(res => {
            console.log(res)
            if (res.code === 200) {
              this.centerDialogVisible = false;
              this.$message({
                showClose: true,
                message: '修改成功',
                type: 'success',
              });
              this.loadPost();
              this.loading = false;
            } else {
              this.$message({
                showClose: true,
                message: '服务器开小差啦~请稍后重试',
                type: 'error'
              });
            }
          })
    },
    doSave() {
      this.loading = true;
      this.$axios.post(this.$httpUrl + '/user/save', this.form).then(res => res.data)
          .then(res => {
            console.log(res)
            if (res.code === 200) {
              this.centerDialogVisible = false;
              this.$message({
                showClose: true,
                message: '添加成功',
                type: 'success',
              });
              this.loadPost();
              this.loading = false;
            } else {
              this.$message({
                showClose: true,
                message: '服务器开小差啦~请稍后重试',
                type: 'error'
              });
            }
          })
    },
    // 确认关闭
    handleClose(done) {
      this.$confirm('确认关闭？您的信息不会保存')
          .then(() => {
            done();
          })
          .catch(() => {
          });
    },
    // 一下两个为翻页的页码功能
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.pageNum = 1;
      this.pageSize = val ;
      this.loadPost();
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.pageNum = val;
      this.loadPost();
    }
  },
  beforeMount() {
    // this.loadGet();
    this.loadPost();
  }
};
</script>

<template>
  <div>

    <div style="margin: 10px 5px; display: flex; justify-content: space-between; /* 水平居中 */">
      <div>
        <el-input
            v-model="name"
            clearable
            placeholder="请输入名称"
            style="width: 500px;"
            suffix-icon="el-icon-search"
            @keyup.enter.native="loadPost"></el-input>
        <el-select v-model="sex" filterable placeholder="性别" style="margin-left: 5px; width: 100px;">
          <el-option
              v-for="item in sexs"
              :key="item.value"
              :label="item.label"
              :value="item.value">
          </el-option>
        </el-select>
        <el-button style="margin-left: 10px" type="primary" icon="el-icon-search" @click="loadPost"></el-button>
        <el-button type="info" icon="el-icon-refresh-left" @click="restParam"></el-button>
      </div>
      <div>
        <el-button style="margin-left: 10px" type="primary" icon="el-icon-upload" @click="add">新增</el-button>
      </div>
    </div>

    <div style="position: relative;">
      <el-table
          :data="tableData"
          border
          stripe
          style="width: 100%; margin: 10px auto;">
        <el-table-column label="ID" prop="id" width="80">
        </el-table-column>

        <el-table-column label="头像" prop="avatar" width="60">
          <template slot-scope="scope">
            <el-avatar :size="35" :src="scope.row.avatar" style="">
              {{ scope.row.name.charAt(0) }}</el-avatar>
          </template>
        </el-table-column>

        <el-table-column label="账号" prop="no" width="170">
        </el-table-column>

        <el-table-column label="名称" prop="name" width="170">
        </el-table-column>

        <el-table-column label="电话" prop="phone" >
        </el-table-column>

        <el-table-column label="年龄" prop="age" width="80">
        </el-table-column>

        <el-table-column label="性别" prop="sex" width="80">
          <template slot-scope="scope">
            <el-tag
                :type="scope.row.sex === 1 ? 'primary' : 'success'"
                disable-transitions>{{ scope.row.sex === 1 ? '男' : '女' }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column label="角色" prop="roleId" width="120">
          <template slot-scope="scope">
            <el-tag
                :type="scope.row.roleId === 0 ? 'danger' : (scope.row.roleId === 1 ? 'warning' : 'success')"
                disable-transitions>
              {{ scope.row.roleId === 0 ? '超级管理员' : (scope.row.roleId === 1 ? '管理员' : '用户') }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column label="等级" prop="level" width="70">
        </el-table-column>

        <el-table-column label="状态" prop="isvalid" width="80">
          <template slot-scope="scope">
            <el-tag
                :type="scope.row.isvalid === 'Y' ? 'success' : 'primary'"
                disable-transitions>{{ scope.row.isvalid === 'Y' ? '正常' : '停用' }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column label="操作" prop="operate" fixed="right" width="150">
          <template slot-scope="scope">
            <el-button size="small" type="success" @click="mod(scope.row)" :disabled="scope.row.roleId === 0">编辑</el-button>
            <el-popconfirm
                confirm-button-text='好的'
                cancel-button-text='点错了'
                icon="el-icon-info"
                icon-color="red"
                title="确定删除吗？"
                @confirm = "del(scope.row.id)"
                style="margin-left: 5px;"
            >
              <el-button slot="reference" type="danger" size="small" :disabled="scope.row.roleId === 0">删除</el-button>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
    </div>


    <div style="display: flex; justify-content: center;">
      <el-pagination
          :current-page="pageNum"
          :page-size="pageSize"
          :page-sizes="[10, 15, 20]"
          :total="total"
          background
          layout="total, prev, sizes ,pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange">
      </el-pagination>
    </div>

    <el-dialog
        :before-close="handleClose"
        :visible.sync="centerDialogVisible"
        center
        title="用户"
        width="30%">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px" status-icon>
        <el-form-item label="账号" prop="no">
          <el-col :span="20">
            <el-input v-model="form.no" :disabled=(!!form.id)></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="名称" prop="name">
          <el-col :span="20">
            <el-input v-model="form.name"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-col :span="20">
            <el-input v-model="form.password" show-password></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="性别" prop="sex">
          <el-radio-group v-model="form.sex" size="small">
            <el-radio-button label="1">男</el-radio-button>
            <el-radio-button label="0">女</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="年龄" prop="age">
          <el-col :span="20">
            <el-input v-model.number="form.age"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="电话" prop="phone">
          <el-col :span="20">
            <el-input v-model="form.phone"></el-input>
          </el-col>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="centerDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="save" :loading="loading">{{ loading ? '提交中 ...' : '确 定' }}</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<style scoped>
.el-carousel__item h3 {
  color: #475669;
  font-size: 14px;
  opacity: 0.75;
  line-height: 200px;
  margin: 0;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n+1) {
  background-color: #d3dce6;
}
</style>