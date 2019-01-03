// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
//导入自己创建的发送请求的插件
import Http from './plugin/http'

import App from './App'
import router from './router'
//导入时间格式的包
import moment from 'moment'
//引入全局样式文件
import '@/assets/css/index.css'



// vue 在控制台有一些警告信息
Vue.config.productionTip = false;

//使用ElementUI插件
Vue.use(ElementUI);
//使用http插件
Vue.use(Http);
//写一个全局的过滤器
Vue.filter('fmtData', (v) => {
    return moment(v).format("YYYY-MM-DD");
});
/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    components: {
        App
    },
    template: '<App/>'
})