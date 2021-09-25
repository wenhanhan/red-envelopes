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
      <div class="card-dashboard" id="scan">
        <china-map :user-json="objectData" ></china-map>
      </div>
  </div>
</template>
<script>
import ChinaMap from '@/components/ChinaMap'
import { getWeixinFans} from '@/api/market/redEnv'
import {getCheckInfo} from '@/api/sysFun/system'
export default {
  components: {
    ChinaMap 
  },
  data ()  {
	   return {
	       objectData: [{value: 2, name: '上海'}, {value:3,name: '北京'}],
         queryForm:{
          search_type:'',
          time:[]
         },
         product:[]
     }
  },
  created(){
    this.getData()
    this.getProcuct()
  },
  methods:{
    getData(){
      var params={
          type:'Chart_EachProvince',
          start:'',
          end:'',
          search_type:this.queryForm.search_type
      }
      if(this.queryForm.time){
          params.start=this.queryForm.time[0]
          params.end=this.queryForm.time[1]
      }
      getWeixinFans(params).then(res=>{
          this.objectData=res.series[0].data
      })
    },
    getProcuct(){
        getCheckInfo({},'Base_Product_Select').then(res=>{
            this.product=res
        })
    },
    reset(formName){
      this.$refs[formName].resetFields();
      this.getData()
    },
    query(){
      this.getData()
    },
  }
}
</script>
<style lang="scss" scoped>
.card-dashboard{
    width: 100%;
    height: calc(100vh - 400px);
  }
</style>
