<template>
  <div class="app-container">
      <div class="tab-bar">
        <el-form ref="queryForm" :model="queryForm" label-width="80px" :inline="true" size="small">
            <el-form-item label="时间范围" prop="time">
                <el-date-picker
                    style="width:250px"
                    v-model="queryForm.time"
                    type="daterange"
                    unlink-panels
                    range-separator="至"
                    value-format="yyyy-MM-dd"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期">
                </el-date-picker>
            </el-form-item>
            <el-form-item label="关键字" prop="search_text">
                <el-input style="width:250px" clearable="" v-model="queryForm.search_text" placeholder="请输入查询关键字"></el-input>
            </el-form-item>
            <el-form-item > 
                <el-button size="small" type="primary" icon="el-icon-search" @click="query">查询</el-button>
                <el-button icon="el-icon-refresh" @click="reset('queryForm')">重置</el-button>
            </el-form-item>
        </el-form>
      </div>
      <el-row style="margin-bottom:15px" type="flex" justify="start">
            <el-button type="primary" icon="el-icon-circle-plus-outline" @click="addFans" size="mini">新增用户</el-button>
            <el-button type="primary" icon="el-icon-download" @click="exportLog" size="mini">导出记录</el-button>
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
            <el-table-column prop="Headimgurl" align="center" width="80px" label="用户头像">
                <template slot-scope="scope">
                    <span><img style="width:32px;height:32px" :src="scope.row.Headimgurl"/></span>
                </template>
            </el-table-column>
            <el-table-column prop="Nickname" show-overflow-tooltip align="center" label="微信昵称"></el-table-column>
            <el-table-column prop="FansName" align="center" label="用户名称"></el-table-column>
            <el-table-column prop="FansTypeValue" align="center" label="用户类型"></el-table-column>
            <el-table-column prop="FansMoblie" align="center" label="手机号码"></el-table-column>
            <el-table-column prop="FansProvince" align="center" label="所在省份"></el-table-column>
            <el-table-column prop="FansCity" align="center" label="所在城市"></el-table-column>
            <el-table-column prop="TotalRedPack" align="center" label="累计领取"></el-table-column>
            <el-table-column prop="TotalGold" align="center" label="账号余额"></el-table-column>
            <el-table-column prop="IsJoinBlack" align="center" label="列入黑名单"></el-table-column>
            <el-table-column prop="CreateDateTime" align="center" label="加入时间"></el-table-column>
            <el-table-column label="操作" align="center" fixed="right" width="300px">
              <template slot-scope="scope">
                <el-button
                size="mini"
                icon="el-icon-delete"
                type="primary"
                @click="updateFans(scope.row)">修改</el-button>
                <el-button
                size="mini"
                icon="el-icon-delete"
                type="danger"
                @click="deleFans(scope.row)">删除</el-button>
                <el-dropdown @command="handleCommand($event,scope.row)">
                    <el-button style="margin-left:10px" size="mini" type="primary">
                        更多<i class="el-icon-arrow-down el-icon--right"></i>
                    </el-button>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item divided command="auth" icon="el-icon-s-grid">查看授权</el-dropdown-item>
                        <el-dropdown-item divided command="log" icon="el-icon-document">领取记录</el-dropdown-item>
                        <el-dropdown-item divided command="cut" icon="el-icon-remove">黑名单</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
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
        <el-dialog :title="dialogTitle" :visible.sync="fansDialog" width="30%"  @close="fansDialog=false">
            <el-form :model="fansForm" ref="fansForm" label-width="100px">
                <el-form-item label="用户名称" prop="_fansname">
                    <el-input size="small" style="width:90%" v-model="fansForm._fansname" placeholder="请填写用户的名称" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="手机号码" prop="_moblie">
                    <el-input size="small" style="width:90%" v-model="fansForm._moblie" placeholder="请填写用户的手机号码" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="用户类型" prop="_fanstype">
                    <el-select style="width:90%" size="small" v-model="fansForm._fanstype" placeholder="请选择用户类型">
                        <el-option
                            v-for="item in userType"
                            :key="item.ID"
                            :label="item.SysValue"
                            :value="item.ID">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button size="medium"  type="primary" @click="save('fansForm')">确 定</el-button>
                <el-button size="medium" style="margin-left:60px" @click="fansDialog= false">取 消</el-button>
            </div>
        </el-dialog>
        <el-dialog :title="authTitle" :visible.sync="authDialog" width="30%" @close="authDialog=false">
            <div class="qrcode" id="qrcode" ref="qrcode"></div>
        </el-dialog>
        <el-dialog :title="logTitle" :visible.sync="logDialog" width="60%" @close="logDialog=false">
            <el-form :model="logForm" ref="logForm" label-width="80px" :inline="true" size="small">
                <el-form-item label="日期范围" prop="time">
                    <el-date-picker
                        style="width:220px"
                        v-model="logForm.time"
                        type="daterange"
                        unlink-panels
                        range-separator="至"
                        value-format="yyyy-MM-dd"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="搜索内容" prop="search_text">
                    <el-input style="width:220px" clearable="" v-model="logForm.search_text" placeholder="关键字…"></el-input>
                </el-form-item>
                <el-form-item > 
                    <el-button size="small" type="primary" icon="el-icon-search" @click="queryLog">查询</el-button>
                    <el-button size="small" icon="el-icon-refresh" @click="resetLog('logForm')">重置</el-button>
                </el-form-item>
            </el-form>
            <el-table
            :data="drawLogData"
            :header-cell-style="{background:'#FAFAFA',color:'#606266',height:'50px'}"
            border
            stripe
            highlight-current-row
            size="small"
            class="trace-table"
            style="width: 100%">
                <el-table-column prop="Code" align="center" label="微信红包密码"></el-table-column>
                <el-table-column prop="CreateDateTime" align="center" label="红包领取时间"></el-table-column>
                <el-table-column prop="ExchangeMoney" align="center" width="120px" label="红包领取金额"></el-table-column>
                <el-table-column prop="WeiXinBillId" align="center" label="红包发放单号"></el-table-column>
            </el-table>
        </el-dialog>
  </div>
</template>

<script>
import { getWeixinFans,addWeixinFans,exportsLog} from '@/api/market/redEnv'
import {getPdaModel} from '@/api/sysFun/system'
import QRCode from 'qrcodejs2'
export default {
    data(){
        return{
            total:0,
            logTotal:0,
            queryForm:{
                type:'WeiXinFans',
                page:1,
                rows:20,
                start:'',
                end:'',
                search_text:'',
                time:[]
            },
            fansForm:{
                _fansname:'',
                _moblie:'',
                _fanstype:'',
                _id:0
            },
            logForm:{
                type:'SingleFansReceiveRecord',
                time:[],
                start:'',
                search_type:undefined,
                end:'',
                search_text:undefined,
            },
            tableData:[],
            drawLogData:[],
            userType:[],
            fansDialog:false,
            authDialog:false,
            logDialog:false,
            dialogTitle:'',
            authTitle:'',
            logTitle:'粉丝红包领取记录',
            baseUrl:'http://h.8vv.cn/'
        }
    },
    created(){
        this.getList()
        this.getUserType()
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
        getLog(){
            var arr=Object.assign({},this.logForm)
            if(arr.time){
                arr.start=arr.time[0]
                arr.end=arr.time[1]
            }
            delete arr.time
            getWeixinFans(arr).then(res=>{
                this.drawLogData=res.rows
                this.logTotal=res.total
            })
        },
        getUserType(){
            getPdaModel({},'Base_LoadSystemParm',42).then(res=>{
                this.userType=res
            })
        },
        addFans(){
            this.fansDialog=true
            this.dialogTitle='新增店员信息'
            this.fansForm={}
            this.fansForm._id=0
        },
        updateFans(row){
            this.fansDialog=true,
            this.dialogTitle='修改商品'
            var ob=Object.assign({},row)
            this.fansForm._id=ob.Id
            this.fansForm._fansname=ob.FansName
            this.fansForm._moblie=ob.FansMoblie
            this.fansForm._fanstype=ob.FansType
        },
        deleFans(row){
            var arr={
                _type:6,
                _id:row.Id,
            }
            this.$confirm(`确定删除当前用户信息吗?`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
                }).then(() => {
                    addWeixinFans(arr,'WeixinUser').then(res=>{
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
            var arr=Object.assign({},this.fansForm)
            if(Number(arr._id)==0){
                //新增
                arr._type=4
                addWeixinFans(arr,'WeixinUser').then(res=>{
                    if(res.errcode==0){
                        this.$message.success('新增成功')
                        this.fansDialog=false
                        this.getList()
                    }else{
                        this.$message.error(res.errmsg)
                    }
                })
            }else{
                //修改
                arr._type=5
                addWeixinFans(arr,'WeixinUser').then(res=>{
                    if(res.errcode==0){
                        this.$message.success('修改成功')
                        this.fansDialog=false
                        this.getList()
                    }else{
                        this.$message.error(res.errmsg)
                    }
                })
            }
        },
        handleCommand(command,info){
           switch (command){
               case 'auth':
                   if(info.Nickname){
                        this.$alert('当前用户已通过授权，不能再次授权！', '提示', {
                            confirmButtonText: '确定',
                            center:true,
                        });
                    }else{
                        //生成二维码
                        this.authDialog=true
                        this.authTitle=`[${info.FansName}]授权二维码`
                        this.$nextTick(function(){
                            this.qrcodeScan(info.UserKey)
                        })
                    }
                    break;
                case 'log':
                    this.logDialog=true
                    this.logForm.search_text=''
                    this.logForm.time=[]
                    this.logForm.search_type=info.Id
                    this.getLog()
                    break;
                case 'cut':
                    this.$confirm('确认将当前粉丝添加到黑名单中吗?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                        }).then(() => {
                            var arr={
                                _type:1,
                                _id:info.Id
                            }
                            addWeixinFans(arr,'WeixinUser').then(res=>{
                                if(res.errcode==0){
                                    this.$message.success('设置成功')
                                    this.getList()
                                }else{
                                    this.$message.error('请联系管理员')
                                }
                            })
                        }).catch(() => {  
                    });
                    break;
            }
        },
        qrcodeScan(params){
            let qrcode = new QRCode("qrcode", {
                width: 200, // 二维码宽度，单位像素
                height: 200, // 二维码高度，单位像素
                text: "http://dcs.fw12312.com/weixin/authorize.aspx?action=weixinauthorize&key="+params,// 生成二维码的链接
                correctLevel: QRCode.CorrectLevel.H 
            });
        },
        exportLog(){
            if(this.tableData.length==0){
                this.$message.warning('当前没有需要导出的数据')
                return;
            }
            this.$confirm('确认要导出粉丝信息吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
                }).then(() => {
                    var params={
                        type:'Export',
                        search_text:this.queryForm.search_text,
                        mode:'redpack_fans'
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
        reset(formName){
            this.$refs[formName].resetFields();
            this.getList()
        },
        resetLog(formName){
            this.$refs[formName].resetFields();
            this.getLog()
        },
        query(){
            this.queryForm.page=1
            this.getList()
        },
        queryLog(){
            this.getLog()
        }
    }
}
</script>

<style>
.dialog-footer{
    display: flex;
    width: 100%;
    align-items: center;
    justify-content: center;
}
.qrcode{
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>