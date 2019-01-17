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
          unique-opened
          :router="true">
          <el-submenu :index="''+item1.order" v-for="item1 in menus" :key="item1.id">
            <template slot="title">
              <i class="el-icon-menu"></i>
              <span>{{item1.authName}}</span>
            </template>
            <el-menu-item :index="item2.path" v-for="item2 in item1.children" :key="item2.id"><i class="el-icon-location"></i>{{item2.authName}}</el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main class="main">
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
export default {
  data() {
    return {
      menus:[]
    }
  },
/*   //在创建元素之前先查询有没有有效的token
  beforeCreate() {
    //在组件渲染之前判断有没有localstorage,
    //如果没有提示先登录
    if(!localStorage.getItem('token')){ 
      this.$router.push({
        name:"login"
      });
      this.$message.warning("请先登录！");
    }
  }, */
  created() {
    this.getMunes();
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
    },
    //动态获取菜单
    async getMunes(){
      const res = await this.$http.get('menus');
      //console.log(res);
      this.menus = res.data.data;
    }
  }
};
</script>
<style scoped>
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
.container .main{
  background-color: #eeeaea;
  
  overflow: hidden;
}
</style>
