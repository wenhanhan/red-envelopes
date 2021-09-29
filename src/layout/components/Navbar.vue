<template>
  <div class="navbar">
    <hamburger :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />

    <breadcrumb class="breadcrumb-container" />

    <div class="right-menu">
      <span><span @click="baseInfoDialog=true">| 授权企业：{{authInfo.companyname}} |</span><span @click="pwdDialog=true"> 当前用户：管理员</span> |</span>
      <span @click="logout"><i class="el-icon-switch-button" style="margin:0 10px;margin-left:20px"></i>退出</span>
    </div>
    <el-dialog title="修改登录密码" :visible.sync="pwdDialog" width="25%"  @close="pwdDialog=false">
        <el-form :model="pwdForm" ref="pwdForm" label-width="100px" :rules="rule">
          <el-form-item label="原始密码：" prop="_oldpwd">
              <el-input type="password" style="width:90%" size="small" v-model="pwdForm._oldpwd" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="新设密码：" prop="_newpwd">
              <el-input type="password" style="width:90%" size="small" v-model="pwdForm._newpwd" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="重复一次：" prop="reppwd">
              <el-input type="password" style="width:90%" size="small" v-model="pwdForm.reppwd" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button size="medium" style="margin-right:60px" type="primary" @click="save('pwdForm')">确 定</el-button>
            <el-button size="medium"  @click="pwdDialog= false">取 消</el-button>
        </div>
    </el-dialog>
    <el-dialog title="查看企业授权信息" :visible.sync="baseInfoDialog" width="35%"  @close="baseInfoDialog=false">
      <el-form :model="authInfo" ref="authInfo" label-width="100px">
        <el-form-item label="企业编号：" prop="companyid">
          <el-input readonly  style="width:90%" size="small" v-model="authInfo.companyid" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="企业名称：" prop="companyname">
          <el-input readonly="" style="width:90%" size="small" v-model="authInfo.companyname" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="联系人：" prop="linkman">
          <el-input readonly style="width:90%" size="small" v-model="authInfo.linkman" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="联系电话：" prop="linktel">
          <el-input readonly  style="width:90%" size="small" v-model="authInfo.linktel" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="剩余短信：" prop="smscount">
          <el-input readonly style="width:90%" size="small" v-model="authInfo.smscount" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="开通时间：" prop="opendate">
          <el-input readonly style="width:90%" size="small" v-model="authInfo.opendate" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="服务期至" prop="maxdate">
          <el-input readonly style="width:90%" size="small" v-model="authInfo.maxdate" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import {updatePwd} from '@/api/user'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'

export default {
  components: {
    Breadcrumb,
    Hamburger
  },
  data(){
    return{
      pwdDialog:false,
      baseInfoDialog:false,
      pwdForm:{
        _oldpwd:'',
        _newpwd:'',
        reppwd:''
      },
      rule:{
        _oldpwd: [
            { required: true, message: '请输入原始密码', trigger: 'change' }
        ],
        _newpwd: [
            { required: true, message: '请输入新的密码', trigger: 'change' }
        ],
        reppwd:[
            { required: true, message: '请重复输入一次新密码', trigger: 'change' }
        ]
      }
    }
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'avatar',
      'authInfo'
    ])
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    async logout() {
      // await this.$store.dispatch('user/logout')
      await this.$store.dispatch('user/resetToken')
      this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    },
    save(formName){
      if(this.pwdForm._newpwd!=this.pwdForm.reppwd){
        this.$message.warning('两次新设的密码输入的不一致')
        return;
      }
      var params=Object.assign({},this.pwdForm)
      delete params.reppwd
      this.$refs[formName].validate((valid) => {
          if (valid) {
            updatePwd(params,'Base_UpdatePassWord').then(res=>{
              if(res.errcode==0){
                this.$message.success("修改成功")
                //退出登录
                this.$store.dispatch('user/resetToken')
                this.$router.push(`/login?redirect=${this.$route.fullPath}`)
              }else{
                this.$message.error(res.errmsg)
              }
            })
          } else {
            return false;
          }
      });
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0,21,41,.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background .3s;
    -webkit-tap-highlight-color:transparent;

    &:hover {
      background: rgba(0, 0, 0, .025)
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;
    cursor: pointer;
    font-size: 14px;
    margin-right: 20px;
    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background .3s;

        &:hover {
          background: rgba(0, 0, 0, .025)
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
