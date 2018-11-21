// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import iView from 'iview'
import 'iview/dist/styles/iview.css'
import { Tree } from 'element-ui';
import axios from 'axios'
import qs from 'qs'
import global_ from './services/global'
import contentmenu from 'v-contextmenu'
import 'v-contextmenu/dist/index.css'
import x2js from 'x2js' //xml数据处理插件
import layerService from './services/layerGlobal'
import sheetService from './services/sheetGlobal'
// import Cesium from 'cesium/Cesium'
// import 'cesium/Widgets/widgets.css'

Vue.config.productionTip = false
Vue.component(Tree.name, Tree)
Vue.use(iView);
Vue.use(contentmenu);
Vue.use(layerService); //全局函数
Vue.use(sheetService);

Vue.prototype.$http = axios;
Vue.prototype.$qs = qs;
Vue.prototype.GLOBAL = global_;
Vue.prototype.$x2js = new x2js() //创建x2js对象，挂到vue原型上

//设置cookie,增加到vue实例方便全局调用
//vue全局调用的理由是，有些组件所用到的接口可能需要session验证，session从cookie获取
//当然，如果session保存到vuex的话除外
Vue.prototype.setCookie = (c_name, value, expiredays) => {
    var exdate = new Date();　　　　
    exdate.setDate(exdate.getDate() + expiredays);　　　　
    document.cookie = c_name + "=" + escape(value) + ((expiredays == null) ? "" : ";expires=" + exdate.toGMTString());
}

//获取cookie、
function getCookie(name) {
    var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
    if (arr = document.cookie.match(reg))
        return (arr[2]);
    else
        return null;
}
Vue.prototype.getCookie = getCookie;

//删除cookie
Vue.prototype.delCookie = (name) => {
    var exp = new Date();
    exp.setTime(exp.getTime() - 1);
    var cval = getCookie(name);
    if (cval != null)
        document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
}

/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    components: { App },
    template: '<App/>',
    //进入页面时
    created() {
        this.checkLogin();
    },
    //监听路由检查登录
    watch: {
        "$route": 'checkLogin'
    },
    methods: {
        checkLogin() {
            //检查是否存在session
            // cookie操作方法在源码里有或者参考网上的即可
            if (!this.getCookie(('session'))) { //已修改 
                this.$router.push('/login');
            }
            // if (!this.getCookie(this.$rootScope.userid)) {
            //     //如果没有登录状态则跳转到登录页
            //     this.$router.push('/login');
            // }
        }
    }
})