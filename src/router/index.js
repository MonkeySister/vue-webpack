import Vue from 'vue'
import Router from 'vue-router'

import Login from '@/components/Login.vue'
import Home from '@/components/home.vue'
import Users from '@/components/users.vue'
import Rights from '@/components/rights.vue'
import Roles from '@/components/roles.vue'
import { Message } from 'element-ui';
Vue.use(Router)


const router = new Router({
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
    console.log(to);
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