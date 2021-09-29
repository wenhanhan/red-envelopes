import axios from "axios";
import { Notification,MessageBox,Loading,Message } from "element-ui";
import { Promise } from "core-js";
import { getToken } from '@/utils/auth' 
//开始加载动画
let loading;
let loadingCount=0;
function startLoading(){
    if(loadingCount===0){
        loading=Loading.service({
            spinner:'el-icon-loading',
            background:'rgba(0,0,0,0)'
        })
    }
    loadingCount++;
}
//结束加载动画
function endLoading(){
    loadingCount--;
    if(loadingCount===0){
        loading.close()
    }
}

axios.defaults.headers['Content-Type']='application/json;charset=utf-8'
// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
axios.defaults.transformRequest = [function (data) {
    let ret = ''
    for (let it in data) {
      ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
    }
    return ret
}]
//创建axios实例
const service=axios.create({
    baseURL:process.env.VUE_APP_BASE_API,
    timeout:45000
})
//request拦截器
service.interceptors.request.use(
    config=>{
        //可发送token
      startLoading()
      const isToken = (config.headers || {}).isToken === false
      if (getToken() && !isToken) {
            config.headers['Authorization'] = 'Bearer ' + getToken()
        }
      if (config.method === 'post') {
        config.headers['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8'
      }
      return config
    },
    error=>{
        console.log(error)
        endLoading();
        Promise.reject(error)
    }
)
//响应拦截器
service.interceptors.response.use(res=>{
    console.log(res)
    if(res.status==200){
        endLoading();
        return res.data;
    }else{
        Notification.error({
            title:res.data.msg
        });
        endLoading();
        return res.data;
    }
},error=>{
    console.log('err',error)
    Message({
        message:error.message,
        type:'error',
        duration:5000
    });
    endLoading();
    return Promise.reject(error)
}
);
export default service