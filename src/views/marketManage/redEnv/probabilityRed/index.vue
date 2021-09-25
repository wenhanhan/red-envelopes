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
            <el-table-column prop="IssuedCount" width="80px" align="center" label="发行总量"></el-table-column>
            <el-table-column prop="UseCount" width="80px" align="center"  label="已领数量"></el-table-column>
            <el-table-column prop="MaxDate" align="center" label="截止日期"></el-table-column>
            <el-table-column prop="RandTypeValue" align="center" label="概率模式"></el-table-column>
            <el-table-column show-overflow-tooltip prop="ProductName" align="center" label="关联产品"></el-table-column>
            <el-table-column prop="ProductNorm" align="center" label="产品规格"></el-table-column>
            <el-table-column show-overflow-tooltip prop="CreateDate" align="center" label="发行时间"></el-table-column>
            <el-table-column prop="FansSysValue" align="center" label="用户类型"></el-table-column>
            <el-table-column show-overflow-tooltip prop="Remark" align="center" label="备注信息"></el-table-column>
            <el-table-column label="操作" align="center" fixed="right" width="200px">
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
                    <el-form-item label="起始序号" prop="StartCode">
                        <el-input size="small" v-model="issueForm.StartCode" autocomplete="off"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="终止序号" prop="EndCode">
                        <el-input size="small" v-model="issueForm.EndCode" autocomplete="off"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="用户类型" prop="GetWeixinType">
                        <el-select style="width:100%" size="small" v-model="issueForm.GetWeixinType" placeholder="请选择用户类别">
                            <el-option
                                v-for="item in role"
                                :key="item.ID"
                                :label="item.SysValue"
                                :value="item.ID">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="关联产品" prop="ProductId">
                        <el-select style="width:100%" size="small" v-model="issueForm.ProductId" placeholder="请选择关联产品">
                            <el-option
                                v-for="item in product"
                                :key="item.Id"
                                :label="item.ProductName"
                                :value="item.Id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="截止日期" prop="MaxDate">
                        <el-date-picker size="small" type="date" value-format="yyyy-MM-dd" placeholder="选择日期" v-model="issueForm.MaxDate" style="width: 100%;"></el-date-picker>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="概率模式" prop="RandType">
                        <el-select style="width:100%" size="small" v-model="issueForm.RandType" placeholder="请选择概率模式">
                            <el-option
                                v-for="item in issueModel"
                                :key="item.ID"
                                :label="item.SysValue"
                                :value="item.ID">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="备注说明" prop="Remark">
                        <el-input size="small" v-model="issueForm.Remark" autocomplete="off"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <el-row style="margin-bottom:15px" type="flex" justify="start">
            <el-button type="primary" icon="el-icon-circle-plus-outline" @click="addPrize" size="mini">添加奖项</el-button>
        </el-row>
        <el-table
            :data="prizeData"
            :header-cell-style="{background:'#FAFAFA',color:'#606266',height:'50px'}"
            border
            stripe
            highlight-current-row
            size="small"
            class="trace-table"
            style="width: 100%">
            <el-table-column prop="RedPackTypeValue" align="center" show-overflow-tooltip label="红包类型"></el-table-column>
            <el-table-column prop="RedPackMoney" align="center" show-overflow-tooltip label="红包金额"></el-table-column>
            <el-table-column prop="IssuedCount" align="center" show-overflow-tooltip label="发行数量"></el-table-column>
            <el-table-column prop="UseCount" align="center" show-overflow-tooltip label="已领数量"></el-table-column>
            <el-table-column label="操作" align="center" fixed="right" width="200px">
              <template slot-scope="scope">
                  <el-button
                    size="mini"
                    icon="el-icon-edit"
                    type="primary"
                    @click="updatePrize(scope.row)">修改</el-button>
                    <el-button
                    size="mini"
                    icon="el-icon-delete"
                    type="danger"
                    @click="deletePrize(scope.row)">删除</el-button>
              </template>
            </el-table-column>
        </el-table>
        <!-- 添加奖项 -->
        <el-dialog
            width="20%"
            :title="prizeTitle"
            :visible.sync="prizeDialog"
            append-to-body>
            <el-form :model="prizeForm" ref="prizeForm" label-width="100px">
                <el-form-item label="发行数量" prop="StartCode">
                    <el-input style="width:90%" size="small" v-model="prizeForm.IssuedCount" placeholder="请输入发行数量" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="红包类型" prop="RedPackType">
                        <el-select style="width:90%" size="small" v-model="prizeForm.RedPackType" placeholder="请选择红包类别">
                            <el-option
                                v-for="item in redType"
                                :key="item.Id"
                                :label="item.type"
                                :value="item.Id">
                            </el-option>
                        </el-select>
                </el-form-item>
                <el-form-item label="红包金额" prop="RedPackMoney">
                    <el-input style="width:90%" size="small" v-model="prizeForm.RedPackMoney" placeholder="请输入红包金额" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button size="small"  type="primary" @click="savePrize('prizeForm')">确定</el-button>
                    <el-button size="small" style="margin-left:60px" @click="prizeDialog= false">取消</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
        <div slot="footer" class="dialog-footer">
            <el-button size="medium" style="margin-right:60px" v-show="issueForm.Type==2"  type="primary" @click="save('issueForm')">确 定</el-button>
            <el-button size="medium"  @click="issueDialog= false">取 消</el-button>
        </div>
    </el-dialog>
  </div>
</template>

<script>
import { getWeixinFans,addWeixinFans} from '@/api/market/redEnv'
import {getPdaModel,getCheckInfo} from '@/api/sysFun/system'
export default {
    data(){
        return{
            total:0,
            queryForm:{
                type:'RandomIssued',
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
                StartCode:'',
                EndCode:'',
                GetWeixinType:'',
                ProductId:'',
                MaxDate:'',
                RandType:'',
                Remark:''
            },
            prizeForm:{
                IssuedCount:'',
                RedPackType:'',
                RedPackMoney:'',
                DetailId:0
            },
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
            redType:[
                {
                    type:'固定金额',
                    Id:35
                },
                {
                    type:'设置无奖',
                    Id:38
                }
            ],
            prizeData:[],
            Id:0
        }
    },
    created(){
        this.getList()
        this.getProduct()
        this.getRole()
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
        getPrize(id){
            getWeixinFans({type:'RandomIssuedDetail',search_type:id}).then(res=>{
                this.prizeData=res
            })
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
        addIssue(){
            this.issueForm={}
            this.issueTitle='发行概率红包'
            this.issueForm.Id=0
            this.issueForm.Type=1
            this.issueDialog=true
        },
        updateIssue(row){
            this.prizeData=[]
            this.issueTitle="修改发行"
            this.issueForm.Id=row.Id
            this.issueForm.StartCode=row.StartCode
            this.issueForm.EndCode=row.EndCode
            this.issueForm.GetWeixinType=row.FansType
            this.issueForm.ProductId=row.ProductId
            this.issueForm.MaxDate=row.MaxDate
            this.issueForm.RandType=row.RandType
            this.issueForm.Remark=row.Remark
            this.issueForm.Type=2
            this.issueDialog=true
            this.getPrize(row.Id)
        },
        deleteIssue(row){
            var arr={
                Type:3,
                Id:row.Id,
            }
            this.$confirm(`确定删除[${row.OrderNum}]发行吗?`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
                }).then(() => {
                    addWeixinFans(arr,'RandomIssued').then(res=>{
                        if(res.errcode==0){
                            this.$message.success('删除成功')
                            this.getList()
                        }else{
                            this.$message.error('请联系管理员')
                        }
                    })
                }).catch(() => {    
            });
        },
        save(){
            var arr=Object.assign({},this.issueForm)
            if(Number(arr.Id)==0){
                //新增
                addWeixinFans(arr,'RandomIssued').then(res=>{
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
                arr.DetailId=0
                arr.DetaiType=0
                arr.IssuedCount=0
                arr.RedPackMoney=0
                arr.RedPackType=0
                addWeixinFans(arr,'RandomIssued').then(res=>{
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
        addPrize(){
            this.prizeDialog=true
            this.prizeForm={}
            this.prizeForm.DetailId=0
            this.prizeTitle="添加奖项"
        },
        updatePrize(row){
            this.prizeDialog=true
            this.prizeTitle="修改奖项"
            this.prizeForm.DetailId=row.Id
            this.prizeForm.IssuedCount=row.IssuedCount
            this.prizeForm.RedPackType=row.RedPackType
            this.prizeForm.RedPackMoney=row.RedPackMoney
        },
        deletePrize(row){
            var arr={
                Type:1,
                DetaiType:3,
                DetailId:row.Id,
                Id:this.issueForm.Id
            }
            this.$confirm(`确定删除当前奖项吗?`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
                }).then(() => {
                    addWeixinFans(arr,'RandomIssued').then(res=>{
                        if(res.errcode==0){
                            this.$message.success('删除成功')
                            this.getPrize(res.orderid)
                            this.getList()
                        }else{
                            this.$message.error('请联系管理员')
                        }
                    })
                }).catch(() => {    
            });
        },
        savePrize(){
            var DetailId=this.prizeForm.DetailId
            var arr=Object.assign({},this.issueForm)
            arr.RedPackType=this.prizeForm.RedPackType
            arr.RedPackMoney=this.prizeForm.RedPackMoney
            arr.IssuedCount=this.prizeForm.IssuedCount
            arr.DetailId=DetailId
            arr.Type=1
            if(Number(DetailId)==0){
                //新增
                arr.DetaiType=1
                addWeixinFans(arr,'RandomIssued').then(res=>{
                    if(res.errcode==0){
                        this.$message.success('新增成功')
                        this.prizeDialog=false
                        this.Id=res.orderid
                        this.getPrize(res.orderid)
                        this.getList()
                    }else{
                        this.$message.error(res.errmsg)
                    }
                })
            }else{
                //修改
                arr.DetaiType=2
                addWeixinFans(arr,'RandomIssued').then(res=>{
                    if(res.errcode==0){
                        this.$message.success('修改成功')
                        this.prizeDialog=false
                        this.getPrize(res.orderid)
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
            if (column.property === 'IssuedCount'||column.property === 'UseCount') {
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