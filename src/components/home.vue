<template>
  <el-container class="container">
    <el-header class="header">
      <el-row>
        <el-col :span="4">
          <img src="@/assets/img/logo.png" alt="">
        </el-col>
        <el-col :span="19">
          <h2>电商后台管理系统</h2>
        </el-col>
        <el-col :span="1">
          <a href="javascript:;" @click.prevent="loginOut()">退出</a>
        </el-col>
      </el-row>
    </el-header>
    <el-container>
      <el-aside width="200px"  class="aside">
        <el-menu
          default-active="1"
          class="el-menu-vertical-demo"
          unique-opened>
          <el-submenu index="1">
            <template slot="title">
              <i class="el-icon-menu"></i>
              <span>用户管理</span>
            </template>
            <el-menu-item index="1-1"><i class="el-icon-location"></i>用户列表</el-menu-item>
          </el-submenu>
          <el-submenu index="2">
            <template slot="title">
              <i class="el-icon-menu"></i>
              <span>权限管理</span>
            </template>
            <el-menu-item index="2-1"><i class="el-icon-location"></i>角色列表</el-menu-item>
            <el-menu-item index="2-2"><i class="el-icon-location"></i>权限列表</el-menu-item>
          </el-submenu>
          <el-submenu index="3">
            <template slot="title">
              <i class="el-icon-menu"></i>
              <span>商品管理</span>
            </template>
            <el-menu-item index="3-1"><i class="el-icon-location"></i>商品列表</el-menu-item>
            <el-menu-item index="3-2"><i class="el-icon-location"></i>分类参数</el-menu-item>
            <el-menu-item index="3-3"><i class="el-icon-location"></i>商品分类</el-menu-item>
          </el-submenu>
          <el-submenu index="4">
            <template slot="title">
              <i class="el-icon-menu"></i>
              <span>订单管理</span>
            </template>
            <el-menu-item index="4-1"><i class="el-icon-location"></i>订单列表</el-menu-item>
          </el-submenu>
          <el-submenu index="5">
            <template slot="title">
              <i class="el-icon-menu"></i>
              <span>数据统计</span>
            </template>
            <el-menu-item index="5-1"><i class="el-icon-location"></i>数据报表</el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main class="main">Main</el-main>
    </el-container>
  </el-container>
</template>
<script>
export default {
  beforeCreate() {
    //在组件渲染之前判断有没有localstorage,
    //如果没有提示先登录
    if(!localStorage.getItem('token')){
      this.$message.warning("请先登录！");
      this.$router.push({
        name:"login"
      })
    }
  },
  methods: {
    //退出登录功能
    loginOut() {
      this.$confirm("确定退出登录？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          //清除session
          localStorage.clear();
          this.$message.success("退出成功!");
          //跳转到登录页
          this.$router.push({
            name: "login"
          });
        })
        .catch(() => {
          this.$message.error("已取消");
        });
    }
  }
};
</script>
<style>
.container {
  height: 100%;
}
.container .header {
  background-color: #b3c0d1;
}
.container .header h2,
.container .header a {
  line-height: 60px;
  text-align: center;
}
</style>
