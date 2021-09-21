import request from '@/utils/request'
export function getSystemInfo(params){
    return request({
        url:"Ajax/AdminGetData.ashx",
        method:'get',
        params
    })
}
export function setImage(params){
    return request({
        url:"Ajax/ImageData.ashx",
        method:'get',
        params
    })
}
export function deleteImage(data,type,image){
    return request({
        url:"Ajax/ImageData.ashx?type="+type+'&image='+image,
        method:'post',
        data
    })
}
//上传文件自定义封装
export function upload(data,type,image) {
    return request({
        url:"Ajax/ImageData.ashx?type="+type+'&image='+image,
        method: 'post',
        data
    })
}
export function getCheckInfo(data,type){
    return request({
        url:"Ajax/AdminGetData.ashx?type="+type,
        method:'post',
        data
    })
}
export function setQueryInfo(data,type){
    return request({
        url:"Ajax/AdminPostData.ashx?type="+type,
        method: 'post',
        data
    })
}