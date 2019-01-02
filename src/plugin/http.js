//引入axios
import axios from 'axios'

//在vue中添加一个axios插件,此插件是一个对象
const Http = {};
Http.install = function (Vue) {
  //配置一个基本的url
  axios.defaults.baseURL = 'http://localhost:8888/api/private/v1/';
  // 4. 添加实例方法
  Vue.prototype.$http = axios;
};
export default Http;