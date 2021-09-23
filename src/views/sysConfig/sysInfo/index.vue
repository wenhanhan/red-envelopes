<template>
   <div class="app-container">
        <el-table
            :data="tableData"
            :header-cell-style="{background:'#FAFAFA',color:'#606266',height:'50px'}"
            border
            stripe
            size="medium"
            class="trace-table"
            style="width: 100%">
             <el-table-column prop="SetTitle" align="center" label="设置类型" width="200px" ></el-table-column>
             <el-table-column prop="SetText" align="center" label="设置说明" ></el-table-column>
             <el-table-column prop="SetRemark" align="center" label="系统要求" ></el-table-column>
             <el-table-column prop="CreateDate" align="center" label="上线时间" width="200px"></el-table-column>
             <el-table-column label="设置" align="center" fixed="right" width="240px">
                <template slot-scope="scope">
                    <el-button
                    size="mini"
                    type="primary"
                    :icon="scope.row.Id==17?'el-icon-search':'el-icon-s-tools'"
                    @click="handleSet(scope.row)">{{scope.row.Id==17?'查询':'设置'}}</el-button>
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
    <el-dialog title="查询功能设置" :visible.sync="querySet" width="40%" @close="querySet=false">
        <el-form :model="queryFroms" label-width="150px" :rules="rules" ref="queryFroms">
            <el-form-item label="真货查询回复语：" prop="TrueReply">
                <el-input type="textarea" style="width:90%" v-model="queryFroms.TrueReply"></el-input>
            </el-form-item>
            <el-form-item label="假货查询回复语：" prop="FalseReply" >
                <el-input type="textarea" style="width:90%" v-model="queryFroms.FalseReply"></el-input>
            </el-form-item>
            <el-form-item label="重复查询回复语：" prop="RepeatReply" >
                <el-input type="textarea" style="width:90%" v-model="queryFroms.RepeatReply"></el-input>
            </el-form-item>
            <el-form-item label="限制码查询次数：" prop="LimitCount">
                <el-input size="small" style="width:90%" v-model="queryFroms.LimitCount" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="超过限制回复语：" prop="LockReply">
                <el-input type="textarea" style="width:90%" v-model="queryFroms.LockReply"></el-input>
            </el-form-item>
            <el-form-item label="物流码查询密码：" prop="QueryPassword">
                <el-input size="small" style="width:90%" v-model="queryFroms.QueryPassword" type="password" autocomplete="off"></el-input>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button size="medium"  type="primary" @click="save('queryFroms')">确 定</el-button>
            <el-button size="medium" style="margin-left:60px" @click="querySet= false">取 消</el-button>
        </div>
    </el-dialog>
    <el-dialog title="设置企业信息" :visible.sync="companyInfoSet" width="40%" @close="companyInfoSet=false">
        <el-tabs type="border-card" v-model="activeName">
            <el-tab-pane label="关于我们" name="AboutUs">
                <el-input
                type="textarea"
                :autosize="{ minRows: 8, maxRows: 10}"
                placeholder="关于我们"
                v-model="companyInfo.AboutUs">
                </el-input>
            </el-tab-pane>
            <el-tab-pane label="联系我们" name="ContactUs">
                <el-input
                type="textarea"
                :autosize="{ minRows: 8, maxRows: 10}"
                placeholder="联系我们"
                v-model="companyInfo.ContactUs">
                </el-input>
            </el-tab-pane>
        </el-tabs>
        <div slot="footer" class="dialog-footer">
            <el-button size="medium"  type="primary" @click="saveCompanyInfo()">确 定</el-button>
            <el-button size="medium" style="margin-left:60px" @click="companyInfoSet= false">取 消</el-button>
        </div>
    </el-dialog>
    <el-dialog title="序列密码反查" :visible.sync="checkDialog" width="40%">
        <el-row :gutter="10" type="flex" justify="center">
            <el-col :span="20">
                <div class="demo-input-suffix">
                    查询内容：
                    <el-input
                        size="small"
                        style="width:60%"
                        placeholder="请输入查询内容"
                        prefix-icon="el-icon-search"
                        v-model="checkText">
                    </el-input>
                    <el-button style="margin-left:10px" size="small" type="primary" @click="check">查 询</el-button>
                </div>
                <div class="demo-input-suffix" style="margin:20px 0">
                    查询结果：
                    <el-input
                        size="small"
                        style="width:60%"
                        placeholder="查询结果"
                        disabled
                        v-model="checkRes">
                    </el-input>
                </div>
            </el-col>
        </el-row>
    </el-dialog>
    <el-dialog title="企业资质证件管理" :visible.sync="certificatesDialog" width="40%" @close="certificatesDialog=false">
        <el-row style="margin-bottom:15px">
            <el-button type="primary" icon="el-icon-circle-plus-outline" @click="uploadCert" size="mini">添加资质</el-button>
            <el-button type="primary" icon="el-icon-picture-outline" @click="preview" size="mini">预览资质</el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteCert">删除资质</el-button>
        </el-row>
        <el-table
            :data="certificatesData"
            :header-cell-style="{background:'#FAFAFA',color:'#606266',height:'50px'}"
            border
            stripe
            size="medium"
            highlight-current-row
            @current-change="handleCurrentChange"
            class="trace-table"
            empty-text="--"
            style="width: 100%">
            <el-table-column prop="ImageName" align="center" label="图片名称" ></el-table-column>
            <el-table-column prop="UploadTime" align="center" label="上传时间" ></el-table-column>
            <el-table-column prop="FileSize" align="center" label="文件大小" ></el-table-column>
        </el-table>
    </el-dialog>
    <!-- 预览 -->
    <el-dialog title="图片预览" :visible.sync="certificatesPreviewDialog" width="40%" >
        <el-row style="display:flex;justify-content:center">
            <el-image :src="dialogImageUrl"></el-image>
        </el-row>
    </el-dialog>
    <el-dialog title="资质图片上传" :visible.sync="certificatesUploadDialog" width="40%" >
        <el-row style="display:flex;justify-content:center">
            <el-upload
            drag
            multiple
            :before-upload = "beforeUp"
            :on-success="succesUp"
            :data="fileInfo"
            :show-file-list="false"
            name="Filedata"
            :action="uploadurl"
            >
                <i class="el-icon-upload" />
                <div class="el-upload__text">
                    将文件拖到此处，或
                    <em>点击上传</em>
                </div>
                <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
            </el-upload>
        </el-row>
    </el-dialog>
   </div>
</template>

<script>
import { getSystemInfo ,setQueryInfo,getCheckInfo,setImage,deleteImage,upload} from '@/api/sysFun/system'
import { mapGetters } from 'vuex'
export default {
    data(){
        return{
            total:0,
            querySet:false,
            companyInfoSet:false,
            checkDialog:false,
            certificatesDialog:false,
            certificatesPreviewDialog:false,
            certificatesUploadDialog:false,
            queryFroms:{
                TrueReply:'',
                FalseReply:'',
                RepeatReply:'',
                LimitCount:'',
                LockReply:'',
                QueryPassword:''
            },
            companyInfo:{
                AboutUs:'',
                ContactUs:''
            },
            queryForm:{
                type:'Base_SystemItem',
                page:1,
                rows:15
            },
            fileInfo:{
                // Appid:this.authInfo.companyid,
                // mark:this.authInfo.companyid
            },
            checkText:'',
            checkRes:'',
            currentRow: null,
            dialogImageUrl:null,
            file: {
                fileName: '',
                filePath: ''
            },
            uploadurl: '',
            rules:{
                TrueReply: [
                    { required: true, message: '请输入真货查询回复语', trigger: 'change' }
                ],
                FalseReply: [
                    { required: true, message: '请输入假货查询回复语', trigger: 'change' }
                ],
                RepeatReply: [
                    { required: true, message: '请输入重复查询回复语', trigger: 'change' }
                ],
                LimitCount: [
                    { required: true, message: '请输入限制码查询次数', trigger: 'change' }
                ],
                LockReply: [
                    { required: true, message: '请输入超过限制回复语', trigger: 'change' }
                ],
                QueryPassword: [
                    { required: true, message: '请输入物流码查询密码', trigger: 'change' }
                ],
            },
            tableData:[],
            certificatesData:[],
            activeName:'ContactUs'
        }
    },
    created(){
        this.getList()
        this.fileInfo.Appid=this.authInfo.companyid
        this.fileInfo.mark=this.authInfo.companyid
    },
    mounted() {
        this.uploadurl = 'Ajax/ImageData.ashx?type=Upload_Image&image=Paperwork'
    },
    computed: {
        ...mapGetters([
        'authInfo'
        ])
    },
    methods:{
        getList(){
            getSystemInfo(this.queryForm).then(res=>{
                this.tableData=res.rows
                this.total=res.total
            })
        },
        handleSet(row){
            switch(row.Id){
                case 5:
                    this.$alert('采用红包托管方式,您不需要设置此项', '对接说明', {
                        confirmButtonText: '确定',
                        center: true,
                    });
                    break;
                case 9:
                    this.querySet=true;
                    getSystemInfo({type:'Set_GetQuerySystem'}).then(res=>{
                        this.queryFroms=res
                    })
                    break;
                case 10:
                    this.companyInfoSet=true
                    getSystemInfo({type:'Set_GetCompanyInfo'}).then(res=>{
                        this.companyInfo=res
                    })
                    break;
                case 17:
                    this.checkDialog=true
                    this.checkText='',
                    this.checkRes=''
                    break;
                case 18:
                    this.certificatesDialog=true
                    this.getCert()
                    this.dialogImageUrl=undefined
            }
        },
        save(formName){
            var arr={}
            arr._limitcount=this.queryFroms.LimitCount
            arr._true=this.queryFroms.TrueReply
            arr._false=this.queryFroms.FalseReply
            arr._repeal=this.queryFroms.RepeatReply
            arr._lock=this.queryFroms.LockReply
            arr._querypassword=this.queryFroms.QueryPassword
             this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.$confirm('请仔细核对当前填写的信息是否正确?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                        }).then(() => {
                            setQueryInfo(arr,'Set_QuerySystem').then(res=>{
                                if(res.errcode==0){
                                    this.$message.success('保存成功')
                                    this.querySet=false
                                }else{
                                    this.$message.error(data.errmsg)
                                }
                            })
                        }).catch(() => {      
                    });
                } else {
                    return false;
                }
            });
        },
        saveCompanyInfo(){
            var arr={}
            arr._about=this.companyInfo.AboutUs
            arr._contact=this.companyInfo.ContactUs
            this.$confirm('确认要继续修改企业信息吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
                }).then(() => {
                    setQueryInfo(arr,'Set_CompanyInfo').then(res=>{
                        if(res.errcode==0){
                            this.$message.success('保存成功')
                            this.companyInfoSet=false
                        }else{
                            this.$message.error(res.errmsg)
                        }
                    })
                }).catch(() => {      
            });
        },
        check(){
            getCheckInfo({_code:this.checkText},'NumberToEncryption').then(res=>{
                this.checkRes=res
            })
        },
        getCert(){
            setImage({
                image:'Paperwork',
                type:'Load_Image',
                mark:this.authInfo.companyid
            }).then(res=>{
                this.certificatesData=res
            })
        },
        handleCurrentChange(val) {
            this.currentRow = val;
            this.dialogImageUrl=window.location.origin+'/ServiceImage/Paperwork/'+this.authInfo.companyid+'/'+val.ImageName
        },
        preview(){
            if(!this.dialogImageUrl) return;
            this.certificatesPreviewDialog=true
        },
        uploadCert(){
            this.certificatesUploadDialog=true
        },
        deleteCert(){
            var arr={
                imagename:this.currentRow.ImageName,
                mark:this.authInfo.companyid
            }
            this.$confirm(`是否删除${this.currentRow.ImageName}?`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
                }).then(() => {
                    deleteImage(arr,'Delete_Image','Paperwork').then(res=>{
                        if(Number(res)==1){
                            this.$message.success('删除成功')
                            this.getCert()
                        }else{
                            this.$message.error('请联系管理员')
                        }
                    })
                }).catch(() => {    
            });
        },
        succesUp(file){
           this.$message.success('上传成功')
           this.certificatesUploadDialog=false
           this.getCert() 
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
