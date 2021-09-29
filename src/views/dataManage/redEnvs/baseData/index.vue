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
            <el-form-item label="商品类别" prop="search_type">
                <el-select style="width:250px" size="small" v-model="queryForm.search_type" placeholder="请选择商品类别">
                    <el-option
                        v-for="item in type"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
              </el-select>
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
            <el-table-column prop="CreateDateTime" align="center" label="发放时间"></el-table-column>
            <el-table-column prop="Code" align="center" label="红包密码"></el-table-column>
            <el-table-column prop="Nickname" align="center" label="微信昵称"></el-table-column>
            <el-table-column prop="FansName" align="center" label="登记名称"></el-table-column>
            <el-table-column prop="FansMoblie" align="center" label="手机号码"></el-table-column>
            <el-table-column prop="AwardsTypeValue" align="center" label="红包类型"></el-table-column>
            <el-table-column prop="ExchangeMoney" align="center" label="红包金额"></el-table-column>
            <el-table-column prop="DealerName" align="center" label="销售代理">
                <template slot-scope="scope">
                    <span>{{scope.row.DealerName||'--'}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="StoreName" align="center" label="销售门店">
                <template slot-scope="scope">
                    <span>{{scope.row.StoreName||'--'}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="ProductName" align="center" label="对应商品">
                <template slot-scope="scope">
                    <span>{{scope.row.ProductName||'--'}}</span>
                </template>
            </el-table-column>
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
import { getWeixinFans,exportsLog} from '@/api/market/redEnv'
export default {
    data(){
        return{
            total:0,
            queryForm:{
                type:'AnalysisData',
                page:1,
                rows:20,
                start:'',
                search_type:'',
                end:'',
                search_text:'',
                time:[]
            },
            type:[
                {
                    label:"查询全部",
                    value:'ALL'
                },
                {
                    label:'微信昵称',
                    value:'Nickname'
                },
                {
                    label:'手机号码',
                    value:'FansMoblie'
                },
                {
                    label:'红包金额',
                    value:'ExchangeMoney'
                },
                {
                    label:'商品名称',
                    value:'ProductName'
                },
                {
                    label:'代理名称',
                    value:'DealerName'
                },
                {
                    label:'门店名称',
                    value:'StoreName'
                },
                {
                    label:'红包密码',
                    value:'Code'
                },
                {
                    label:'红包类型',
                    value:'AwardsTypeValue'
                }
            ],
            baseUrl:'http://m.8vv.cn/',
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
            getWeixinFans(arr).then(res=>{
                this.tableData=res.rows
                this.total=res.total
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
                        mode:'REDPACK_ANALYSISDATA'
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