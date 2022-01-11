<template>
    <div class="login_contanier">
        <div class="login_box">
            <!-- 头像区域 -->
            <div class="avatar_box">
                <img src="../assets/logo.png" alt="">
            </div>
            <!-- 登录表单区域 -->
            <el-form  ref="loginFormRef" :model="loginForm" :rules="loginFormRules" class="login_form">
                <el-form-item prop="username">
                    <el-input prefix-icon="iconfont icon-user" v-model="loginForm.username"></el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input prefix-icon="iconfont icon-password" v-model="loginForm.password" type="password"></el-input>
                </el-form-item>
                <el-form-item class="btns">
                    <el-button type="primary" @click="login">登录</el-button>
                    <el-button type="info" @click="resetForm">重置</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
export default {
    data(){
        return{
            // 登录表单的数据绑定对象
            loginForm:{
                username:'', //admin
                password:'', //111111
            },
            // 登录表单的验证规则对象
            loginFormRules:{
                username:[
                   { required: true, message: '请输入用户名', trigger: 'blur' },
                   { min: 2, max: 10, message: '长度在2到10个字符', trigger: 'blur' }
                ],
                password:[
                    { required: true, message: '请输入密码', trigger: 'blur' },
                ]
            }
        }
    },
    methods:{
        // 点击重置按钮，重置登录表单
        resetForm(){
            this.$refs.loginFormRef.resetFields();
        },
        // 点击登录按钮，进行表单的验证
        login(){
            this.$refs.loginFormRef.validate(async valid =>{
                if(!valid) return;
                const {data:res} = await this.$http.post('user/login',this.loginForm) //data:res 解构后台返回的result 只要data，重命名data为res
                
                if (res.status !== 200) return this.$message.error('登录失败！');
                this.$message.success('登录成功')
                // 1.将登录成功之后的token保存到客户端的sessionStorage中
                //    1.1项目中除了登录之外的其他API接口，必须在登录之后才能访问
                //    1.2token只应在当前网站打开期间生效，所以将token保存在sessionStorage中
                window.sessionStorage.setItem("token",res.result)
                // 2.通过编程式导航跳转到后台主页，路由地址是 /home
                this.$router.push('/home')
            })
        }
    }
}
</script>

<style lang='scss' scoped>
.login_contanier{
    background-color: #2b4b6b;
    height: 100%;
}
.login_box{
    width: 450px;
    height: 300px;
    background-color: #fff;
    border-radius: 3px;
    position: absolute;
    left: 50%;
    top: 50%;
    /* 位移 x y 轴 */
    transform: translate(-50%,-50%); 

  .avatar_box{
        height: 130px;
        width: 130px;
        border:1px solid #eee;
        border-radius: 50%;
        padding: 10px;
        box-shadow: 0 0 10px #ddd;
        position: absolute;
        left: 50%;
        transform: translate(-50%,-50%);
        background-color: #fff;
        img{
            width: 100%;
            height: 100%;
            border-radius: 50%;
            background-color: #eee;
        }
    }
}
.login_form{
    position: absolute;
    bottom: 0;
    width: 100%;
    padding: 0 20px;
    box-sizing: border-box;
    .btns{
    float: right;
    }   
}


  
</style>