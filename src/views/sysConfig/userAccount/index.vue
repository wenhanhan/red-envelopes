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
            <el-button type="primary" icon="el-icon-circle-plus-outline" @click="addAccount" size="mini">新增账号</el-button>
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="updateAccount">修改账号</el-button>
            <el-button type="danger" icon="el-icon-delete" @click="deleAccount" size="mini">删除账号</el-button>
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
            <el-table-column prop="UserAccount" align="center" label="用户账号"></el-table-column>
            <el-table-column prop="HoldersName" align="center" label="用户名称"></el-table-column>
            <el-table-column prop="StateValue" align="center" label="账号状态"></el-table-column>
            <el-table-column prop="RoleName" align="center" label="所属部门"></el-table-column>
            <el-table-column prop="Remark" align="center" label="备注信息"></el-table-column>
            <el-table-column prop="PDATypeValue" align="center" label="PDA模式"></el-table-column>
            <el-table-column prop="CreateTime" align="center" label="添加时间"></el-table-column>
            <el-table-column label="操作" align="center" fixed="right" width="200px">
              <template slot-scope="scope">
                <el-button
                size="mini"
                icon="el-icon-key"
                type="primary"
                @click="handleReset(scope.row)">重置密码</el-button>
              </template>
            </el-table-column>
      </el-table>
      <el-dialog :title="dialogTitle" :visible.sync="accountDialog" width="30%" @close="accountDialog=false">
        <el-form :model="accountForm" ref="accountForm" label-width="100px">
            <el-form-item label="用户账号" prop="_account">
                <el-input size="small" style="width:90%" v-model="accountForm._account" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="用户名称" prop="_name">
                <el-input size="small" style="width:90%" v-model="accountForm._name" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="所属部门" prop="_roleid">
              <el-select style="width:90%" size="small" v-model="accountForm._roleid" placeholder="请选择所属部门">
                <el-option
                    v-for="item in roleOptions"
                    :key="item.Id"
                    :label="item.RoleName"
                    :value="item.Id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="账号状态" prop="_state">
              <el-select style="width:90%" size="small" v-model="accountForm._state" placeholder="请选择账号状态">
                <el-option
                    v-for="item in roleStateOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="PDA模式" prop="_pda">
              <el-select style="width:90%" size="small" v-model="accountForm._pda" placeholder="请选择PDA模式">
                <el-option
                    v-for="item in pdaOptions"
                    :key="item.ID"
                    :label="item.SysValue"
                    :value="item.ID">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="其他说明" prop="_remark">
                <el-input size="small" style="width:90%" type="textarea" v-model="accountForm._remark"></el-input>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button size="medium"  type="primary" @click="save('storeForm')">确 定</el-button>
            <el-button size="medium" style="margin-left:60px" @click="accountDialog= false">取 消</el-button>
        </div>
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
                type:'Base_UserAccount',
                page:1,
                rows:20,
                search_text:undefined
            },
            accountForm:{
                _account:'',
                _name:'',
                _roleid:'',
                _state:'',
                _pda:'',
                _remark:'',
                _id:0
            },
            roleOptions:[],
            roleStateOptions:[
              {
                label:'开启',
                value:'1'
              },
              {
                label:'禁用',
                value:'0'
              }
            ],
            pdaOptions:[],
            tableData:[],
            currentRow:undefined,
            dialogTitle:'',
            accountDialog:false
        }
    },
    created(){
        this.getList()
        this.getRoleOption()
        this.getPdaOption()
    },
    methods:{
        getList(){
            getSystemInfo(this.queryForm).then(res=>{
                this.tableData=res.rows
                this.total=res.total
            })
        },
        getRoleOption(){
          getCheckInfo({},'Base_UserRole_Select').then(res=>{
            this.roleOptions=res
          })
        },
        getPdaOption(){
          getPdaModel({},'Base_LoadSystemParmAll',17).then(res=>{
            this.pdaOptions=res
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
        addAccount(){
            this.accountDialog=true,
            this.accountForm={}
            this.accountForm._id=0
            this.dialogTitle='添加账号'
        },
        handleReset(row){
          this.$confirm(`确定要重置${row.UserAccount}的密码吗`, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'info'
            }).then(() => {
              setQueryInfo({_type:4,_id:row.Id},'Base_UserAccount').then(res=>{
                if(res.errcode==0){
                  this.$alert(res.errmsg, '提示', {
                    confirmButtonText: '确定',
                    center: true,
                  });
                }else{
                  this.$message.error(res.errmsg)
                }
              })
            }).catch(() => {    
            });
        },
        updateAccount(){
            if(!this.currentRow) return
            this.accountDialog=true,
            this.dialogTitle='修改账号'
            var ob=Object.assign({},this.currentRow)
            this.accountForm._id=ob.Id
            this.accountForm._name=ob.HoldersName
            this.accountForm._account=ob.UserAccount
            this.accountForm._remark=ob.Remark
            this.accountForm._pda=ob.PDAType
            this.accountForm._roleid=ob.RoleId
            this.accountForm._state=ob.UserState
        },
        save(){
            var arr=Object.assign({},this.accountForm)
            if(Number(arr._id)==0){
                //新增
                arr._type=1
                setQueryInfo(arr,'Base_UserAccount').then(res=>{
                    if(res.errcode==0){
                        this.$message.success('新增成功')
                        this.accountDialog=false
                         this.$alert(res.errmsg, '提示', {
                          confirmButtonText: '确定',
                          center: true,
                        });
                        this.getList()
                    }else{
                        this.$message.error(res.errmsg)
                    }
                })
            }else{
                //修改
                arr._type=2
                setQueryInfo(arr,'Base_UserAccount').then(res=>{
                    if(res.errcode==0){
                        this.$message.success('修改成功')
                        this.accountDialog=false
                        this.getList()
                    }else{
                        this.$message.error(res.errmsg)
                    }
                })
            }
        },
        deleAccount(){
            var arr={
                _type:3,
                _id:this.currentRow.Id,
                _roleid:0,
                _state:1
            }
            if(!this.currentRow) return
            this.$confirm(`确定删除${this.currentRow.UserAccount}账号?`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
                }).then(() => {
                    setQueryInfo(arr,'Base_UserAccount').then(res=>{
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