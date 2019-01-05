<template>
  <el-row>
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>{{level1}}</el-breadcrumb-item>
        <el-breadcrumb-item>{{level2}}</el-breadcrumb-item>
      </el-breadcrumb>
    </el-row>
</template>
<script>
export default {
  //通过name给组件命名
  //组件的名字右组件的创建者命名，而不是由使用者命名
  name:"my-bread",
  //来自其他组件的传值要用props接收
  /* 
  1.props是选项
  2.props值可以使字符串数组
  3.props中的数据和data中的数据用法一样
  4.props中的数据的值来源于外部
   */
  props:["level1","level2"]
}
</script>
<style>

</style>

