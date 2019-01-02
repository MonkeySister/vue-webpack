<template>
<div class="loginForm">
  
  <el-form 
  class="form"
  :label-position="labelPosition" 
  label-width="80px"
  :model="formData">
    <h2>用户登录</h2>
    <el-form-item label="姓名">
      <el-input v-model="formData.username" type="text"></el-input>
    </el-form-item>
    <el-form-item label="密码">
      <el-input v-model="formData.password" type="password"></el-input>
    </el-form-item>
    <el-button type="primary" class="btn" @click.prevent="login()">登录</el-button>
  </el-form>
</div>
</template>
<script>
export default {
  data() {
    return {
      labelPosition: "top",
      formData: {
        username: "",
        password: ""
      }
    };
  },
  methods: {
    // 代码简化
    /* login(){
      //点击发送请求登录
      this.$http.post('login',this.formData).then((res)=>{
        console.log(res);
        const {data:{data,meta:{msg,status}}} = res;
        if(status == 200){
          this.$message.success(msg);
          //成功后跳转到home组件
          this.$router.push({
            name:'home'
          });
        }else{
          this.$message.error(msg);
        }
      })
    } */
    //不想在{}内部获取异步操作的结果
    //在异步操作方法前面加await 
    //在距离异步操作方法最近的外层函数前面加async
    async login(){
      const res = await this.$http.post('login',this.formData);
      console.log(res);
        const {data:{data,meta:{msg,status}}} = res;
        if(status == 200){
          //保存taken数据(将来写其他功能时会用)
          localStorage.setItem('token',data.token);
          this.$message.success(msg);
          //成功后跳转到home组件
          this.$router.push({
            name:'home'
          });
        }else{
          this.$message.error(msg);
        }
    }
  },
};
</script>
<style>
.loginForm{
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #324152;
}
.loginForm .form{
  width: 500px;
  background-color: #ffffff;
  padding: 30px;
  border-radius: 10px;
}
.loginForm .form .btn{
  width: 100%;
}
</style>
