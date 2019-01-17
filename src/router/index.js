import Vue from 'vue'
import VueRouter from 'vue-router'
import { Message } from 'element-ui';

// 路由懒加载模式，改变首屏加载过于缓慢的问题
//改成使用哪个组件加载哪个组件
//const Foo = () => Promise.resolve({ /* component definition */ }) 
const Login = () => import('@/components/Login.vue');    
const Home  = () => import('@/components/home.vue');    
const Users = () => import('@/components/users.vue');    
const Rights = () => import('@/components/rights.vue');    
const Roles = () => import('@/components/roles.vue');    
const Goods = () => import('@/components/goods.vue');    
const addGoods = () => import('@/components/addGoods.vue');    
const Params = () => import('@/components/params.vue');    
const Categories = () => import('@/components/goodscate.vue');    
const Orders = () => import('@/components/order.vue');    
const Report = () => import('@/components/report.vue');   
//这样写后在打包 时每个组件会变成一个对应的js文件，否者会变成一个大的js文件 
Vue.use(VueRouter);


const router = new VueRouter({
    routes: [{
            name: 'home',
            path: '/',
            component: Home,
            children: [{
                    name: 'users',
                    path: '/users',
                    component: Users
                },
                {
                    name: 'rights',
                    path: '/rights',
                    component: Rights
                },
                {
                    name: 'roles',
                    path: '/roles',
                    component: Roles
                },
                {
                    name: 'goods',
                    path: '/goods',
                    component: Goods
                },
                {
                    name: 'addGoods',
                    path: '/addGoods',
                    component: addGoods
                },
                {
                    name: 'params',
                    path: '/params',
                    component: Params
                },
                {
                    name: 'categories',
                    path: '/categories',
                    component: Categories
                },
                {
                    name: 'orders',
                    path: '/orders',
                    component: Orders
                },
                {
                    name: 'report',
                    path: '/reports',
                    component: Report
                }
            ]
        },
        {
            name: 'login',
            path: '/login',
            component: Login
        }
    ]
});
//路由生效之前拦截路由进行配置
router.beforeEach((to, from, next) => {
    // console.log("路由拦截器");
    //在这里可以配置路由
    //如果要去的是登录 -> 继续执行路由配置 next()
    //如果要去的是home -> 判断有没有token -> 有next() ->没有去login
    //console.log(to);
    if (to.name === "login") {
        next();
    } else {
        const token = localStorage.getItem('token');
        if (!token) {
            Message.warning("请先登录");
            router.push({
                name: 'login'
            });
        } else {
            next();
        }
    };
});

export default router;