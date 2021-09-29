<template>
  <div class="app-container">
    <el-card class="box-card">
      <div class="box-card-item">
        <el-row :gutter="20" type="flex" justify="space-around">
          <el-col :span="4">
            <el-card shadow="always">
              <div class="card-box">
                <div class="card-box-item">
                  <span>累计总扫码</span>
                  <span>
                    <el-tag effect="dark" size="mini">实时</el-tag>
                  </span>
                </div>
                <div class="card-box-items">{{base_info.ShowCount.scanallcount}}</div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="4">
            <el-card shadow="always">
              <div class="card-box">
                <div class="card-box-item">
                  <span>本年累计扫码</span>
                  <span>
                    <el-tag effect="dark" size="mini">实时</el-tag>
                  </span>
                </div>
                <div class="card-box-items">{{base_info.ShowCount.yearallcount}}</div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="4">
            <el-card shadow="always">
              <div class="card-box">
                <div class="card-box-item">
                  <span>本月累计扫码</span>
                  <span>
                    <el-tag effect="dark" size="mini">实时</el-tag>
                  </span>
                </div>
                <div class="card-box-items">{{base_info.ShowCount.monthallcount}}</div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="4">
            <el-card shadow="always">
              <div class="card-box">
                <div class="card-box-item">
                  <span>昨日累计扫码</span>
                  <span>
                    <el-tag effect="dark" size="mini">实时</el-tag>
                  </span>
                </div>
                <div class="card-box-items">{{base_info.ShowCount.yesterdayallcount}}</div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="4">
            <el-card shadow="always">
              <div class="card-box">
                <div class="card-box-item">
                  <span>今日累计扫码</span>
                  <span>
                    <el-tag effect="dark" size="mini">实时</el-tag>
                  </span>
                </div>
                <div class="card-box-items">{{base_info.ShowCount.nowallcount}}</div>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </div>
    </el-card>
    <el-row style="margin-bottom:15px;font-size:20px" type="flex" justify="start">
        <el-divider style="font-size:20px"><i class="el-icon-s-data" style="margin-right:10px"></i>微信红包扫码报表</el-divider>
    </el-row>
    <el-row type="flex" justify="end">
        <el-select size="mini" v-model="type" @change="changeType" placeholder="汇总方式">
            <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
            </el-option>
        </el-select>
    </el-row>
    <div class="card-dashboard" id="scan">
        <EchartsLine :id="id" ref="line" :xData='xData' :dataList='dataList' :max='max' :seriesType='seriesType'></EchartsLine>
    </div>
  </div>
</template>

<script>
import { getSystemInfo} from '@/api/sysFun/system'
import EchartsLine from "@/components/EchartsLine"
export default {
    components:{EchartsLine},
    data(){
        return{
            base_info:{},
            queryForm:{
                type:'Analysis_RedPackUserScanCode',
                search_text:1,
                search_type:1
            },
            options:[
                {
                    label:'最近15天',
                    value:1
                },
                {
                    label:'当年12个月',
                    value:2
                },
                {
                    label:'最近5年',
                    value:3
                }
            ],
            type:1,
            baseUrl:'http://m.8vv.cn/',
            xData:[],
            dataList:[],
            seriesType:'line',
            max:undefined,
            id:'scan'
        }
    },
    created(){
        this.getData()
    },
    methods:{
        getData(){
            getSystemInfo(this.queryForm).then(res=>{
                this.base_info=res
                this.xData=res.xAxis[0].data
                this.dataList=res.series[0].data
            })
        },
        changeType(){
            this.queryForm.search_type=this.type
            this.getData()
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
.card-dashboard{
    width: 100%;
    height: calc(100vh - 400px);
  }
</style>