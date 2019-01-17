<template>
  <el-card class="card">
    <my-bread level1="订单管理" level2="订单列表"></my-bread>
    <el-table :data="list" style="width: 800px" class="table">
      <el-table-column type="index" label="#" width="40"></el-table-column>
      <el-table-column prop="order_number" label="订单编号" width="240"></el-table-column>
      <el-table-column prop="order_price" label="订单价格" width="80"></el-table-column>
      <el-table-column prop="order_pay" label="是否付款" width="100">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.order_pay==='0'">已付款</el-tag>
          <el-tag type="danger" v-if="scope.row.order_pay==='1'">未付款</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="is_send" label="是否发货" width="100"></el-table-column>
      <el-table-column label="下单时间" width="130">
        <template slot-scope="scope">
          {{scope.row.create_time | fmtData}}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="100">
        <template slot-scope="scope">
          <el-button
            type="primary"
            icon="el-icon-edit"
            circle
            size="mini"
            plain
            @click="showEditdia(scope.row)"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog title="修改订单地址" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item label="省市区" label-width="120px">
          <el-cascader
            expand-trigger="hover"
            clearable
            :options="catlist"
            v-model="selectedOptions"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" label-width="120px">
          <el-input v-model="form.address" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
// 添加省市区
import catlist from '@/assets/js/city_data2017_element.js'
export default {
  data() {
    return {
      list: [],
      dialogFormVisible: false,
      form: {
        address: ""
      },
      // 级联选择器要绑定的数据
      catlist: [],
      selectedOptions: []
      //级联选择器可以不用写，有默认值
      /* defaultProps:{
        label:"",
        value:"",
        children:"children"
      } */
    };
  },
  created() {
    this.getData();
  },
  methods: {
    async getData() {
      const res = await this.$http.get(`orders?pagenum=1&pagesize=10`);
      // console.log(res);
      this.list = res.data.data.goods;
    },
    //显示编辑表格
    showEditdia() {
      //编辑表格的省市级等于引入的js文件
      this.catlist = catlist;
      this.dialogFormVisible = true;
    }
  }
};
</script>

<style scoped>
.card{
  height: 100%;
}
.table{
  height: 400px;
  overflow: auto;
}
</style>
