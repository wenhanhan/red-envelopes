import request from '@/utils/request'

export function getKey(params){
    return request({
      url: '/index/Key/getKey',
      method: 'get',
      params
    })
}
export function addKey(params){
    return request({
        url: '/index/Key/addKey',
        method: 'get',
        params
    })
}
export function updateKey(params){
    return request({
        url: '/index/Key/updateKey',
        method: 'get',
        params
    })
}
export function deleteKey(params){
    return request({
        url: '/index/Key/deleteKey',
        method: 'get',
        params
    })
}
export function createKey(params){
    return request({
        url: '/index/CreateKey/generateKeyPair',
        method: 'get',
        params
    })
}