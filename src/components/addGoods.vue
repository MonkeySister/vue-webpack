<template>
  <el-card class="card">
    <my-bread level1="商品管理" level2="商品列表" class="bread"></my-bread>
    <el-row>
      <el-col :span="24"><el-alert title="添加商品信息" type="info" center show-icon></el-alert></el-col>
    </el-row>
    <!-- 步骤条 -->
    <el-steps :active="1*active" align-center class="steps">
      <el-step title="基本信息" icon="el-icon-edit"></el-step>
      <el-step title="商品参数" icon="el-icon-share"></el-step>
      <el-step title="商品属性" icon="el-icon-setting"></el-step>
      <el-step title="商品图片" icon="el-icon-picture"></el-step>
      <el-step title="商品内容" icon="el-icon-goods"></el-step>
    </el-steps>
    <el-form :model="formData" status-icon label-width="100%"  label-position="top" class="demo-ruleForm">
      <!-- tab -->
      <el-tabs @tab-click="changeTab()" tab-position="left" style="height: 100%;" v-model="active">
        <el-tab-pane name="1" label="基本信息">
          <el-form-item label="商品名称">
            <el-input v-model="formData.goods_name"></el-input>
          </el-form-item>
            <el-form-item label="商品价格">
            <el-input v-model="formData.goods_price"></el-input>
          </el-form-item>
          <el-form-item label="商品重量">
            <el-input v-model="formData.goods_weight"></el-input>
          </el-form-item>
          <el-form-item label="商品数量">
            <el-input v-model="formData.goods_number"></el-input>
          </el-form-item>
          <el-form-item label="商品分类">
            <!-- 
              1.options:数据源
              2.selectedOptions2三级选择元素，为数组，默认绑定的数据为默认显示的数据
              3.change改变触发事件
              4.props配置选项={label/value/children}
              5.clearable清除
             -->
            <el-cascader
              expand-trigger="hover"
              :options="options"
              clearable
              :props="defaultProp"
              v-model="selectedOptions"
              @change="handleChange"
              >
            </el-cascader>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane name="2" label="商品参数">
          <!-- 动态获取参数 -->
          <el-form-item :label="item1.attr_name" v-for="(item1,i) in arrAttrMany" :key="i">
            <!-- 复选框 -->
              <el-checkbox-group v-model="item1.attr_vals">
                <el-checkbox border :label="item2" v-for="(item2,i) in item1.attr_vals" :key="i"></el-checkbox>
              </el-checkbox-group>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane name="3" label="商品属性">
          <el-form-item :label="item.attr_name" v-for="(item, i) in arrAttrOnly" :key="i">
            <el-input v-model="item.attr_vals"></el-input>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane name="4" label="商品图片">
          <!-- 
            1.action 图片上穿的地址
            2.header 设置头部
            3.on-remove 移除图片时自动调用的钩子函数
            :file-list="fileList"
           -->
          <el-upload
            class="upload-demo"
            action="http://localhost:8888/api/private/v1/upload"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :on-success="handleSuccess"
            list-type="picture"
            :headers="heasers">
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>
        </el-tab-pane>
        <el-tab-pane name="5" label="商品内容">
          <el-form-item>
            <el-button type="success" @click="addGoods()">添加商品</el-button>
            <!-- 富文本编辑器 -->
            <quill-editor v-model="formData.goods_introduce"></quill-editor>
          </el-form-item>
        </el-tab-pane>
      </el-tabs>
    </el-form>
    
  </el-card>
</template>
<script>
//引入富文本编辑器
// require styles
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

import { quillEditor } from 'vue-quill-editor'
export default {
  data() {
    return {
      active: "1",
      formData: {
        goods_name:"",
        goods_price:"",
        goods_number:"",
        goods_weight:"",
        goods_introduce:"",
        //商品分类-级联选择器的三级分了类
        goods_cat:"",
        //商品图片,图片上传，图片的临时路径
        pics:[],
        //商品呢参数，动态参数加静参数
        //attrs:[{attr_id:?,attr_value:?}]
        attrs:[]
      },
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
      //动态商品参数数组
      arrAttrMany: [],
      //静态商品参数数组
      arrAttrOnly:[],
      //上传图片的头部设置
      heasers:{
        Authorization:localStorage.getItem('token')
      }
    };
  },
  created() {
    this.getCategories();
  },
  components: {
    quillEditor
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
    //级联选择器改变调用事件
    handleChange(){},
    //tab改变时触发，获取商品参数数据-动态参数数据
    //点击第二个时触发
    async changeTab(){
      //获取三级分类的动态参数
      if(this.active === "2"){
        //id是分类id   cat_id
        if(this.selectedOptions.length === 3){
          const res = await this.$http.get(`categories/${this.selectedOptions[2]}/attributes?sel=many`);
          //console.log(res);
          this.arrAttrMany = res.data.data;
          this.arrAttrMany.forEach((items) => {
            items.attr_vals = items.attr_vals.length ===0?[]:items.attr_vals.trim().split(",");
            //console.log(items);
          });
          //console.log(this.arrAttrMany);
        }else{
          this.$message.warning("请选择三级分类");
        }
        
      };
      //获取三级分类的静态参数
      if(this.active === "3"){
        if(this.selectedOptions.length === 3){
          const res = await this.$http.get(`categories/${this.selectedOptions[2]}/attributes?sel=only`);
          console.log(res);
          this.arrAttrOnly = res.data.data;
        }else{
          this.$message.warning("请选择三级分类");
        };
        //console.log(this.arrAttrOnly);
      }
      //合并静态和动态数组
      const arr1 = this.arrAttrMany.map(item=>{
        return {attr_id:item.attr_id,attr_values:item.attr_vals};
      });
      const arr2 = this.arrAttrOnly.map(item=>{
        return {attr_id:item.attr_id,attr_values:item.attr_vals};
      });
      this.formData.attrs = [...arr1,...arr2];
      //console.log(this.formData.attrs);
    },
    //图片上传时的方法
    handlePreview(file){
     //console.log(file);
    },
    handleRemove(file,fileList){
      //console.log(file);
      //file.response.data.tem_path 图片移出的临时路径
      //当移出图片时同时从数组中移出
      const index = this.formData.pics.findIndex((item)=>{
        //遍历数组返货符合条件的数组的索引
        return item.pic === file.response.data.tem_path;
      });
      this.formData.pics.splice(index,1);
      //console.log(this.formData.pics);
    },
    handleSuccess(response,file){
      //console.log(response,file);
      //response.data.tmp_path 图片临时上传的路径 
      this.formData.pics.push({
        pic:response.data.tmp_path
      });
    },
    //点击添加商品
    async addGoods(){
      //goods_name	商品名称	不能为空
      // goods_price	价格	不能为空
      // goods_number	数量	不能为空
      // goods_weight	重量	不能为空
      // goods_introduce	介绍	可以为空
      // goods_cat	以为','分割的分类列表	不能为空selectedOptions
      // pics	上传的图片临时路径（对象）	可以为空
      // attrs	商品的参数（数组）

      //发送请求前数据的处理
      this.formData.goods_cat = this.selectedOptions.join(",");
      const res = await this.$http.post('goods',this.formData);
      console.log(res);
      const {data,meta:{msg,status}} = res.data;
      if(status == 201){
        this.$message.success(msg);
        this.$router.push({
          name:"goods"
        })
      }else{
        this.$message.error(msg);
      }
    }
  },
};
</script>
<style>
.card {
  height: 100%;
  overflow: auto;
}
.card .bread,
.card .steps {
  margin: 10px 0;
}
.ql-container{
  height: 200px;
}
</style>
