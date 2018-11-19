<template>
<div :style="loginMain">
    
    <Row style="height:100%" v-show="showLogin">
        <Col span="8" offset="8" :style="longinStyle">
            <div class="login-header">
                <p :style="fontStyle" ><strong>数据服务分系统</strong></p>
            </div>  
            <Form ref="formInline" :model="formInline" :rules="ruleInline" class="login-form">
            <FormItem prop="user" >
                <Input type="text" v-model="formInline.user" placeholder="Username" class="wid">
                    <Icon type="ios-person-outline" slot="prepend"></Icon>
                </Input>
            </FormItem>
            <FormItem prop="password" >
                <Input type="password" v-model="formInline.password" placeholder="Password" class="wid">
                    <Icon type="ios-lock-outline" slot="prepend"></Icon>
                </Input>
            </FormItem>
            <FormItem >
                <Button  @click="handleSubmit('formInline')" :style="buttonStyle" class="wid" long>登录</Button>
            </FormItem>
            <FormItem style="text-align:center">
            <span v-on:click="ToRegister" >没有账号？马上注册</span>
            </FormItem>
            </Form>   
        </Col>
    </Row>
    <Row style="height:100%" v-show="showRegister">
        <Col span="8" offset="8" :style="longinStyle">
            <div class="login-header">
                <p :style="fontStyle" ><strong>数据服务分系统</strong></p>
            </div>  
            <Form ref="newformInline" :model="newformInline" :rules="ruleInline" class="login-form">
            <FormItem prop="user" >
                <Input type="text" v-model="newformInline.user" placeholder="Username" class="wid">
                    <Icon type="ios-person-outline" slot="prepend"></Icon>
                </Input>
            </FormItem>
            <FormItem prop="password" >
                <Input type="password" v-model="newformInline.password" placeholder="Password" class="wid">
                    <Icon type="ios-lock-outline" slot="prepend"></Icon>
                </Input>
            </FormItem>
            <FormItem >
                <Button  @click="newhandleSubmit('newformInline')" :style="buttonStyle" class="wid" long>注册</Button>
            </FormItem>
            <FormItem style="text-align:center">
            <span v-on:click="ToLogin">已有账号？马上登录</span>
            </FormItem>
            </Form>   
        </Col>
    </Row>
    </div>
</template>
<script>
    export default {//登录页面
        data () {
            return {
                formInline: {
                    user: '',
                    password: ''
                },
                ruleInline: {
                    user: [
                        { required: true, message: '请输入用户名', trigger: 'blur' }
                    ],
                    password: [
                        { required: true, message: '请输入密码', trigger: 'blur' },
                        { type: 'string', min: 6, message: '密码的长度不能小于6个字符', trigger: 'blur' }
                    ]
                },
                isLoging: false,
                showLogin: true,
                showRegister: false,
                newformInline: {
                    user: '',
                    password: ''
                },
                longinStyle:{
                    marginTop:'250px',
                    
                },
                loginMain:{
                    backgroundImage:'url(' + require('../../assets/3dcea07c8b1ae994ef4af06b449adced.jpg') + ')',
                    height:'100%'
                },
                fontStyle:{
                    marginTop:'30px',
                    fontSize:'30px'
                },
                buttonStyle:{
                    display: 'block',
                    margin:'0 auto',
                    backgroundColor:'#9790c8',
                    color:'white'
                }
            }
        },
        methods: {
            handleSubmit(name) {//登录功能
                var that = this;
                this.isLoging = true;
                // this.$rootScope.userid = this.formInline.user;
                // this.$rootScope.pwd = this.formInline.pwd;
                this.$refs[name].validate((valid) => {
                    if (valid) {//实际与后台交互时发送post请求，返回response，
                        setTimeout(()=>{
                        //登录状态15天后过期
                        let expireDays = 1000 * 60 * 60 * 1;
                        let nowdate = new Date();
                        console.log(nowdate);//我再给你发个nowdate字段，我请求时你把上次的nowdate给我；
  			            this.setCookie('session','blablablablabla...', expireDays);
                        this.isLoging = false;
                        //登录成功后
  			            this.$router.push('/gis_server/welcome'); 
                          },1000)
                        // var successCallback = function(response){//已修改
                        //     if(response.data.state == 0){
                        //         var date = response.data.date;
                        //         var times = response.data.times;
                        //         that.$rootScope.date = date;
                        //         that.$rootScope.times = times;
                        //         let expireDays = 1000 * 60 * 60 * 1;
  			            //         that.setCookie(that.formInline.user,that.formInline.password, expireDays);
                        //         that.isLoging = false;
                        //         that.$router.push('/gis_server/welcome'); 
                        //         console.log("i am here")
                        //     }
                        //     else if(response.data.state == -1){
                        //         that.$Message.error({
                        //             content:"用户名不存在!",
                        //             duration: 3
                        //         });
                        //     }
                        //     else if(response.data.state == -2){
                        //         that.$Message.error({
                        //             content:"用户名与密码不匹配!",
                        //             duration: 3
                        //         });
                        //     }
                        // }
                        // var erroCallback = function(response){
                        //     that.$Message.error({
                        //         content:"请求失败!",
                        //         duration: 3
                        //     });
                        // }
                        // var params = {
                        //     id: this.formInline.user,
                        //     pwd: this.formInline.password                           
                        // }
                        // var qs = require('qs');
                        // that.$http({
                        //     method:'post',
                        //     dataType:"json",
                        //     url:'http://localhost:8080/DicomDemo/Login',
                        //     data:qs.stringify(params),
                        //     xhrFields: {
                        //         ithCredentials: 'true'
                        //     },
                        //     emulateJSON: true,
                        // }).then(successCallback,erroCallback);   
                    } 
                    else {
                        this.$Message.error('非法输入格式！');
                    }
                })
            },
            newhandleSubmit(name){//注册功能
                var that = this;
                this.isLoging = true;
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        var successCallback = function(response){
                            if(response.data.state == 0){
                                that.$Message.success({
                                    content:"注册成功",
                                    duration: 3
                                });
                                that.ToLogin();
                            }
                            else if(response.data.state == -1){
                                that.$Message.error({
                                    content:"用户已注册!",
                                    duration: 3
                                });
                            }

                        }
                        var erroCallback = function(response){
                            that.$Message.error({
                                content:"请求失败!",
                                duration: 3
                            });
                        }
                        var params = {
                            id: this.newformInline.user,
                            pwd: this.newformInline.password                           
                        }
                        var qs = require('qs');
                        that.$http({
                            method:'post',
                            dataType:"json",
                            url:'http://localhost:8080/DicomDemo/Regist',
                            data:qs.stringify(params),
                            xhrFields: {
                                ithCredentials: 'true'
                            },
                            emulateJSON: true,
                        }).then(successCallback,erroCallback);                           
                    }
                    else {
                        this.$Message.error('非法输入格式！');
                    }
                })
            },
            ToRegister:function(){
                this.showRegister = true;
                this.showLogin = false;
            },
            ToLogin:function(){
                this.showRegister = false;
                this.showLogin = true;
            }
        }
    }
</script>
<style scoped>

.login-form{
    width:40%;
    /* display: inline-block; */
    margin:0 auto;
    height:300px;
}
.login-header{
    height:100px;
    /* border:slategrey 1px solid; */
    text-align: center;
}
.wid{
    height:40px !important;
    /* width: 300px; */
    margin-bottom: 30px
}
.ivu-input{
    height: inherit !important;
}
.ivu-row{
    height:100% !important;
}
span{cursor:pointer;}
span:hover{color:#41b883;}
</style>
<style>


</style>




