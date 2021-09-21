<template>
  <div class="login-container">
    <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" auto-complete="on" label-position="left">
      <div class="login-title">海略科技红包平台1.0</div>
      <el-form-item label="" style="margin-top:50px;width:80%" prop="appid">
        <el-input   v-model="loginForm.appid" placeholder="请输入企业编号">
          <template slot="prepend">
            <i class="el-icon-user"></i>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item label="" style="width:80%;margin-top:25px" prop="account">
        <el-input   v-model="loginForm.account" placeholder="请输入用户账号">
          <template slot="prepend">
            <i class="el-icon-user"></i>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item label="" prop="password" style="width:80%;margin-top:25px">
        <el-input  v-model="loginForm.password" show-password placeholder="请输入密码">
          <template slot="prepend">
            <i class="el-icon-lock"></i>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item style="width:80%;margin:25px 0 50px 0">
        <el-button style="width:100%"  @click.native.prevent="handleLogin" type="primary" >登录</el-button>
      </el-form-item>
    </el-form>
    <div class="copy-right">
      © 2021-present <a href="http://www.hlysj.com" target="_blank" style="color:white;">石家庄海略科技有限公司</a>
    </div>
  </div>
</template>

<script>
import { validUsername } from '@/utils/validate'

export default {
  name: 'Login',
  data() {
    const validateAccount = (rule, value, callback) => {
      if (!validUsername(value)) {
        callback(new Error('请输入用户账号'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (value.length < 3||!value) {
        callback(new Error('请输入3位用户密码'))
      } else {
        callback()
      }
    }
    const validateAppid = (rule, value, callback) => {
      if (value.length < 5||!value) {
        callback(new Error('请输入6位企业编号'))
      } else {
        callback()
      }
    }
    return {
      loginForm: {
        appid: '10098',
        password: '',
        account:''
      },
      loginRules: {
        appid: [{ required: true, trigger: 'blur', validator: validateAppid }],
        account: [{ required: true, trigger: 'blur', validator: validateAccount }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }],
      },
      loading: false,
      passwordType: 'password',
      redirect: undefined
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  methods: {
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.$store.dispatch('user/login', this.loginForm).then((data) => {
            if(data.errcode!="0"){
              this.$message.error(data.errmsg)
            }else{

            this.$router.push({ path: this.redirect || '/' })
            this.loading = false
            }
          }).catch(() => {
            this.loading = false
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>


.login-container {
  min-height: 100%;
  width: 100%;
  // background: url("../../assets/bg-smooth.png");
  background-size:100% 100%;
  position:fixed;
  overflow: hidden;

  .login-form {
    position: absolute;
    width: 450px;
    max-width: 100%;
    margin: 0 auto;
    right: 10%;
    bottom: 25%;
    display: flex;
    flex-direction: column;
    align-items: center;
    background: white;
    overflow: hidden;
    text-align: center;
    border-radius: 6px;
    .login-title{
      width: 100%;
      height: 80px;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 22px;
      font-weight: 500;
      color: gray;
      border-bottom: 1px solid #eeeeee;
    }
  }
  .copy-right{
    position: absolute;
    bottom: 0px;
    display: flex;
    width: 100%;
    justify-content: center;
    color: #eee;
    background: #444;
    background: rgba(0,0,0,0.2);
    padding: 10px;
  }
}
</style>
