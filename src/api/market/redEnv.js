import request from '@/utils/request'
export function getWeixinFans(params){
    return request({
        url:"Ajax/RedPackGetData.ashx",
        method:'get',
        params
    })
}
export function addWeixinFans(data,type){
    return request({
        url:"Ajax/RedPackPostData.ashx?type="+type,
        method:'post',
        data
    })
}
export function queryCode(data,type,code){
    return request({
        url:"Ajax/RedPackPostData.ashx?type="+type+'&code='+code,
        method:'post',
        data
    })
}
export function getRedPackType(data,type,search_type){
    return request({
        url:"Ajax/RedPackGetData.ashx?type="+type+'&search_type='+search_type,
        method:'post',
        data
    })
}
export function exportsLog(params){
    return request({
        url:"Ajax/ExcelData.ashx",
        method:'get',
        params
    })
}