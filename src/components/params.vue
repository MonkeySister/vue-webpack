<template>
  <el-card class="card">
    <my-bread level1="商品管理" level2="分类管理"></my-bread>
    <el-alert title="只允许为第三级分类设置参数" type="error" center show-icon class="alert"></el-alert>
    <!-- 级联选择器 -->
    <el-form :label="formData">
      <el-form-item label="请选择商品分类">
        <el-cascader
          expand-trigger="hover"
          :options="options"
          clearable
          :props="defaultProp"
          v-model="selectedOptions"
          @change="handleChange"
          :show-all-levels="false"
          >
        </el-cascader>
      </el-form-item>
    </el-form>
    <!-- tabs -->
    <el-tabs v-model="active" @tab-click="changeTab()">
      <el-tab-pane label="动态参数" name="first">
        <el-button :disabled="this.selectedOptions.length ===0" type="success">添加动态参数</el-button>
        <!-- 动态table -->
        <el-table :data="arrAttrMany" stripe style="width: 100%">
          <el-table-column type="expand" label="#" width="180">
            <template slot-scope="props">
              <el-tag  closable :disable-transitions="false" @close="handleClose(props.row,items)" :key="items.attr_id" v-for="items in props.row.attr_vals">
                {{items}}
              </el-tag>
              <el-input class="input-new-tag" 
                v-if="inputVisible"
                v-model="inputValue"
                ref="saveTagInput"
                size="small"
                @keyup.enter.native="handleInputConfirm(props.row)"
                @blur="handleInputConfirm(props.row)"
              >
              </el-input>
              <el-button v-else class="button-new-tag" size="small" @click="showInput">+ New Tag</el-button>
            </template>
          </el-table-column>
          <el-table-column prop="attr_name" label="属性名称" width="180"></el-table-column>
          <el-table-column label="操作" width="180">
            <template slot-scope="scope">
              <el-button type="primary" icon="el-icon-edit" circle plain size="mini"></el-button>
              <el-button type="danger" icon="el-icon-delete" circle plain size="mini"></el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="静态参数" name="second">
        <el-button :disabled="this.selectedOptions.length ===0" type="success">添加静态参数</el-button>
        <!-- 静态table -->
        <el-table :data="arrAttrOnly" stripe style="width: 100%">
          <el-table-column prop="attr_id" label="#" width="180"></el-table-column>
          <el-table-column prop="attr_name" label="属性" width="180"></el-table-column>
          <el-table-column prop="attr_vals" label="属性名称" width="180"></el-table-column>
          <el-table-column label="操作" width="180">
            <template slot-scope="scope">
              <el-button type="primary" icon="el-icon-edit" circle plain size="mini"></el-button>
              <el-button type="danger" icon="el-icon-delete" circle plain size="mini"></el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>
  </el-card>
</template>
<script>
export default {
  data(){
    return {
      formData:{},
       //级联选择器的数据源
      options:[],
      //级联选择器默认选项,保存分类名的id
      selectedOptions:[1,3,6],
      //级联选择器绑定数据
      defaultProp:{
        label:"cat_name",
        value:"cat_id",
        children:"children"
      },
      active:"first",
      //动态商品参数数组
      arrAttrMany: [],
      //静态商品参数数组
      arrAttrOnly:[],
      inputVisible: false,
      inputValue: ''
    };
  },
  created() {
    this.getCategories();
  },
  methods: {
    //获取商品分类的数据
    async getCategories(){
      const res = await this.$http.get("categories",{
        type:3
      });
      //console.log(res);
      this.options = res.data.data;
    },
    //三级分类改变触发此事件
    async handleChange(){
      //获取三级分类的动态参数
      if(this.selectedOptions.length === 3){  
        const res = await this.$http.get(`categories/${this.selectedOptions[2]}/attributes?sel=many`);
        //console.log(res);
        this.arrAttrMany = res.data.data;
        console.log("获取的动态参数",this.arrAttrMany);
        this.arrAttrMany.forEach((items) => {
          items.attr_vals = items.attr_vals.length ===0?[]:items.attr_vals.trim().split(",");
        }); 
      }
    },
    //当tab改变时查询参数
    async changeTab(){
      //查询静态参数
      if(this.active == "second"){
        if(this.selectedOptions.length === 3){
          const res = await this.$http.get(`categories/${this.selectedOptions[2]}/attributes?sel=only`);
          this.arrAttrOnly = res.data.data;
          console.log("获取的静态参数",this.arrAttrOnly);
        }else{
          this.$message.warning("请选择三级分类");
        };
      };
      //查询动态参数
      if(this.active == "first"){
        this.handleChange();
      }
    },
    //删除上平动态属性
    async handleClose(attr,items) {
      //this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1);
      //根据此id删除此参数
      attr.attr_vals.splice(attr.attr_vals.indexOf(items),1);
      const putData = {
        attr_name:attr.attr_name,
        attr_sel:attr.attr_sel,
        attr_vals:attr.attr_vals.join(",")
      }
      //发送请求删除动态属性的参数
      const res = await this.$http.put(`categories/${this.selectedOptions[2]}/attributes/${attr.attr_id}`,putData);
      const {meta:{msg,status}} = res.data;
      if(status ==200){
        this.$message.success(msg);
      }else{
        this.$message.error(msg);
      }
    },
    //显示输入框
    showInput() {
      this.inputVisible = true;
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
        //发送请求更新数据
      });
    },
    //增加商品动态属性
    async handleInputConfirm(attr) {
      let inputValue = this.inputValue;
      if (inputValue) {
        attr.attr_vals.push(inputValue);
        const putData = {
          attr_name:attr.attr_name,
          attr_sel:attr.attr_sel,
          attr_vals:attr.attr_vals.join(",")
        };
        //发送请求删除动态属性的参数
        const res = await this.$http.put(`categories/${this.selectedOptions[2]}/attributes/${attr.attr_id}`,putData);
        const {meta:{msg,status}} = res.data;
        if(status ==200){
          this.$message.success(msg);
        }else{
          this.$message.error(msg);
        }
      }
      this.inputVisible = false;
      this.inputValue = '';
    }
  },
}
</script>
<style>
.card{
  height: 100%;
  overflow: auto;
}
.card .alert{
  margin: 10px 0;
}
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>
