import request from '@/utils/request'
//获取路由
export function getRouters(params){
    return request({
        url:"Ajax/Menu.ashx",
        method:'get',
        params
    })
}