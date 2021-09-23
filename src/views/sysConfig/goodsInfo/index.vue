<template>
  <div class="app-container">
      <div class="tab-bar">
        <el-form ref="queryForm" :model="queryForm" label-width="80px" :inline="true" size="small">
            <el-form-item label="商品类别" prop="search_type">
                <el-select style="width:90%" size="small" v-model="queryForm.search_type" placeholder="请选择商品类别">
                    <el-option
                        v-for="item in typeOptions"
                        :key="item.ID"
                        :label="item.SysValue"
                        :value="item.ID">
                    </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="关键字" prop="search_text">
                <el-input style="width:200px" v-model="queryForm.search_text" placeholder="请输入查询关键字"></el-input>
            </el-form-item>
            <el-form-item > 
                <el-button type="primary" icon="el-icon-search" @click="query">查询</el-button>
                <el-button icon="el-icon-refresh" @click="reset('queryForm')">重置</el-button>
            </el-form-item>
        </el-form>
      </div>
      <el-row style="margin-bottom:15px" type="flex" justify="start">
            <el-button type="primary" icon="el-icon-circle-plus-outline" @click="addAccount" size="mini">新增商品</el-button>
            <el-dropdown style="margin-left:10px" @command="handleCommand">
                <el-button size="mini" type="primary">
                    更多操作<i class="el-icon-arrow-down el-icon--right"></i>
                </el-button>
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item icon="el-icon-files" command="type" divided>商品类别</el-dropdown-item>
                    <el-dropdown-item icon="el-icon-link" divided>商品参数</el-dropdown-item>
                    <el-dropdown-item icon="el-icon-upload" divided>导入商品</el-dropdown-item>
                    <el-dropdown-item icon="el-icon-download" divided>导出商品</el-dropdown-item>
                    <el-dropdown-item icon="el-icon-s-order" divided>图文介绍</el-dropdown-item>
                    <el-dropdown-item icon="el-icon-picture" divided>商品图片</el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
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
            <el-table-column prop="ProductNum" align="center" label="商品编号"></el-table-column>
            <el-table-column prop="ProductName" align="center" label="商品名称"></el-table-column>
            <el-table-column prop="ClassName" align="center" label="商品类别"></el-table-column>
            <el-table-column prop="ProductNorm" align="center" label="规格型号"></el-table-column>
            <el-table-column prop="ProductPlace" align="center" label="商品价格"></el-table-column>
            <el-table-column prop="ProductBarcode" align="center" label="商品条码"></el-table-column>
            <el-table-column prop="ProductPlace" align="center" label="商品产地"></el-table-column>
            <el-table-column prop="ProductRemark" align="center" label="其他信息"></el-table-column>
            <el-table-column prop="CreateDate" align="center" label="创建时间"></el-table-column>
            <el-table-column label="操作" align="center" fixed="right" width="200px">
              <template slot-scope="scope">
                <el-button
                size="mini"
                icon="el-icon-edit"
                type="primary"
                @click="updateAccount(scope.row)">修改</el-button>
                <el-button
                size="mini"
                icon="el-icon-delete"
                type="danger"
                @click="deleAccount(scope.row)">删除</el-button>
              </template>
            </el-table-column>
      </el-table>
      <el-dialog :title="dialogTitle" :visible.sync="goodsDialog" width="40%" @close="goodsDialog=false">
        <el-form :model="goodsForm" ref="goodsForm" label-width="100px">
            <el-row>
                <el-col :span="12">
                    <el-form-item label="商品类别" prop="search_type">
                        <el-select style="width:100%" size="small" v-model="goodsForm._class" placeholder="请选择商品类别">
                            <el-option
                                v-for="item in typeOption"
                                :key="item.ID"
                                :label="item.SysValue"
                                :value="item.ID">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="商品名称" prop="_name">
                        <el-input size="small" v-model="goodsForm._name" autocomplete="off"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="规格型号" prop="_norm">
                        <el-input size="small"  v-model="goodsForm._norm" autocomplete="off"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="商品编号" prop="_num">
                        <el-input size="small"  v-model="goodsForm._num" autocomplete="off"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="商品单价" prop="_price">
                        <el-input size="small"  v-model="goodsForm._price" autocomplete="off"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="商品条码" prop="_barcode">
                        <el-input size="small"  v-model="goodsForm._barcode" autocomplete="off"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="商品产地" prop="_place">
                        <el-input size="small"  v-model="goodsForm._place" autocomplete="off"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="链接地址" prop="_url">
                        <el-input size="small"  v-model="goodsForm._url" autocomplete="off"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="24">
                    <el-form-item label="备注说明" prop="_remark">
                        <el-input type="textarea"  v-model="goodsForm._remark" autocomplete="off"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button size="medium"  type="primary" @click="save('storeForm')">确 定</el-button>
            <el-button size="medium" style="margin-left:60px" @click="accountDialog= false">取 消</el-button>
        </div>
      </el-dialog>
      <!-- 商品类别 -->
      <el-dialog title="商品类别管理" :visible.sync="typeDialog" width="40%" @close="typeDialog=false">
        <el-form ref="typeForm" :model="typeForm" label-width="80px" :inline="true" size="small">
            <el-form-item label="关键字" prop="search_text">
                <el-input style="width:200px" v-model="typeForm.search_text" placeholder="关键字……"></el-input>
            </el-form-item>
            <el-form-item > 
                <el-button type="primary"  icon="el-icon-search" @click="queryType">查询</el-button>
                <el-button icon="el-icon-refresh" @click="reset('typeForm')">重置</el-button>
            </el-form-item>
        </el-form>
        <el-table
            :data="typeData"
            :header-cell-style="{background:'#FAFAFA',color:'#606266',height:'50px'}"
            border
            stripe
            highlight-current-row
            size="small"
            class="trace-table"
            style="width: 100%">
            <el-table-column prop="SysValue" align="center" label="商品类别"></el-table-column>
            <el-table-column prop="CreateDate" align="center" label="创建时间"></el-table-column>
            <el-table-column label="操作" align="center" fixed="right" width="200px">
              <template slot-scope="scope">
                <el-button
                size="mini"
                icon="el-icon-edit"
                type="text"
                @click="updateType(scope.row)">修改</el-button>
                <el-button
                size="mini"
                icon="el-icon-delete"
                type="text"
                @click="deleType(scope.row)">删除</el-button>
              </template>
            </el-table-column>
        </el-table>
      </el-dialog>
  </div>
</template>

<script>
import { getSystemInfo,setQueryInfo,getCheckInfo,getPdaModel } from '@/api/sysFun/system'
export default {
    data(){
        return{
            total:0,
            queryForm:{
                type:'Base_Product',
                page:1,
                rows:20,
                search_text:undefined,
                search_type:undefined
            },
            typeForm:{
                search_text:'',
                search_type:7,
                type:'Base_LoadSystemParm'
            },
            goodsForm:{
                _class:'',
                _name:'',
                _norm:'',
                _num:'',
                _price:'',
                _barcode:'',
                _place:'',
                _url:'',
                _remark:"",
                _id:0
            },
            typeOptions:[],
            typeOption:[],
            tableData:[],
            typeData:[],
            dialogTitle:'',
            goodsDialog:false,
            typeDialog:false
        }
    },
    created(){
        this.getList()
        this.getTypeOption()
        this.getTypeData()
    },
    methods:{
        getList(){
            getSystemInfo(this.queryForm).then(res=>{
                this.tableData=res.rows
                this.total=res.total
            })
        },
        getTypeOption(){
          getPdaModel({},'Base_LoadSystemParmEx',7).then(res=>{
            this.typeOptions=res
            this.typeOption=this.typeOptions.filter(item=>{
                return item.ID!=0
            })
          })
        },
        getTypeData(){
            getSystemInfo(this.typeForm).then(res=>{
                this.typeData=res
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
        queryType(){
            this.getTypeData()
        },
        addAccount(){
            this.goodsDialog=true,
            this.goodsForm={}
            this.goodsForm._id=0
            this.dialogTitle='添加商品'
        },
        updateAccount(row){
            this.goodsDialog=true,
            this.dialogTitle='修改商品'
            var ob=Object.assign({},row)
            this.goodsForm._id=ob.Id
            this.goodsForm._class=ob.ProductClass
            this.goodsForm._name=ob.ProductName
            this.goodsForm._norm=ob.ProductNorm
            this.goodsForm._num=ob.ProductNum
            this.goodsForm._price=ob.ProductPrice
            this.goodsForm._barcode=ob.ProductBarcode
            this.goodsForm._place=ob.ProductPlace
            this.goodsForm._url=ob.ProductUrl
            this.goodsForm._remark=ob.ProductRemark
        },
        save(){
            var arr=Object.assign({},this.goodsForm)
            if(Number(arr._id)==0){
                //新增
                arr._type=1
                setQueryInfo(arr,'Base_Product').then(res=>{
                    if(res.errcode==0){
                        this.$message.success('新增成功')
                        this.goodsDialog=false
                        this.getList()
                    }else{
                        this.$message.error(res.errmsg)
                    }
                })
            }else{
                //修改
                arr._type=2
                setQueryInfo(arr,'Base_Product').then(res=>{
                    if(res.errcode==0){
                        this.$message.success('修改成功')
                        this.goodsDialog=false
                        this.getList()
                    }else{
                        this.$message.error(res.errmsg)
                    }
                })
            }
        },
        deleAccount(row){
            console.log(row)
            var arr={
                _type:3,
                _id:row.Id,
            }
            this.$confirm(`确定删除${row.ProductName}商品?`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
                }).then(() => {
                    setQueryInfo(arr,'Base_Product').then(res=>{
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
        updateType(row){

        },
        deleType(row){

        },
        handleCommand(command) {
            if(command=='type'){
                this.typeDialog=true
            }
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