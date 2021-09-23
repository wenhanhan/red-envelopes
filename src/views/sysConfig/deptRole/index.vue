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
            <el-button type="primary" icon="el-icon-circle-plus-outline" @click="addRole" size="mini">新增角色</el-button>
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="updateRole">修改角色</el-button>
            <el-button type="danger" icon="el-icon-delete" @click="deleRole" size="mini">删除角色</el-button>
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
            <el-table-column prop="RoleName" align="center" label="部门名称"></el-table-column>
            <el-table-column show-overflow-tooltip prop="RoleValue" align="center" label="权限信息"></el-table-column>
            <el-table-column prop="CreateTime" align="center" label="创建时间"></el-table-column>
      </el-table>
      <el-dialog :title="dialogTitle" :visible.sync="roleDialog" width="50%" @close="roleDialog=false">
        <el-form :model="roleForm" ref="roleForm" label-width="100px">
            <el-form-item label="" prop="_name" label-width="30px">
                <el-input size="small" placeholder="输入创建新角色名称" style="width:90%" v-model="roleForm._name" autocomplete="off"></el-input>
            </el-form-item>
            <el-tabs type="border-card" v-model="activeName">
                <el-tab-pane v-for="(it,idx) in tabOption" :key="idx" :label="it.label" :name="it.name">
                    <el-form-item label="" label-width="0">
                        <el-checkbox-group v-model="roles">
                            <el-checkbox v-for="(item,index) in filterRole(it.name)" :key="index" :label="item.FunctionText" :name="String(item.Id)"></el-checkbox>
                        </el-checkbox-group>
                    </el-form-item>
                </el-tab-pane>
            </el-tabs>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button size="medium"  type="primary" @click="save('roleForm')">确 定</el-button>
            <el-button size="medium" style="margin-left:60px" @click="roleDialog= false">取 消</el-button>
        </div>
      </el-dialog>
  </div>
</template>

<script>
import { getSystemInfo,getCheckInfo,setQueryInfo } from '@/api/sysFun/system'
export default {
    data(){
        return{
            total:0,
            queryForm:{
                type:'Base_UserRole',
                page:1,
                rows:20,
                search_text:undefined
            },
            roleForm:{
                _name:'',
                _value:[],
            },
            activeName:"1",
            roles:[],
            allRoles:[],
            tableData:[],
            currentRow:undefined,
            dialogTitle:'',
            roleDialog:false,
            tabOption:[
                {
                    label:'系统功能管理',
                    name:"1"
                },
                {
                    label:'仓储物流管理',
                    name:"2"
                },
                {
                    label:'市场营销管理',
                    name:"3"
                },
                {
                    label:'系统功能管理',
                    name:"4"
                },
                
            ]
        }
    },
    created(){
        this.getList()
        this.getAllRoles()
    },
    computed:{
        filterRole(){
            return (val)=>{
                var filterRole=this.allRoles.filter(item=>{
                    return item.LinkId==val
                })
                return filterRole
            }
        },
    },
    methods:{
        getList(){
            getSystemInfo(this.queryForm).then(res=>{
                this.tableData=res.rows
                this.total=res.total
            })
        },
        getAllRoles(){
            getCheckInfo({},'Base_LoadSystemMenu').then(res=>{
                this.allRoles=res
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
        addRole(){
            this.roleDialog=true,
            this.roleForm={}
            this.roleForm._id=0
            this.dialogTitle='添加角色'
        },
        updateRole(){
            if(!this.currentRow) return
            this.roleDialog=true,
            this.dialogTitle='修改角色'
            var ob=Object.assign({},this.currentRow)
            this.roleForm._id=ob.Id
            this.roleForm._name=ob.RoleName
            var rolesId=ob.RoleValue.split(',')
            var roleName=[]
            rolesId.forEach((item,index)=>{
                this.allRoles.forEach((it,idx)=>{
                    if(item==it.Id){
                        roleName.push(it.FunctionText)
                    }
                })
            })
            this.roles=roleName
        },
        save(){
            var arr=Object.assign({},this.roleForm)
            var rolesId=[]
            this.roles.forEach((item,index)=>{
                this.allRoles.forEach((it,idx)=>{
                    if(item==it.FunctionText){
                        rolesId.push(it.Id)
                    }
                })
            })
            arr._value=rolesId.join(',')
            if(Number(arr._id)==0){
                //新增角色
                arr._type=1
                setQueryInfo(arr,'Base_UserRole').then(res=>{
                    if(res.errcode==0){
                        this.$message.success('新增成功')
                        this.roleDialog=false
                        this.getList()
                    }else{
                        this.$message.error(res.errmsg)
                    }
                })
            }else{
                //修改
                arr._type=2
                setQueryInfo(arr,'Base_UserRole').then(res=>{
                    if(res.errcode==0){
                        this.$message.success('修改成功')
                        this.roleDialog=false
                        this.getList()
                    }else{
                        this.$message.error(res.errmsg)
                    }
                })
            }
        },
        deleRole(){
            var arr={
                _type:3,
                _id:this.currentRow.Id,
                _name:1,
                _value:1
            }
            if(!this.currentRow) return
            this.$confirm(`确定删除${this.currentRow.RoleName}角色?`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
                }).then(() => {
                    setQueryInfo(arr,'Base_UserRole').then(res=>{
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