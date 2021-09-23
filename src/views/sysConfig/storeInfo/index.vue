<template>
  <div class="app-container">
      <div class="tab-bar">
        <el-form ref="queryForm" :model="queryForm" label-width="80px" :inline="true" size="small">
            <el-form-item label="关键字" prop="search_text">
                <el-input style="width:200px" v-model="queryForm.search_text" placeholder="请输入查询关键字"></el-input>
            </el-form-item>
            <el-form-item > 
                <el-button type="primary" icon="el-icon-search" @click="query">查询</el-button>
                <el-button icon="el-icon-refresh" @click="reset('queryForm')">重置</el-button>
            </el-form-item>
        </el-form>
      </div>
      <el-row style="margin-bottom:15px" type="flex" justify="end">
            <el-button type="primary" icon="el-icon-circle-plus-outline" @click="addStore" size="mini">新增仓库</el-button>
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="updateStore">修改仓库</el-button>
            <el-button type="danger" icon="el-icon-delete" @click="deleStore" size="mini">删除仓库</el-button>
      </el-row>
      <el-table
            :data="tableData"
            :header-cell-style="{background:'#FAFAFA',color:'#606266',height:'50px'}"
            border
            stripe
            highlight-current-row
            @current-change="handleCurrentChange"
            size="medium"
            class="trace-table"
            style="width: 100%">
            <el-table-column prop="DepotNum" align="center" label="仓库编号"></el-table-column>
            <el-table-column prop="DepotName" align="center" label="仓库名称"></el-table-column>
            <el-table-column prop="DepotNowCount" align="center" label="当前容量"></el-table-column>
            <el-table-column prop="DepotAddress" align="center" label="仓库地址"></el-table-column>
            <el-table-column prop="DepotRemark" align="center" label="备注说明"></el-table-column>
            <el-table-column prop="CreateTime" align="center" label="创建日期"></el-table-column>
      </el-table>
      <el-dialog :title="dialogTitle" :visible.sync="storeDialog" width="40%" @close="storeDialog=false">
        <el-form :model="storeForm" ref="storeForm" label-width="100px">
            <el-form-item label="仓库编号" prop="_num">
                <el-input size="small" style="width:90%" v-model="storeForm._num" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="仓库名称" prop="_name">
                <el-input size="small" style="width:90%" v-model="storeForm._name" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="仓库地址" prop="_address">
                <el-input size="small" style="width:90%" v-model="storeForm._address" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="其他说明" prop="_remark">
                <el-input size="small" style="width:90%" type="textarea" v-model="storeForm._remark"></el-input>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button size="medium"  type="primary" @click="save('storeForm')">确 定</el-button>
            <el-button size="medium" style="margin-left:60px" @click="storeDialog= false">取 消</el-button>
        </div>
      </el-dialog>
  </div>
</template>

<script>
import { getSystemInfo } from '@/api/sysFun/system'
import {deleteStore} from '@/api/sysFun/store'
export default {
    data(){
        return{
            total:0,
            queryForm:{
                type:'Base_Depot',
                page:1,
                rows:20,
                search_text:undefined
            },
            storeForm:{
                _num:'',
                _name:'',
                _address:'',
                _remark:'',
                _id:0
            },
            tableData:[],
            currentRow:undefined,
            dialogTitle:'',
            storeDialog:false
        }
    },
    created(){
        this.getList()
    },
    methods:{
        getList(){
            getSystemInfo(this.queryForm).then(res=>{
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
        addStore(){
            this.storeDialog=true,
            this.storeForm={}
            this.storeForm._id=0
            this.dialogTitle='添加仓库'
        },
        updateStore(){
            if(!this.currentRow) return
            this.storeDialog=true,
            this.dialogTitle='修改仓库'
            var ob=Object.assign({},this.currentRow)
            this.storeForm._id=ob.Id
            this.storeForm._num=ob.DepotNum
            this.storeForm._name=ob.DepotName
            this.storeForm._remark=ob.DepotRemark
            this.storeForm._address=ob.DepotAddress
        },
        save(){
            var arr=Object.assign({},this.storeForm)
            if(Number(arr._id)==0){
                //新增
                arr._type=1
                deleteStore(arr,'Base_Depot').then(res=>{
                    if(res.errcode==0){
                        this.$message.success('新增成功')
                        this.storeDialog=false
                        this.getList()
                    }else{
                        this.$message.error(res.errmsg)
                    }
                })
            }else{
                //修改
                arr._type=2
                deleteStore(arr,'Base_Depot').then(res=>{
                    if(res.errcode==0){
                        this.$message.success('修改成功')
                        this.storeDialog=false
                        this.getList()
                    }else{
                        this.$message.error(res.errmsg)
                    }
                })
            }
        },
        deleStore(){
            var arr={
                _type:3,
                _id:this.currentRow.Id
            }
            if(!this.currentRow) return
            this.$confirm(`确定删除${this.currentRow.DepotName}仓库?`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
                }).then(() => {
                    deleteStore(arr,'Base_Depot').then(res=>{
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
        handleCurrentChange(val) {
            console.log(val)
            this.currentRow = val;
        },
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