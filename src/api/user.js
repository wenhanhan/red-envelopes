import request from '@/utils/request'

export function login_mock(data) {
  return request({
    url: '/vue-admin-template/user/login',
    method: 'post',
    data
  })
}
//登录接口
export function login(data) {
  return request({
    url: 'Ajax/Login.ashx?type=PC',
    method: 'post',
    data
  })
}
//查询企业授权信息
export function getInfo(params) {
  return request({
    url: 'Ajax/AdminGetData.ashx',
    method: 'get',
    params
  })
}

export function logout() {
  return request({
    url: '/vue-admin-template/user/logout',
    method: 'post'
  })
}
//修改密码
export function updatePwd(data,type) {
  return request({
    url: 'Ajax/AdminPostData.ashx?type='+type,
    method: 'post',
    data
  })
}
