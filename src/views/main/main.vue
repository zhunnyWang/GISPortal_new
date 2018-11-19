<template>
    <div class="layout">
        <Layout>
            <Sider ref="side1" hide-trigger collapsible :collapsed-width="78" v-model="isCollapsed" style="overflow-y:auto;">
                <a class="navbar-brand" :class="menuitemClasses">
                 <router-link to="/gis_server/welcome">
                    <Icon type="md-globe" color="white" size="30px"></Icon>
                    <span class="style-iconfont">
                        数据服务
                    </span>
                  </router-link>
                </a>
                <router-view class="view-one" name="sider" :child-msg="isCollapsed"></router-view>
            </Sider>
            <Layout>
                <Header :style="{padding: 0}" class="layout-header-bar">
                    <Icon @click.native="collapsedSider" :class="rotateIcon" :style="{margin: '0 20px 0'}" type="md-menu" size="24"></Icon>
                     
                    <div class="logout">
                       <Dropdown v-bind:style="styleObject" placement="bottom-end" >
                            <br>
                            <a href="javascript:void(0)"  @click="convert">
                                <Icon type="md-planet" size="24"/>
                                2D/3D转换
                            </a>
                            <!-- <p style="font-size:10px;margin-top:8px">用户:{{this.$rootScope.userid}}第{{this.$rootScope.times}}次登录</p> -->
                            <!-- <p style="font-size:10px;margin-top:8px">用户:{{userid}}第{{times}}次登录</p> -->
                            <!-- <br> -->
                            <!-- <p style="font-size:10px;">上一次登录时间:{{this.$rootScope.date}}</p> -->
                            <!-- <p style="font-size:10px;">上一次登录时间:{{date}}</p> -->
                        </Dropdown>
                        <Dropdown v-bind:style="styleObject" placement="bottom-end" >
                            <br>
                            <a href="javascript:void(0)"  @click="logout">
                                <Icon type="md-log-out" size="24"/>
                            </a>
                            <!-- <p style="font-size:10px;margin-top:8px">用户:{{this.$rootScope.userid}}第{{this.$rootScope.times}}次登录</p> -->
                            <!-- <p style="font-size:10px;margin-top:8px">用户:{{userid}}第{{times}}次登录</p> -->
                            <!-- <br> -->
                            <!-- <p style="font-size:10px;">上一次登录时间:{{this.$rootScope.date}}</p> -->
                            <!-- <p style="font-size:10px;">上一次登录时间:{{date}}</p> -->
                        </Dropdown>
                    </div>

                </Header>
                <Content :style="{margin: '20px', background: '#fff', minHeight: '260px'}">
                    <router-view class="view-two" name="content" :child-msg="flag"></router-view>
                </Content>
            </Layout>
        </Layout>
    </div>
</template>
<script>
// import headerVue from './components/header.vue';
export default {//等部导航栏页面
        name: 'App',
        data () {
            return {
                //是否折叠
                isCollapsed: false,
                isLogouting: false,
                userid:"zhunny",
                times:"2",
                date:"2018年8月15日 10:52",
                styleObject:{
                    fontSize:'15px',
                    lineHeight:'10px',
                    textAlign:'right',
                    marginLeft:'15px'
                },
                flag:0
            }
        },
        computed: {
            rotateIcon () {
                return [
                    'menu-icon',
                    this.isCollapsed ? 'rotate-icon' : ''
                ];
            },
            menuitemClasses () {
                return [
                    'menu-item',
                    this.isCollapsed ? 'collapsed-menu' : '',
                    console.log("this.isCollapsed:"+this.isCollapsed)
                ]
            }
        },
        methods: {
            collapsedSider () {
                this.$refs.side1.toggleCollapse();
            },
            logout(){
                //删除cookie并跳到登录页
                this.isLogouting = true;
                //请求后端，比如logout.php
                //成功后删除cookie
                this.delCookie('session');//已修改
                // this.delCookie(this.$rootScope.userid);
                //跳转到登录页
                setTimeout(()=>{
                    this.$router.push('/login/');
                    this.isLogouting = false;
                },1000)
            },
            convert:function(){
                if(this.flag == 1){
                    this.flag = 0;
                }
                else{
                    this.flag = 1;
                }
            }
        },
        // components:{headerVue}
    }
</script>

<style scoped>
    
    .layout{
        border: 1px solid #d7dde4;
        background: #f5f7f9;
        position: relative;
        border-radius: 4px;
        overflow: hidden;
        height:100%;
    }
    .ivu-layout{
        background-color: white !important;
    }
    .ivu-layout-content{
        margin : 0 !important;
    }
    .layout::-webkit-scrollbar{
        display:none
    }
    .ivu-layout.ivu-layout-has-sider {
        height: 100%;
    }
    .ivu-icon-earth:before {
        text-align: center;
    }
    .style-iconfont{
        padding-left:15px;
        color:white;
        width: 120px !important;
        text-align: left;
    }
    .menu-item{
        width:100%;
    }
    .navbar-brand {
        display: inline-block;
        float: none;
        height: auto;
        padding: 0 25px;
        font-size: 20px;
        font-weight: 700;
        line-height: 50px;
        text-align: left;
    }
    .navbar-brand:hover {
        text-decoration: none;
    }
    .layout-header-bar{
        background: #fff;
        box-shadow: 0 1px 1px rgba(0,0,0,.1);
    }
    .layout-logo-left{
        width: 90%;
        height: 30px;
        background: #5b6270;
        border-radius: 3px;
        margin: 15px auto;
    }
    .menu-icon{
        transition: all .3s;
    }
    .rotate-icon{
        transform: rotate(-90deg);
    }
    .menu-item span{
        display: inline-block;
        overflow: hidden;
        width: 120px;
        text-overflow: ellipsis;
        white-space: nowrap;
        vertical-align: bottom;
        transition: width .2s ease .2s;
    }
    .menu-item i{
        transform: translateX(0px);
        transition: font-size .2s ease, transform .2s ease;
        vertical-align: middle;
        font-size: 16px;
    }
    .collapsed-menu span{
        width: 0px !important;
        transition: width .2s ease;
    }
    .collapsed-menu i{
        transform: translateX(5px);
        transition: font-size .2s ease .2s, transform .2s ease .2s;
        vertical-align: middle;
        font-size: 22px;
    }
    .ivu-dropdown-item{
        font-size: 14px !important;
    }
    .ivu-dropdown:hover{
        background-color: #f6f8f8;

    }
    .ivu-dropdown:focus{
        background-color: #f6f8f8;
    }
    .logout{
        display: block;
        float: right;
        padding-right: 5px;
    }
    a{
        color: inherit !important;
    }
    
</style>
