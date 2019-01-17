//引入axios
import axios from 'axios'
import { Message } from 'element-ui';
//在vue中添加一个axios插件,此插件是一个对象
const Http = {};
Http.install = function(Vue) {
    //配置一个基本的url
    axios.defaults.baseURL = 'http://localhost:8888/api/private/v1/';
    // 添加请求拦截器
    axios.interceptors.request.use(function(config) {
        //console.log(config);
        // 在发送请求之前为请求设置请求头
        if (config.url !== "login") {

            config.headers.Authorization = localStorage.getItem("token");
        }
        return config;
    }, function(error) {
        // 对请求错误做些什么
        return Promise.reject(error);
    });
    // 添加响应拦截器
    axios.interceptors.response.use(function (response) {
        //对请求成功做点什么
        //如果响应数据的status不等于200或者201，统一报错
        const { meta: { msg, status } } = response.data;
        if(status !==200 && status !==201){
            Message.error(msg);
        };
        return response;
    }, function (error) {
        // 对响应错误做点什么
        return Promise.reject(error);
    });
    // 4. 添加实例方法
    Vue.prototype.$http = axios;
};

export default Http;