<template>
  <div class="navbar">
    <hamburger :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />

    <breadcrumb class="breadcrumb-container" />

    <div class="right-menu">
      <span>| 授权企业：{{authInfo.companyname}} |<span @click="pwdDialog=true"> 当前用户：管理员</span> |</span>
      <span @click="logout"><i class="el-icon-switch-button" style="margin:0 10px;margin-left:20px"></i>退出</span>
    </div>
    <el-dialog title="修改登录密码" :visible.sync="pwdDialog" width="25%"  @close="pwdDialog=false">
        <el-form :model="pwdForm" ref="pwdForm" label-width="100px">
          <el-form-item label="原始密码：" prop="oldPass">
              <el-input type="password" style="width:90%" size="small" v-model="pwdForm.oldPass" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="新设密码：" prop="oldPass">
              <el-input type="password" style="width:90%" size="small" v-model="pwdForm.newPass" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="重复一次：" prop="oldPass">
              <el-input type="password" style="width:90%" size="small" v-model="pwdForm.repeat" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button size="medium" style="margin-right:60px" type="primary" @click="save('pwdForm')">确 定</el-button>
            <el-button size="medium"  @click="pwdDialog= false">取 消</el-button>
        </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
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
      pwdForm:{
        oldPass:'',
        newPass:'',
        repeat:''
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
    save(){
      if(this.pwdForm.oldPass!=this.pwdForm.newPass){
        this.$message.warning('两次新设的密码输入的不一致')
        return;
      }
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
