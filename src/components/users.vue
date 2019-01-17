<template>
  <el-card class="box-card">
    <!-- 面包屑/头部导航 -->
    <my-bread level1="用户管理" level2="用户列表"></my-bread>
    <!-- 搜索框 -->
    <el-row class="Slect">
      <el-col :span="8">
        <el-input placeholder="请输入内容" v-model="query" class="input-with-select" clearable @clear="getAllUser()">
          <el-button slot="append" icon="el-icon-search" @click="searchUser()"></el-button>
        </el-input>
      </el-col>
      <el-col :span="4"><el-button type="success" @click="showAddUsers()">添加用户</el-button></el-col>
    </el-row>
    <!-- 显示表格 -->
    <el-table :data="tableData" height="350" border style="width: 100%" v-loading="loading">
      <el-table-column prop="id" label="#" width="80"></el-table-column>
      <el-table-column prop="username" label="姓名" width="160"></el-table-column>
      <el-table-column prop="email" label="邮箱" width="160"></el-table-column>
      <el-table-column prop="mobile" label="电话" width="160"></el-table-column>
      <!-- 格式化日期 -->
      <!-- 过滤器的使用{{}}和v-bind后 都不支持-->
      <el-table-column label="创建日期" width="160">
      <!-- {{create_time | fmtData}} el-table-column是一个组件，组件中不能直接用插值表达式-->
      <!-- 当单元格里面的数据不是字符串时，要用template渲染 -->
      <!-- 子组件要用父组件的内容，用 slot-scope 此时scope == tableData-->
      <!--  slot-scope会自动去找上一级的数据源-->
      <!--  scope.row为数组中的每条数据-->
        <template slot-scope="scope">
          {{scope.row.create_time | fmtData}}
        </template>
      </el-table-column>
      <el-table-column label="用户状态" width="140">
        <!-- 该单元格中的数据不是prop的值 true -->
        <template slot-scope="scope">
          <el-switch
            @change="changeUserState(scope.row)"
            v-model="scope.row.mg_state"
            active-color="#13ce66"
            inactive-color="#ff4949">
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="205">
        <template slot-scope="scope">
          <!-- {{scope.row.id}} -->
          <el-button type="primary" icon="el-icon-edit" circle size="mini" plain @click="showEditUser(scope.row.id)"></el-button>
          <el-button type="danger" icon="el-icon-delete" circle size="mini" plain @click="delUser(scope.row.id)"></el-button>
          <el-button type="success" icon="el-icon-check" circle size="mini" plain @click="showUserRights(scope.row)"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <!-- 
      @size-change：每页显示条数改变时触发
      @current-change：当前页改变时触发
      :current-page：当前页码
      :page-sizes： 控制每页显示条数所在的数组
      :page-size：默认第一次加载的条数 
      layout：分页小插件
      ：total : 数据的总个数
     -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagenum"
      :page-sizes="[2, 4, 6, 8]"
      :page-size="2"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
    <!-- 新增用户 -->
    <el-dialog title="新增用户" :visible.sync="dialogFormVisibleAdd">
      <el-form :model="formData">
        <el-form-item label="用户名" :label-width="formLabelWidth">
          <el-input v-model="formData.username" autocomplete="off" type="text"></el-input>
        </el-form-item>
        <el-form-item label="密码" :label-width="formLabelWidth">
          <el-input v-model="formData.password" autocomplete="off" type="password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" :label-width="formLabelWidth">
          <el-input v-model="formData.email" autocomplete="off" type="email"></el-input>
        </el-form-item>
        <el-form-item label="电话" :label-width="formLabelWidth">
          <el-input v-model="formData.mobile" autocomplete="off" type="text"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleAdd = false">取 消</el-button>
        <el-button type="primary" @click="addNewUser()">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 编辑用户 -->
    <el-dialog title="编辑用户" :visible.sync="dialogFormVisibleEdit">
      <el-form :model="formData">
        <el-form-item label="用户名" :label-width="formLabelWidth">
          <el-input v-model="formData.username" autocomplete="off" type="text" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" :label-width="formLabelWidth">
          <el-input v-model="formData.email" autocomplete="off" type="email"></el-input>
        </el-form-item>
        <el-form-item label="电话" :label-width="formLabelWidth">
          <el-input v-model="formData.mobile" autocomplete="off" type="text"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleEdit = false">取 消</el-button>
        <el-button type="primary" @click="editUser()">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 更改用户权限 -->
    <el-dialog title="编辑用户角色" :visible.sync="dialogFormVisibleRights">
      <el-form :model="formData">
        <el-form-item label="用户名" :label-width="formLabelWidth">
          <el-input v-model="formData.username" autocomplete="off" disabled></el-input>
        </el-form-item>
        <el-form-item label="角色选择" :label-width="formLabelWidth">
          <!-- 下拉框中v-model绑定的数据如果和option中的
                value值一样，默认选择此option
                当选择不同的option时v-model会变成此option的值
           -->
          <el-select v-model="currentRoleID" class="selectOption">
            <el-option label="请选择……" :value="-1"></el-option>
            <el-option :label="v.roleName" :value="v.id" v-for="(v,i) in roles" :key="i"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleRights = false">取 消</el-button>
        <el-button type="primary" @click="updateUserRights()">确 定</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>
<script>
export default {
  data() {
    return {
      query: "",
      tableData: [],
      pagenum: 1,
      pagesize: 2,
      total: -1,
      formData: {
        username: "",
        password: "",
        email: "",
        mobile: ""
      },
      dialogFormVisibleAdd: false,
      dialogFormVisibleEdit: false,
      dialogFormVisibleRights: false,
      formLabelWidth: "80px",
      currentRoleID:-1,
      roles:[],
      loading: true
    };
  },
  created() {
    this.getTableData();
  },
  methods: {
    //获取用户列表
    async getTableData() {
      //发起请求所需要的参数
      //1.query 查询参数，可以为空
      //2.pagenum 当前页码，不能为空
      //3.pagesize 每页显示的条数，不能为空
      //在发起请求前需要设置请求头
      //全局axios设置默认值
      //在哪用在哪写
      const res = await this.$http.get(
        `users?query=${this.query}&pagenum=${this.pagenum}&pagesize=${
          this.pagesize
        }`
      );
      //console.log(res);
      const { data: { data: { total, users }, meta } } = res;
      //console.log(meta);
      if (meta.status == 200) {
        this.loading = false;
        //如果获取数据成功
        this.tableData = users;
        this.total = total;
      }
      //console.log(this.tableData);
    },
    //分页的方法
    //每页显示条数改变触发
    handleSizeChange(val) {
      //console.log(`每页 ${val} 条`);
      this.pagesize = val;
      //默认每次修改都从第一页开始
      this.pagenum = 1;
      this.getTableData();
    },
    //当前页改变触发
    handleCurrentChange(val) {
      //console.log(`当前页: ${val}`);
      //计算当前页是第几条数据
      this.pagenum = val;
      //console.log(this.pagenum);
      this.getTableData();
    },
    //搜索用户的功能
    searchUser() {
      //按照query的值搜索用户
      //默认在第一页打开
      this.pagenum = 1;
      this.getTableData();
    },
    //输入框清空触发事件
    getAllUser() {
      this.getTableData();
    },
    //点击显示对话框
    showAddUsers() {
      this.dialogFormVisibleAdd = true;
      //显示对话框额同时清空表单数据
      this.formData = {};
    },
    //添加新用户
    async addNewUser() {
      //发送请求添加新用户
      const res = await this.$http.post("users", this.formData);
      console.log(res);
      const { data: { meta: { msg, status } } } = res;

      if (status == 201) {
        this.$message.success(msg);
        //如果成功关闭对话框
        this.dialogFormVisibleAdd = false;
        //重新渲染数据
        this.getTableData();
      };
    },
    //删除用户功能
    delUser(userID) {
      this.$confirm("此操作将永久删除该用户, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          //发送请求删除数据
          const res = await this.$http.delete(`users/${userID}`);
          //console.log(res);
          const { meta: { msg, status } } = res.data;
          if (status == 200) {
            this.$message.success(msg);
            this.getTableData();
          };
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    //显示编辑用户
    async showEditUser(userID) {
      this.dialogFormVisibleEdit = true;
      //在展现的同时显示要修改用户的数据
      const res = await this.$http.get(`users/${userID}`);
      //console.log(res);
      this.formData = res.data.data;
      //console.log(this.formData);
    },
    //编辑用户功能
    async editUser() {
      //发送请求修改数据
      const res = await this.$http.put(`users/${this.formData.id}`, {
        email: this.formData.email,
        mobile: this.formData.mobile
      });
      console.log(res);
      const { meta: { msg, status } } = res.data;
      if (status == 200) {
        this.$message.success(msg);
        this.dialogFormVisibleEdit = false;
        this.getTableData();
      };
    },
    //改变用户状态
    async changeUserState(user) {
      //发送请求改变用户状态
      const res = await this.$http.put(
        `users/${user.id}/state/${user.mg_state}`
      );
    },
    //展示全部角色
    async showUserRights(user) {
      //console.log(user);
      this.formData = user;
      this.dialogFormVisibleRights = true;
      //获取所有角色信息
      const res = await this.$http.get("roles");
      this.roles = res.data.data;
      //根据用户信息查询用户对应roles
      const resRoles = await this.$http.get(`users/${this.formData.id}`);
      //console.log(resRoles);
      const {data:{rid}} = resRoles.data;
      this.currentRoleID = rid;
    },
    //修改用户角色
    async updateUserRights(){
      //发送请求修改用户角色
      const res = await this.$http.put(`users/${this.formData.id}/role`,{rid:this.currentRoleID});
      //console.log(res);
      const {meta:{msg,status}} = res.data;
      if(status == 200){
        this.$message.success(msg);
        this.dialogFormVisibleRights = false;
        this.getTableData();
      };
    }
  }
};
</script>
<style scoped>
.box-card {
  height: 100%;
}
.Slect {
  margin: 10px 0;
}
.selectOption{
  width: 100%;
}
</style>

