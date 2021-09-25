<template>
  <div class="app-container">
      <div class="tab-bar">
        <el-form ref="queryForm" :model="queryForm" label-width="80px" :inline="true" size="small">
            <el-form-item label="时间范围" prop="time">
                <el-date-picker
                    style="width:250px"
                    v-model="queryForm.time"
                    type="daterange"
                    range-separator="至"
                    value-format="yyyy-MM-dd"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期">
                </el-date-picker>
            </el-form-item>
            <el-form-item label="关键字" prop="search_text">
                <el-input style="width:250px" clearable="" v-model="queryForm.search_text" placeholder="请输入查询关键字"></el-input>
            </el-form-item>
            <el-form-item > 
                <el-button size="small" type="primary" icon="el-icon-search" @click="query">查询</el-button>
                <el-button icon="el-icon-refresh" @click="reset('queryForm')">重置</el-button>
            </el-form-item>
        </el-form>
      </div>
      <el-table
            :data="tableData"
            :header-cell-style="{background:'#FAFAFA',color:'#606266',height:'50px'}"
            border
            stripe
            highlight-current-row
            size="medium"
            class="trace-table"
            style="width: 100%">
            <el-table-column prop="CreateDate" align="center" label="发送时间"></el-table-column>
            <el-table-column prop="UserName" align="center" label="用户名称"></el-table-column>
            <el-table-column prop="ReceiveNumber" align="center" label="手机号码"></el-table-column>
            <el-table-column show-overflow-tooltip prop="SendText" align="center" label="验证短信"></el-table-column>
            <el-table-column show-overflow-tooltip prop="SmsStateValue" align="center" label="验证结果"></el-table-column>
      </el-table>
      <pagination
        v-show="+total>10"
        :total="+total"
        :page.sync="queryForm.page"
        :limit.sync="queryForm.rows"
        @pagination="getList"
        />
  </div>
</template>

<script>
import { getSystemInfo} from '@/api/sysFun/system'
export default {
    data(){
        return{
            total:0,
            queryForm:{
                type:'Log_SendSmsRecord',
                page:1,
                rows:20,
                start:'',
                end:'',
                search_text:undefined,
                time:[]
            },
            tableData:[],
        }
    },
    created(){
        this.getList()
    },
    methods:{
        getList(){
            var arr=Object.assign({},this.queryForm)
            if(arr.time){
                arr.start=arr.time[0]
                arr.end=arr.time[1]
            }
            delete arr.time
            getSystemInfo(arr).then(res=>{
                this.tableData=res.rows
                this.total=res.total
            })
        },
         reset(formName){
            this.$refs[formName].resetFields();
            this.getList()
        },
        query(){
            this.queryForm.page=1
            this.getList()
        },
    }
}
</script>

<style>

</style>