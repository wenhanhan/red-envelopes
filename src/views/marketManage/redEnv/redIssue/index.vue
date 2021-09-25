<template>
  <div class="app-container">
      <div class="tab-bar">
        <el-form ref="queryForm" :model="queryForm" label-width="80px" :inline="true" size="small">
            <el-form-item label="发行日期" prop="time">
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
            <el-form-item label="关键字" prop="search_text">
                <el-input style="width:250px" clearable="" v-model="queryForm.search_text" placeholder="关键字…"></el-input>
            </el-form-item>
            <el-form-item > 
                <el-button size="small" type="primary" icon="el-icon-search" @click="query">查询</el-button>
                <el-button icon="el-icon-refresh" @click="reset('queryForm')">重置</el-button>
            </el-form-item>
        </el-form>
      </div>
      <el-row style="margin-bottom:15px" type="flex" justify="start">
            <el-button type="primary" icon="el-icon-circle-plus-outline" @click="addIssue" size="mini">新增发行</el-button>
      </el-row>
      <el-table
            :data="tableData"
            :header-cell-style="{background:'#FAFAFA',color:'#606266',height:'50px'}"
            border
            stripe
            show-summary
            :summary-method="getSummaries"
            highlight-current-row
            size="medium"
            class="trace-table"
            style="width: 100%">
            <el-table-column prop="OrderNum" align="center" show-overflow-tooltip label="发行单号"></el-table-column>
            <el-table-column prop="StartCode" align="center" width="80px" label="起始序号"></el-table-column>
            <el-table-column prop="EndCode" align="center" label="终止序号"></el-table-column>
            <el-table-column prop="CodeCount" width="80px" align="center" label="发行总量"></el-table-column>
            <el-table-column prop="UseCount" width="80px" align="center"  label="已领数量"></el-table-column>
            <el-table-column prop="ProductName" show-overflow-tooltip width="80px" align="center"  label="关联商品"></el-table-column>
            <el-table-column prop="MaxDate" align="center" label="截止日期"></el-table-column>
            <el-table-column prop="RedPackTypeValue" align="center" label="红包类型"></el-table-column>
            <el-table-column prop="RedPackMoney" align="center" label="红包金额"></el-table-column>
            <el-table-column show-overflow-tooltip prop="CreateDate" align="center" label="发行时间"></el-table-column>
            <el-table-column prop="FansSysValue" align="center" label="用户类型"></el-table-column>
            <el-table-column show-overflow-tooltip prop="Remark" align="center" label="备注信息"></el-table-column>
            <el-table-column label="操作" align="center" fixed="right" width="280px">
              <template slot-scope="scope">
                <el-button
                size="mini"
                icon="el-icon-edit"
                type="primary"
                @click="updateIssue(scope.row)">修改</el-button>
                <el-button
                size="mini"
                icon="el-icon-delete"
                type="danger"
                @click="deleteIssue(scope.row)">删除</el-button>
                <el-button
                size="mini"
                icon="el-icon-download"
                type="primary"
                @click="exportLog(scope.row)">导出</el-button>
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
    <el-dialog :title="issueTitle" :visible.sync="issueDialog" width="40%"  @close="issueDialog=false">
        <el-form :model="issueForm" ref="issueForm" label-width="100px">
            <el-row>
                <el-col :span="12">
                    <el-form-item label="起始序号" prop="_start">
                        <el-input size="small" v-model="issueForm._start" autocomplete="off"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="终止序号" prop="_end">
                        <el-input size="small" v-model="issueForm._end" autocomplete="off"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="红包类型" prop="_redpacktype">
                            <el-select size="small" style="width:100%" @change="redpacktype" v-model="issueForm._redpacktype" placeholder="请选择红包类别">
                                <el-option
                                    v-for="item in redType"
                                    :key="item.Id"
                                    :label="item.SysValue"
                                    :value="item.Id">
                                </el-option>
                            </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="红包金额" prop="_money">
                        <el-input size="small" :readonly="issueForm._redpacktype==38||issueForm._redpacktype==36" v-model="issueForm._money" autocomplete="off"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="用户类型" prop="_getweixintype">
                        <el-select style="width:100%" size="small" v-model="issueForm._getweixintype" placeholder="请选择用户类别">
                            <el-option
                                v-for="item in role"
                                :key="item.ID"
                                :label="item.SysValue"
                                :value="item.ID">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="12" v-if="issueForm._redpacktype==48">
                    <el-form-item label="裂变次数" prop="_totalpeople">
                        <el-input size="small" v-model="issueForm._totalpeople" placeholder="裂变次数3~20之间" autocomplete="off"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12" v-if="issueForm._redpacktype==36">
                    <el-form-item label="最小金额" prop="_startint">
                        <el-input size="small" v-model="issueForm._startint" autocomplete="off"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12" v-if="issueForm._redpacktype==36">
                    <el-form-item label="最大金额" prop="_endint">
                        <el-input size="small" v-model="issueForm._endint" autocomplete="off"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="截止日期" prop="_maxdate">
                        <el-date-picker size="small" type="date" value-format="yyyy-MM-dd" placeholder="选择日期" v-model="issueForm._maxdate" style="width: 100%;"></el-date-picker>
                    </el-form-item>
                </el-col>
                <el-col :span="24">
                    <el-form-item label="关联产品" prop="_productid">
                        <el-select style="width:100%" size="small" v-model="issueForm._productid" placeholder="请选择关联产品">
                            <el-option
                                v-for="item in product"
                                :key="item.Id"
                                :label="item.ProductName"
                                :value="item.Id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="24">
                    <el-form-item label="备注说明" prop="_remark">
                        <el-input size="small" 
                        type="textarea" 
                        :autosize="{ minRows: 2}" 
                        autocomplete="off" 
                        placeholder="备注说明" 
                        v-model="issueForm._remark">
                        </el-input>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button size="medium" style="margin-right:60px" type="primary" @click="save('issueForm')">确 定</el-button>
            <el-button size="medium"  @click="issueDialog= false">取 消</el-button>
        </div>
    </el-dialog>
  </div>
</template>
<script>
import { getWeixinFans,addWeixinFans,getRedPackType,exportsLog} from '@/api/market/redEnv'
import {getPdaModel,getCheckInfo} from '@/api/sysFun/system'
export default {
    data(){
        return{
            total:0,
            queryForm:{
                type:'PromotersIssued',
                page:1,
                rows:20,
                start:'',
                end:'',
                search_text:undefined,
                time:[]
            },
            tableData:[],
            product:[],
            role:[],
            issueDialog:false,
            prizeDialog:false,
            prizeTitle:'',
            issueTitle:'',
            issueForm:{
                _id:0,
                _start:'',
                _end:'',
                _money:'',
                _getweixintype:'',
                _redpacktype:'',
                _productid:'',
                _maxdate:'',
                _remark:'',
                _startint:'',
                _endint:'',
                _totalpeople:3
            },
            prizeForm:{
                IssuedCount:'',
                RedPackType:'',
                RedPackMoney:'',
                DetailId:0
            },
            baseUrl:'http://h.8vv.cn/',
            issueModel:[
                {
                    SysValue:'系统随机',
                    ID:154  
                },
                {
                    SysValue:'权重随机',
                    ID:155  
                }, 
            ],
            redType:[],
            prizeData:[],
            Id:0
        }
    },
    created(){
        this.getList()
        this.getProduct()
        this.getRole()
        this.getRedType()
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
        getRedType(){
            getRedPackType({},'Load_RedPackType',0).then(res=>{
                this.redType=res
            })
        },
        redpacktype(val){
            if(val==38||val==36){
                this.issueForm._money=0
            }
            if(val==48){
                this.issueForm._totalpeople=3
            }
        },
        getProduct(){
            getCheckInfo({},'Base_Product_Select').then(res=>{
                this.product=res
            })
        },
        getRole(){
             getPdaModel({},'Base_LoadSystemParm',42).then(res=>{
                this.role=res
            })
        },
        exportLog(row){
            this.$confirm('确认要导出当前发行订单的红包领取记录吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
                }).then(() => {
                    var params={
                        type:'Export',
                        search_text:row.OrderNum,
                        search_type:row.Id,
                        mode:'redpack_exchangepromoters'
                    }
                    exportsLog(params).then(res=>{
                        window.location.href = this.baseUrl+"Temp/" + res;
                    })
                }).catch(() => {  
            });
        },
        addIssue(){
            this.issueForm={}
            this.issueTitle='微信红包发行'
            this.issueForm._id=0
            this.issueForm._type=1
            this.issueDialog=true
        },
        updateIssue(row){
            this.prizeData=[]
            this.issueTitle=`修改[${row.OrderNum}]红包发行`
            this.issueForm._id=row.Id
            this.issueForm._type=2
            this.issueForm._start=row.StartCode
            this.issueForm._maxdate=row.MaxDate
            this.issueForm._productid=row.ProductId
            this.issueForm._end=row.EndCode
            this.issueForm._redpacktype=row.RedPackType
            this.issueForm._money=row.RedPackMoney
            this.issueForm._getweixintype=row.FansSysValue
            this.issueForm._startint=row.StartInterval
            this.issueForm._endint=row.EndInterval
            this.issueForm._totalpeople=row.TotalPeople
            this.issueForm._remark=row.Remark
            this.issueDialog=true
        },
        deleteIssue(row){
            var arr={
                _type:3,
                _id:row.Id,
            }
            this.$confirm(`确定删除[${row.OrderNum}]发行吗?`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
                }).then(() => {
                    addWeixinFans(arr,'PromotersIssued').then(res=>{
                        if(res.errcode==0){
                            this.$message.success('删除成功')
                            this.getList()
                        }else{
                            this.$message.error(res.errmsg)
                        }
                    })
                }).catch(() => {    
            });
        },
        save(){
            var arr=Object.assign({},this.issueForm)
            if(Number(arr._id)==0){
                //新增
                addWeixinFans(arr,'PromotersIssued').then(res=>{
                    if(res.errcode==0){
                        this.$message.success('新增成功')
                        this.issueDialog=false
                        this.getList()
                    }else{
                        this.$message.error(res.errmsg)
                    }
                })
            }else{
                //修改
                var role=this.role.filter(item=>{
                    return item.SysValue==arr._getweixintype
                })
                arr._getweixintype=role[0]['ID']
                addWeixinFans(arr,'PromotersIssued').then(res=>{
                    if(res.errcode==0){
                        this.$message.success('修改成功')
                        this.issueDialog=false
                        this.getList()
                    }else{
                        this.$message.error(res.errmsg)
                    }
                })
            }
        },
        reset(formName){
            this.$refs[formName].resetFields();
            this.getList()
        },
        query(){
            this.queryForm.page=1
            this.getList()
        },
        getSummaries(param){
            const { columns, data } = param;
            const sums = [];
            columns.forEach((column, index) => {
            if (index === 0) {
            sums[index] = '合计';
            return;
            }
            const values = data.map(item => Number(item[column.property]));
            if (column.property === 'CodeCount'||column.property === 'UseCount') {
            sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr);
            if (!isNaN(value)) {
            return prev + curr;
            } else {
            return prev;
            }
            }, 0);
            sums[index];
            } else {
            sums[index] = '--';
            }
            });

            return sums;
        }
    }
}
</script>

<style lang="scss" scoped>
.dialog-footer{
    display: flex;
    width: 100%;
    align-items: center;
    justify-content: center;
}
</style>>