<template>
  <div class="app-container">
    <div class="tab-bar">
         <el-form ref="queryForm" :model="queryForm" label-width="80px" :inline="true" size="small">
            <el-form-item label="红包密码" prop="code">
                <el-input style="width:250px" clearable="" v-model="queryForm.code" placeholder="请输入查询的红包密码"></el-input>
            </el-form-item>
            <el-form-item > 
                <el-button size="small" type="primary" icon="el-icon-search" @click="query">查询</el-button>
                <el-button icon="el-icon-refresh" @click="reset('queryForm')">重置</el-button>
            </el-form-item>
         </el-form>
    </div>
    <el-card class="box-card"> 
        <div class="text item">
            <el-input
                readonly=""
                type="textarea"
                :autosize="{ minRows: 8}"
                placeholder=""
                clearable=""
                v-model="result">
            </el-input>
            <div class="tips">提示:查询红包密码查询红包发行信息和领取状态</div>
        </div>
    </el-card>
  </div>
</template>

<script>
import {queryCode} from '@/api/market/redEnv'
export default {
    data(){
        return{
            result:'',
            queryForm:{
                type:'Query_RedPack',
                code:''
            }
        }
    },
    methods:{
        getList(){
            if(!this.queryForm.code){
                this.$message.warning('输入查询的红包密码')
                return;
            }
            queryCode({},this.queryForm.type,this.queryForm.code).then(res=>{
                this.result=res
            })
        },
        reset(formName){
            this.$refs[formName].resetFields();
            this.result=''
        },
        query(){
            this.getList()
        },
    }
}
</script>

<style lang="scss" scoped>
.tips{
    font-size: 14px;
    margin-top: 10px;
    margin-left: 20px;
}
</style>>