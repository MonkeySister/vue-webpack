<template>
  <el-card class="card">
    <!-- 封装自己的组件 -->
    <my-bread level1="权限管理" level2="角色列表"></my-bread>
    <!-- 添加角色 -->
    <el-button type="primary" class="btn">添加角色</el-button>
    <!-- 表格展示 -->
    <el-table :data="roles" style="width: 100%">
      <el-table-column type="expand">
        <template slot-scope="scope">   
          <el-row v-for="(children1,i) in scope.row.children" :key="i" class="row">
            <!-- 展示一级 -->
            <el-col :span="4">
              <el-tag closable type="success" @close="delRights(scope.row,children1)">{{children1.authName}}</el-tag><i class="el-icon-d-arrow-right"></i>
            </el-col>
            <!-- 展示二三级 -->
            <el-col :span="20">
              <el-row v-for="(children2,i) in children1.children" :key="i">
                <!-- 展示二级 -->
                <el-col :span="4"><el-tag closable type="info" @close="delRights(scope.row,children2)">{{children2.authName}}</el-tag><i class="el-icon-d-arrow-right"></i></el-col>
                <!-- 展示三级 -->
                <el-col :span="20"><el-tag closable type="warning" v-for="(children3,i) in children2.children" :key="i" @close="delRights(scope.row,children3)">{{children3.authName}}</el-tag></el-col>
              </el-row>
            </el-col>
          </el-row>
          <el-row v-if="scope.row.children.length === 0">
            <el-col :span="24"><el-alert title="该角色未定义权限" type="error" center></el-alert></el-col>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column
        label="ID"
        prop="id">
      </el-table-column>
      <el-table-column
        label="角色名称"
        prop="roleName">
      </el-table-column>
      <el-table-column
        label="角色描述"
        prop="roleDesc">
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" circle size="mini" plain></el-button>
          <el-button type="danger" icon="el-icon-delete" circle size="mini" plain></el-button>
          <el-button type="success" icon="el-icon-check" circle size="mini" plain @click="showRightsTree(scope.row)"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 编辑权限对话框 -->
    <el-dialog title="编辑角色权限" :visible.sync="dialogVisibleRights" width="30%">
      <!-- 树形结构 -->
      <!-- 
        1.data:树形结构绑定的数据
        2.show-checkbos:是否支持选中
        3.node-key：每个节点唯一标识
        4.default-expand-keys：默认展开那些节点，数组结构，包含要展开节点的id;default-expand-all默认展开所有
        5.default-checked-keys：默认选中那些节点，数组结构，包含要选中节点的id
        6.props:配置选项{label,children}
       -->
      <el-tree
        :data="treeData"
        show-checkbox
        node-key="id"
        default-expand-all
        :default-checked-keys="checkedRights"
        :props="defaultProps"
        ref="tree">
      </el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisibleRights = false">取 消</el-button>
        <el-button type="primary" @click="editRolesRights()">确 定</el-button>
      </span>
    </el-dialog>

  </el-card>
</template>
<script>
import { Message } from 'element-ui';
export default {
  data() {
    return {
      roles: [],
      dialogVisibleRights: false,
      treeData: [],
      defaultProps: {
        // label指的是节点对应的文本信息
        //children指的是树形结构的子节点的数据的key名
        children: "children",
        label: "authName"
      },
      checkedRights: [],
      rolesId: -1
    };
  },
  components:{
    Message
  },
  created() {
    this.getRolesList();
  },
  methods: {
    //发送请求获取数据
    async getRolesList() {
      const res = await this.$http.get("roles");
      //console.log(res);
      const { data, meta: { msg, status } } = res.data;
      this.roles = data;
    },
    //删除角色的权限
    async delRights(role, right) {
      //console.log(roles);
      //发送请求删除该角色对应的权限
      const res = await this.$http.delete(
        `roles/${role.id}/rights/${right.id}`
      );
      console.log(res);
      const { meta: { msg, status } } = res.data;
      if (status === 200) {
        this.$message.success(msg);
        //更新表格
        //this.getRolesList();
        //只更新当前表格
        role.children = res.data.data;
      }
    },
    //点击显示分配权限对话框
    async showRightsTree(role) {
      this.dialogVisibleRights = true;
      //发送请求获取所有权限
      const res = await this.$http.get("rights/tree");
      this.treeData = res.data.data;
      //console.log(this.treeData);
      //角色，包含角色所拥有的权限
      //console.log(role);
      this.rolesId = role.id;
      //将此角色所有权限的id遍历取出放入到checkedRights中，默认选中
      const RightsArr = [];
      role.children.forEach(children1 => {
        RightsArr.push(children1.id);
        children1.children.forEach(children2 => {
          RightsArr.push(children2.id);
          children2.children.forEach(children3 => {
            RightsArr.push(children3.id);
          });
        });
      });
      this.checkedRights = RightsArr;
    },
    //修改角色权限
    async editRolesRights() {
      //获取全选的节点
      //在vue中操作DOM调用js方法
      //1.给药操作的标签设置ref属性值
      //2.this.$ref.tree.
      // console.log(this.$refs);
      const rel1 = this.$refs.tree.getCheckedKeys();
      //console.log(rel1);
      //获取半选的节点
      const rel2 = this.$refs.tree.getHalfCheckedKeys();
      //console.log(rel2);
      //console.log([...rel1,...rel2]);
      //发送请求修改权限
      //传参1.角色id,
      //1.定义变量设置角色id
      const res = await this.$http.post(`roles/${this.rolesId}/rights`, {
        //2.以逗号分隔的权限id的列表
        //id分类
        //1.全选的节点，2.半选的id
        rids: [...rel1, ...rel2].join(",")
      });
      //console.log(res);
      const { meta: { msg, status } } = res.data;
      if (status === 200) {
        this.$message.success(msg);
        this.dialogVisibleRights = false;
        this.getRolesList();
      }
    }
  }
};
</script>
<style scoped>
.card{
  height: 100%;
}
.card .btn {
  margin-top: 15px;
}
.demo-table-expand {
  font-size: 0;
}
.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}
.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}
.row {
  margin: 10px 0;
}
</style>

