<template>
  <div class="app-container">
    <!-- 数据统计 -->
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <img src="@/assets/icon/statistics.png">
        <span>数据统计</span>
      </div>
      <div class="box-card-item">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-card shadow="always">
              <div class="card-box">
                <div class="card-box-item">
                  <span>今日支出红包</span>
                  <span>
                    <el-tag effect="dark" type="danger" size="mini">实时</el-tag>
                  </span>
                </div>
                <div class="card-box-items">{{redPay.ShowCount.nowcount}}</div>
                <div class="card-box-item">
                  <span>累计支出红包</span>
                  <span>{{redPay.ShowCount.allcount}}</span>
                </div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="6">
            <el-card shadow="always">
              <div class="card-box">
                <div class="card-box-item">
                  <span>今日累计扫码</span>
                  <span>
                    <el-tag effect="dark" size="mini">实时</el-tag>
                  </span>
                </div>
                <div class="card-box-items">{{scanData.ShowCount.nowallcount}}</div>
                <div class="card-box-item">
                  <span>累计总扫码</span>
                  <span>{{scanData.ShowCount.scanallcount}}</span>
                </div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="6">
            <el-card shadow="always">
              <div class="card-box">
                <div class="card-box-item">
                  <span>今日增加粉丝</span>
                  <span>
                    <el-tag effect="dark" type="warning" size="mini">实时</el-tag>
                  </span>
                </div>
                <div class="card-box-items">{{fansData.ShowCount.nowcount}}</div>
                <div class="card-box-item">
                  <span>累计吸粉量</span>
                  <span>{{fansData.ShowCount.allcount}}</span>
                </div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="6">
            <el-card shadow="always">
              <div class="card-box">
                <div class="card-box-item">
                  <span>红包资金余额</span>
                  <span>
                    <el-tag effect="dark" type="danger" size="mini">实时</el-tag>
                  </span>
                </div>
                <div class="card-box-items">{{fundData.LastOverMoney}}</div>
                <div class="card-box-item">
                  <span>累计充值金额</span>
                  <span>{{fundData.TotalRecharge}}</span>
                </div>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </div>
    </el-card>
    <!-- 报表统计 -->
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <img src="@/assets/icon/table.png">
        <span>报表统计</span>
      </div>
      <div class="box-card-item">
        <el-row :gutter="20">
          <el-col :span="8">
            <el-card shadow="always">
              <div slot="header" style="display:flex;justify-content: space-between">
                <span>粉丝统计</span>
                <span>
                    <el-select style="width:100px" size="mini" v-model="queryFansForm.search_type" @change="changeFansType" placeholder="汇总方式">
                        <el-option
                            v-for="item in options"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </span>
              </div>
              <div class="card-dashboard" id="scan">
                 <EchartsLine :id="id1" :xData='fans_xData' :dataList='fans_dataList' :max='max' :seriesType='seriesType1'></EchartsLine>
              </div>
            </el-card>
          </el-col>
          <el-col :span="8">
            <el-card shadow="always">
              <div slot="header" style="display:flex;justify-content: space-between">
                <span>扫码统计</span>
                <span>
                    <el-select style="width:100px" size="mini" v-model="queryScanForm.search_type" @change="changeType" placeholder="汇总方式">
                      <el-option
                          v-for="item in options"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value">
                      </el-option>
                    </el-select>
                </span>
              </div>
              <div class="card-dashboard" id="agent">
                 <EchartsLine :id="id2" :xData='scan_xData' :dataList='scan_dataList' :max='max' :seriesType='seriesType1'></EchartsLine>
              </div>
            </el-card>
          </el-col>
          <el-col :span="8">
            <el-card shadow="always">
              <div slot="header" style="display:flex;justify-content: space-between">
                <span>红包支出</span>
                <span>
                    <el-select style="width:100px" size="mini" v-model="queryPayForm.search_type" @change="changePayType" placeholder="汇总方式">
                      <el-option
                          v-for="item in options"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value">
                      </el-option>
                    </el-select>
                </span>
              </div>
              <div class="card-dashboard" id="user">
                <EchartsLine :id="id3" :xData='pay_xData' :dataList='pay_dataList' :max='max' :seriesType='seriesType1'></EchartsLine>
                 <!-- <EchartsPie :id="id3" :dataList='pieItems'></EchartsPie> -->
              </div>
            </el-card>
          </el-col>
        </el-row>
      </div>
    </el-card>
  </div>
</template>
<script>
import { getSystemInfo} from '@/api/sysFun/system'
import { getWeixinFans} from '@/api/market/redEnv'
import EchartsLine from "@/components/EchartsLine"
import EchartsBar from "@/components/EchartsBar"
import EchartsPie from "@/components/EchartsPie"
export default {
  components:{EchartsLine,EchartsBar,EchartsPie},
  data() {
    return {
      //表格数据
      id1:'scan',
      id2:'agent',
      id3:'user',
      scan_xData:[],
      scan_dataList:[],
      fans_xData:[],
      fans_dataList:[],
      pay_xData:[],
      pay_dataList:[],
      seriesType1:'line',
      seriesType2:'bar',
      max:undefined,
      queryPayForm:{
        type:'Analysis_RedPackOutlay',
        search_text:1,
        search_type:2
      },
      queryScanForm:{
        type:'Analysis_RedPackUserScanCode',
        search_text:1,
        search_type:2
      },
      queryFansForm:{
        type:'Analysis_RedPackAttractFans',
        search_text:1,
        search_type:2
      },
      redPay:{},//红包支出数据
      scanData:{},
      fansData:{},
      fundData:{},
      options:[
          {
              label:'半月',
              value:1
          },
          {
              label:'一年',
              value:2
          },
          {
              label:'近五年',
              value:3
          }
      ]
    }
  },
  created() {
    this.getWxPayData()
    this.getScanData()
    this.getFansData()
    this.getfundData()
  },
  filters:{
    
  },
  methods: {
    getWxPayData(){
      getSystemInfo(this.queryPayForm).then(res=>{
          this.redPay=res
          this.pay_xData=res.xAxis[0].data
          this.pay_dataList=res.series[0].data
      })
    },
    getScanData(){
        getSystemInfo(this.queryScanForm).then(res=>{
            this.scanData=res
            this.scan_xData=res.xAxis[0].data
            this.scan_dataList=res.series[0].data
        })
    },
    getFansData(){
      getSystemInfo(this.queryFansForm).then(res=>{
          this.fansData=res
          this.fans_xData=res.xAxis[0].data
          this.fans_dataList=res.series[0].data
      })
    },
    getfundData(){
      getWeixinFans({type:'GetMerchantDate'}).then(res=>{
          this.fundData=res
      })
    },
    changeType(){
        this.getScanData()
    },
    changeFansType(){
        this.getFansData()
    },
    changePayType(){
      this.getWxPayData()
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
    height: 160px;
    display: flex;
    flex-direction: column;
    .card-box-item{
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      height: 30%;
      font-size: 16px;
      color: #303133;
    }
    .card-box-items{
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      height: 40%;
      border-top: 1px solid #eeeeee;
      border-bottom: 1px solid #eeeeee;
      font-size: 26px;
      color: #303133;
      font-weight: 600;
    }
  }
  .card-dashboard{
    width: 100%;
    height: calc(100vh - 500px);
  }
</style>
