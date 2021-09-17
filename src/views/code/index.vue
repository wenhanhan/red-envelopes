<template>
  <div class="app-container">
      <div class="tab-bar">
        <el-form ref="queryForm" :model="queryForm" label-width="80px" :inline="true" size="small">
                <el-form-item label="合伙人" prop="partner">
                    <el-input style="width:200px" v-model="queryForm.partner"></el-input>
                </el-form-item>
                <el-form-item label="品牌商" prop="dealer">
                    <el-input style="width:200px" v-model="queryForm.dealer"></el-input>
                </el-form-item>
                <el-form-item label="类型" prop="type">
                    <el-select style="width:200px" size="small" v-model="queryForm.type" placeholder="请选择生码类型">
                        <el-option
                            v-for="item in options"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="应用场景" prop="scene">
                    <el-select style="width:200px" size="small" multiple collapse-tags v-model="queryForm.scene" placeholder="请选择应用场景">
                        <el-option
                            v-for="item in sceneOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="备注说明" prop="mark">
                    <el-input style="width:200px" v-model="queryForm.mark"></el-input>
                </el-form-item>
                <el-form-item > 
                    <el-button type="primary" icon="el-icon-search" @click="query">查询</el-button>
                    <el-button icon="el-icon-refresh" @click="reset('queryForm')">重置</el-button>
                </el-form-item>
        </el-form>
      </div>
      <el-row>
      <el-col :span="24" style="margin:10px 0;">
        <el-button type="primary" style="font-size:14px" size="small" >生码总量：1000万</el-button>
      </el-col>
      <!-- 表格区域 -->
      <el-table
      :data="tableData"
      :header-cell-style="{background:'#FAFAFA',color:'#606266',height:'50px'}"
      border
      stripe
      size="medium"
      class="trace-table"
      empty-text="--"
      style="width: 100%">
      <el-table-column prop="companyName" align="center" label="合伙人公司名称" width="180px"></el-table-column>
      <el-table-column prop="partnerAccount" align="center" label="合伙人账号" width="120px"></el-table-column>
      <el-table-column prop="dealerName" align="center" label="品牌商名称" show-overflow-tooltip></el-table-column>
      <el-table-column prop="dealerAccount" align="center" label="品牌商账号" width="120px"></el-table-column>
      <el-table-column prop="batchNumber" align="center" label="批次号"></el-table-column>
      <el-table-column prop="scene" align="center" label="应用场景"></el-table-column>
      <el-table-column prop="serialNumber" align="center" show-overflow-tooltip label="流水号范围"></el-table-column>
      <el-table-column prop="quantity" align="center" label="数量"></el-table-column>
      <el-table-column prop="type" align="center" label="类型"></el-table-column>
      <el-table-column prop="enabledQuantity" align="center" label="已启用数量"></el-table-column>
      <el-table-column prop="createTime" align="center" show-overflow-tooltip label="生码时间"></el-table-column>
      <el-table-column prop="mark" align="center" label="备注说明" show-overflow-tooltip></el-table-column>
      <el-table-column prop="relationProduct" align="center" label="关联产品"></el-table-column>
      <el-table-column prop="status" align="center" label="状态"></el-table-column>
      <el-table-column label="操作" align="center" fixed="right" width="240px">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="primary"
            @click="handleImport(scope.row)">导入</el-button>
            <el-button
            size="mini"
            type="primary"
            icon="el-icon-key"
            @click="handleKey(scope.row)">秘钥</el-button>
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination
        v-show="+total>10"
        :total="+total"
        :page.sync="queryForm.pageNum"
        :limit.sync="queryForm.pageSize"
        @pagination="getList"
     />
    </el-row>
  </div>
</template>

<script>
export default {
    data(){
        return{
            queryForm:{
                partner:'',//合伙人
                dealer:'',//品牌商
                type:'',
                scene:'',
                mark:'',
                pageNum:1,
                pageSize:10
            },
            options:[
                {
                    value: 1,
                    label: '普通码'
                }, {
                    value: 2,
                    label: '小程序码'
                },    
            ],
            sceneOptions:[
                {
                    value: 1,
                    label: '营销码'
                },
                {
                    value: 2,
                    label: '溯源码'
                },
                {
                    value: 3,
                    label: '导购码'
                },
                {
                    value: 4,
                    label: '物流码'
                }
            ],
            tableData:[
                {
                   companyName:'石家庄海略科技有限公司' ,
                   partnerAccount:'18330118047',
                   dealerName:'大地农业',
                   dealerAccount:'15027776666',
                   batchNumber:'2021-a123',
                   scene:'营销码',
                   serialNumber:'00000001 - 00001000',
                   quantity:1000,
                   type:'普通码',
                   enabledQuantity:500,
                   createTime:'2021-08-20 16:09:30',
                   mark:'第一批码测试',
                   relationProduct:'大地一号',
                   status:'生码完成'
                }
            ],
            total:0
        }
    },
    created(){
        this.getList()
    },
    methods:{
        getList(){
            var arr=new Array(10)
            for(var i=0;i<arr.length;i++){
                arr[i] = this.tableData[0]
            }
            this.tableData=arr
            this.total=20
        },
        handleImport(){

        },
        handleDelete(){

        },
        query(){

        },
        reset(formName){
            this.$refs[formName].resetFields();
        },
    }
}
</script>

<style>

</style>