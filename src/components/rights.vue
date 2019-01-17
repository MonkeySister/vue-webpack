<template>
  <el-card class="card">
    <my-bread level1="权限管理" level2="权限列表"></my-bread>
    <!-- 权限列表table -->
    <el-table
      :data="rights"
      style="width: 900px"
      height="450">
      <el-table-column
        fixed
        prop="id"
        label="#"
        width="150">
      </el-table-column>
      <el-table-column
        prop="authName"
        label="权限名称"
        width="250">
      </el-table-column>
      <el-table-column
        prop="path"
        label="路径"
        width="250">
      </el-table-column>
      <el-table-column
        label="层级"
        width="250">
        <template slot-scope="scope">
          <span v-if="scope.row.level === '0'">一级</span>
          <span v-if="scope.row.level === '1'">二级</span>
          <span v-if="scope.row.level === '2'">三级</span>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>
<script>
export default {
  data(){
    return {
      rights: []
    };
  },
  created() {
    this.getRightsList();
  },
  methods: {
    //获取权限列表数据
    async getRightsList(){
      const res = await this.$http.get("rights/list");
      //console.log(res);
      const {data,meta:{msg,status}} = res.data;
      if(status == 200){
        this.$message.success(msg);
        this.rights = data;
      }else{
        this.$message.error(msg);
      }
    }
  },
}
</script>
<style scoped>
.card{
  height: 100%;
}
</style>
