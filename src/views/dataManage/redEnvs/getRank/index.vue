<template>
  <div class="app-container">
      <div class="tab-bar">
        <el-form ref="queryForm" :model="queryForm" label-width="80px" :inline="true" size="small">
            <el-form-item label="时间范围" prop="time">
                <el-date-picker
                    style="width:250px"
                    v-model="queryForm.time"
                    type="daterange"
                    unlink-panels=""
                    range-separator="至"
                    value-format="yyyy-MM-dd"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期">
                </el-date-picker>
            </el-form-item>
            <el-form-item label="统计商品" prop="search_type">
                <el-select style="width:250px" size="small" v-model="queryForm.search_type" placeholder="请选择商品类别">
                    <el-option
                        v-for="item in product"
                        :key="item.Id"
                        :label="item.ProductName"
                        :value="item.Id">
                    </el-option>
              </el-select>
            </el-form-item>
            <el-form-item > 
                <el-button size="small" type="primary" icon="el-icon-search" @click="query">查询</el-button>
                <el-button icon="el-icon-refresh" @click="reset('queryForm')">重置</el-button>
            </el-form-item>
        </el-form>
      </div>
      <el-row style="margin-bottom:15px" type="flex" justify="start">
            <el-button type="primary" icon="el-icon-download" @click="exportLog" size="mini">导出记录</el-button>
      </el-row>
      <el-table
            :data="tableData"
            :header-cell-style="{background:'#FAFAFA',color:'#606266',height:'50px'}"
            border
            stripe
            highlight-current-row
            size="medium"
            class="trace-table"
            style="width: 100%">
            <el-table-column prop="Headimgurl" align="center" width="80px" label="用户头像">
                <template slot-scope="scope">
                    <span><img style="width:32px;height:32px" :src="scope.row.Headimgurl"/></span>
                </template>
            </el-table-column>
            <el-table-column prop="Nickname" align="center" label="微信昵称"></el-table-column>
            <el-table-column prop="FansName" align="center" label="登记名称"></el-table-column>
            <el-table-column prop="FansMoblie" align="center" label="手机号码"></el-table-column>
            <el-table-column prop="FansProvince" align="center" label="所在省份"></el-table-column>
            <el-table-column prop="FansCity" align="center" label="所在城市"></el-table-column>
            <el-table-column prop="FansSex" align="center" label="性别"></el-table-column>
            <el-table-column prop="dealername" align="center" label="所属客户"></el-table-column>
            <el-table-column prop="TotalMoney" align="center" label="累计领取(元)"></el-table-column>
      </el-table>
  </div>
</template>

<script>
import { getWeixinFans,exportsLog} from '@/api/market/redEnv'
import {getCheckInfo} from '@/api/sysFun/system'
export default {
    data(){
        return{
            total:0,
            queryForm:{
                type:'Load_ReceiveRanking',
                start:'',
                search_type:'',
                end:'',
                search_text:100,
                time:[]
            },
            baseUrl:'http://m.8vv.cn/',
            tableData:[],
            product:[]
        }
    },
    created(){
        this.getList()
        this.getProcuct()
    },
    methods:{
        getList(){
            var arr=Object.assign({},this.queryForm)
            if(arr.time){
                arr.start=arr.time[0]
                arr.end=arr.time[1]
            }
            delete arr.time
            getWeixinFans(arr).then(res=>{
                this.tableData=res
            })
        },
        getProcuct(){
            getCheckInfo({},'Base_Product_Select').then(res=>{
                this.product=res
            })
        },
        exportLog(){
            if(this.tableData.length==0){
                this.$message.warning('当前没有需要导出的数据')
                return;
            }
            this.$confirm('确定要导出红包领取数据吗??', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
                }).then(() => {
                    var params={
                        type:'Export',
                        search_text:this.queryForm.search_text,
                        search_type:this.queryForm.search_type,
                        mode:'REDPACK_RECEIVERANKING'
                    }
                    if(this.queryForm.time){
                        params.start=this.queryForm.time[0]
                        params.end=this.queryForm.time[1]
                    }
                    exportsLog(params).then(res=>{
                        window.location.href = this.baseUrl+"Temp/" + res;
                    })
                }).catch(() => {  
            });
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