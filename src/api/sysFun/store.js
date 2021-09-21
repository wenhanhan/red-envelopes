import request from '@/utils/request'
export function deleteStore(data,type){
    return request({
        url:"Ajax/AdminPostData.ashx?type="+type,
        method: 'post',
        data
    })
}