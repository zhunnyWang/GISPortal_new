import Vue from 'vue'
import Router from 'vue-router'
// import HelloWorld from '@/components/HelloWorld'
import Login from '../views/login/login.vue'
import GisServer from '../views/main/main.vue'
import Sider from '../views/main/main.sider.vue'
import Main from '../views/main/main.content.vue'

Vue.use(Router)

export default new Router({
    routes: [{
            path: '/',
            component: Login
        },
        {
            path: '/login',
            component: Login
        },
        {
            path: '/gis_server', //
            component: GisServer,
            children: [{
                path: 'welcome',
                components: {
                    content: Main,
                    sider: Sider
                }
            }, ]
        }
    ]
})