<template>
  <el-card class="card">
    <!-- 面包屑 -->
    <my-bread level1="商品管理" level2="商品列表"></my-bread>
    <!-- 搜索框 -->
    <el-row class="Slect">
      <el-col :span="10">
        <el-input placeholder="请输入内容" v-model="query" class="input-with-select" clearable  @clear="getAllGoods()">
          <el-button slot="append" icon="el-icon-search" @click="searchGoods()"></el-button>
        </el-input>
      </el-col>
      <el-col :span="4"><el-button type="success" @click="showAddGoods()">添加商品</el-button></el-col>
    </el-row>
        <!-- 显示表格 -->
    <el-table :data="tableData" height="380" border style="width: 1200px">
      <el-table-column prop="goods_id" label="#" width="60"></el-table-column>
      <el-table-column prop="goods_name" label="商品名称" width="610"></el-table-column>
      <el-table-column prop="goods_price" label="商品价格" width="60"></el-table-column>
      <el-table-column prop="goods_weight" label="商品重量" width="60"></el-table-column>
      <el-table-column label="创建日期" width="120">
        <template slot-scope="scope">
          {{scope.row.add_time | fmtData}}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="140">
        <template slot-scope="scope">
          <!-- {{scope.row.id}} -->
          <el-button type="primary" icon="el-icon-edit" circle size="mini" plain @click="showEditUser(scope.row.id)"></el-button>
          <el-button type="danger" icon="el-icon-delete" circle size="mini" plain @click="delUser(scope.row.id)"></el-button>
          <el-button type="success" icon="el-icon-check" circle size="mini" plain @click="showUserRights(scope.row)"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagenum"
      :page-sizes="[50, 100, 150, 200]"
      :page-size="50"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
  </el-card>
</template>
<script>
export default {
  data() {
    return {
      query: "",
      tableData: [],
      pagenum: 1,
      pagesize: 50,
      total: -1
    };
  },
  created() {
    this.getGoodsList();
  },
  methods: {
    async getGoodsList() {
      //发送请求获取商品数据
      const res = await this.$http.get(
        `goods?query=${this.query}&pagenum=${this.pagenum}&pagesize=${
          this.pagesize
        }`
      );
      //console.log(res);
      const { data: { goods, total }, meta: { msg, status } } = res.data;
      if (status == 200) {
        //如果获取数据成功
        this.tableData = goods;
        this.total = total;
      }
    },
    //每页显示条数改变触发
    handleSizeChange(val) {
      this.pagesize = val;
      this.pagenum = 1;
      this.getGoodsList();
    },
    //当前页改变触发
    handleCurrentChange(val) {
      this.pagenum = val;
      this.getGoodsList();
    },
    //搜索商品的功能
    searchGoods() {
      this.pagenum = 1;
      this.getGoodsList();
    },
    //输入框清空触发事件
    getAllGoods() {
      this.getGoodsList();
    },
    //点击显示添加商品对话框
    showAddGoods(){
      this.$router.push({
        name: 'addGoods'
      })
    }
  }
};
</script>
<style scoped>
.Slect {
  margin: 10px 0;
}
</style>
