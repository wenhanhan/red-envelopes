<template>
  <div class="app-container">
    <el-card class="box-card">
      <div class="box-card-item">
        <el-row :gutter="20" type="flex" justify="space-around">
          <el-col :span="4">
            <el-card shadow="always">
              <div class="card-box">
                <div class="card-box-item">
                  <span>红包资金余额</span>
                  <span>
                    <el-tag type="danger" effect="dark" size="mini">实时</el-tag>
                  </span>
                </div>
                <div class="card-box-items">{{base_info.LastOverMoney}}</div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="4">
            <el-card shadow="always">
              <div class="card-box">
                <div class="card-box-item">
                  <span>累计支出余额</span>
                  <span>
                    <el-tag type="danger" effect="dark" size="mini">实时</el-tag>
                  </span>
                </div>
                <div class="card-box-items">{{base_info.TotalPay}}</div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="4">
            <el-card shadow="always">
              <div class="card-box">
                <div class="card-box-item">
                  <span>累计充值金额</span>
                  <span>
                    <el-tag type="danger" effect="dark" size="mini">实时</el-tag>
                  </span>
                </div>
                <div class="card-box-items">{{base_info.TotalRecharge}}</div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="4">
            <el-card shadow="always">
              <div class="card-box">
                <div class="card-box-item">
                  <span>昨日支出金额</span>
                  <span>
                    <el-tag type="danger" effect="dark" size="mini">实时</el-tag>
                  </span>
                </div>
                <div class="card-box-items">{{base_info.YesterdayPay}}</div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="4">
            <el-card shadow="always">
              <div class="card-box">
                <div class="card-box-item">
                  <span>今日支出金额</span>
                  <span>
                    <el-tag type="danger" effect="dark" size="mini">实时</el-tag>
                  </span>
                </div>
                <div class="card-box-items">{{base_info.NowPay}}</div>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </div>
    </el-card>
    <el-row style="margin-bottom:15px;font-size:20px" type="flex" justify="start">
        <el-divider style="font-size:20px" content-position="left">资金流水记录</el-divider>
    </el-row>
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
    <el-row style="margin-bottom:15px" type="flex" justify="start">
        <el-button type="primary" icon="el-icon-download" @click="exportLog" size="mini">导出记录</el-button>
        <el-button type="primary" icon="el-icon-bank-card" @click="chargeDialog=true" size="mini">充值记录</el-button>
        <el-button type="primary" icon="el-icon-chat-dot-square" @click="tipsDialog=true" size="mini">提醒设置</el-button>
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
            <el-table-column prop="DisburseDate" align="center" show-overflow-tooltip label="支出时间"></el-table-column>
            <el-table-column prop="WeiXinBill" align="center" show-overflow-tooltip label="支出单号"></el-table-column>
            <el-table-column prop="DisburseMoney" align="center" show-overflow-tooltip label="支出金额"></el-table-column>
            <el-table-column prop="NowLastMoney" align="center" show-overflow-tooltip label="当前剩余"></el-table-column>
            <el-table-column prop="PayTypeValue" align="center" show-overflow-tooltip label="支出类型"></el-table-column>
            <el-table-column prop="Nickname" align="center" show-overflow-tooltip label="粉丝昵称"></el-table-column>
            <el-table-column prop="FansName" align="center" show-overflow-tooltip label="粉丝名称"></el-table-column>
            <el-table-column prop="TypeWork" align="center" show-overflow-tooltip label="工种"></el-table-column>
            <el-table-column prop="Remark" align="center" show-overflow-tooltip label="其他备注"></el-table-column>
            <el-table-column prop="DisburseDate" align="center" show-overflow-tooltip label="支出时间"></el-table-column>
    </el-table>
    <pagination
        v-show="+total>10"
        :total="+total"
        :page.sync="queryForm.page"
        :limit.sync="queryForm.rows"
        @pagination="getList"
        />
    <el-dialog title="查看资金充值记录" :visible.sync="chargeDialog" width="50%"  @close="chargeDialog=false">
        <el-form ref="chargeQueryForm" :model="chargeQueryForm" label-width="80px" :inline="true" size="small">
            <el-form-item label="" prop="time">
                <el-date-picker
                    style="width:250px"
                    v-model="chargeQueryForm.time"
                    type="daterange"
                    unlink-panels=""
                    range-separator="至"
                    value-format="yyyy-MM-dd"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期">
                </el-date-picker>
            </el-form-item>
            <el-form-item label="搜索内容" prop="search_text">
                <el-input style="width:250px" clearable="" v-model="chargeQueryForm.search_text" placeholder="关键字…"></el-input>
            </el-form-item>
            <el-form-item > 
                <el-button size="small" type="primary" icon="el-icon-search" @click="queryLog">查询</el-button>
                <el-button icon="el-icon-download" @click="exportChargeLog">导出记录</el-button>
            </el-form-item>
        </el-form>
        <el-table
            :data="chargeData"
            :header-cell-style="{background:'#FAFAFA',color:'#606266',height:'50px'}"
            border
            stripe
            highlight-current-row
            size="medium"
            class="trace-table"
            style="width: 100%">
            <el-table-column prop="RechargeDate" align="center" show-overflow-tooltip label="充值日期"></el-table-column>
            <el-table-column prop="RechargeMoney" align="center" show-overflow-tooltip label="充值金额"></el-table-column>
            <el-table-column prop="NowLastMoney" align="center" show-overflow-tooltip label="充值后余额"></el-table-column>
            <el-table-column prop="Description" align="center" show-overflow-tooltip label="充值说明"></el-table-column>
        </el-table>
        <pagination
        v-show="+totals>10"
        :total="+totals"
        :page.sync="chargeQueryForm.page"
        :limit.sync="chargeQueryForm.rows"
        @pagination="getChargeLog"
        />
    </el-dialog>
    <el-dialog title="资金不足提醒设置" :visible.sync="tipsDialog" width="30%" class="tipsDialog" @close="tipsDialog=false">
        <el-form :model="tipsForm" ref="tipsForm" label-width="120px">
            <el-form-item label="是否短信提醒：" prop="_isopen">
                <el-radio-group v-model="tipsForm._isopen">
                    <el-radio label="1">开启</el-radio>
                    <el-radio label="0">关闭</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="提醒手机号码：" prop="_moblie">
                <el-input size="small" style="width:90%" v-model="tipsForm._moblie" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="限定低于额度：" prop="_money">
                <el-input size="small" style="width:90%" v-model="tipsForm._money" autocomplete="off"></el-input>
            </el-form-item>
        </el-form>
        <el-divider content-position="left">Tips:短信每天只提醒一次,只注意查收并尽快充值</el-divider>
        <div slot="footer" class="dialog-footer">
            <el-button size="medium" style="margin-right:60px" type="primary" @click="saveTips('tipsForm')">确 定</el-button>
            <el-button size="medium"  @click="tipsDialog= false">取 消</el-button>
        </div>
    </el-dialog>
  </div>
</template>

<script>
import { getWeixinFans,addWeixinFans,getRedPackType,exportsLog} from '@/api/market/redEnv'
export default {
    data(){
        return{
            base_info:{
                code:{
                dayNum:100000,
                sumNum:'200万',
                mark:'没什么好说的'
                },
                resPack:{
                surplus:3291.68,
                sumNum:3311,
                mark:'没什么好说的'
                },
                partner:{
                surplus:'￥10400.00',
                deposit:'￥4600.00',
                mark:'都来存款吧'
                },
                scan:{
                dayNum:1000,
                sumNum:'1000万',
                mark:'没什么好说的'
                }
            },
            total:0,
            totals:0,
            queryForm:{
                type:'MerchantDisburseRecord',
                page:1,
                rows:20,
                start:'',
                end:'',
                search_text:undefined,
                time:[]
            },
            tipsForm:{
                _moblie:'',
                _money:'',
                _isopen:1
            },
            chargeQueryForm:{
                type:'MerchantRechargeRecord',
                page:1,
                rows:20,
                start:'',
                end:'',
                search_text:undefined,
                time:[]
            },
            chargeDialog:false,
            tipsDialog:false,
            tableData:[],
            chargeData:[],
            baseUrl:'http://m.8vv.cn/',
        }
    },
    created(){
        this.getList()
        this.getData()
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
        getChargeLog(){
            var arr=Object.assign({},this.chargeQueryForm)
            if(arr.time){
                arr.start=arr.time[0]
                arr.end=arr.time[1]
            }
            delete arr.time
            getWeixinFans(arr).then(res=>{
                this.chargeData=res.rows
                this.totals=res.total
            })
        },
        getData(){
            getWeixinFans({type:'GetMerchantDate'}).then(res=>{
                this.base_info=res
                this.tipsForm._moblie=res.SendMoblie
                this.tipsForm._money=parseInt(res.RemindQuota)
                this.tipsForm._isopen=res.IsSendSms
            })
        },
        exportLog(){
            if(this.tableData.length==0){
                this.$message.warning('当前没有需要导出的数据')
                return;
            }
            this.$confirm('确认要导出资金支出记录吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
                }).then(() => {
                    var params={
                        type:'Export',
                        search_text:this.queryForm.search_text,
                        mode:'REDPACK_MERCHANTDISBURSE'
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
        exportChargeLog(){
            if(this.chargeData.length==0){
                this.$message.warning('当前没有需要导出的数据')
                return;
            }
            this.$confirm('确认要导出资金充值记录吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
                }).then(() => {
                    var params={
                        type:'Export',
                        search_text:this.chargeQueryForm.search_text,
                        mode:'REDPACK_MERCHANTRECHARGE'
                    }
                    if(this.chargeQueryForm.time){
                        params.start=this.chargeQueryForm.time[0]
                        params.end=this.chargeQueryForm.time[1]
                    }
                    exportsLog(params).then(res=>{
                        window.location.href = this.baseUrl+"Temp/" + res;
                    })
                }).catch(() => {  
            });
        },
        saveTips(){
            addWeixinFans(this.tipsForm,'SetMerchantDate').then(res=>{
                if(res.errcode==0){
                    this.$message.success('设置成功')
                    this.tipsDialog=false
                }else{
                    this.$message.error(res.errmsg)
                }
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
        queryLog(){
            this.chargeQueryForm.page=1
            this.getChargeLog()
        }
    }
}
</script>

<style lang="scss" scoped>
.box-card{
    margin-bottom: 30px;
  }
  .box-card-item{
    ::v-deep .el-card__body{
      padding-bottom: 0;
      padding-top: 0;
    }
  }
  .clearfix{
    display: flex;
    justify-content: flex-start;
    align-items: center;
    img{
      width:17px;
      height:17px;
      margin-right: 5px;
    }
  }
  .card-box{
    width: 100%;
    height: 120px;
    display: flex;
    flex-direction: column;
    .card-box-item{
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      height: 40%;
      font-size: 16px;
      color: #303133;
    }
    .card-box-items{
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      height: 60%;
      border-top: 1px solid #eeeeee;
      border-bottom: 1px solid #eeeeee;
      font-size: 26px;
      color: #303133;
      font-weight: 600;
    }
  }
  .card-dashboard{
    width: 100%;
    height: calc(100vh - 550px);
  }
  .dialog-footer{
    display: flex;
    width: 100%;
    align-items: center;
    justify-content: center;
}
.tipsDialog{
    .el-divider__text.is-left{
        font-size: 10px;
        color: red;
    }
}
</style>