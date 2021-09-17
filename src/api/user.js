import request from '@/utils/request'

export function login_mock(data) {
  return request({
    url: '/vue-admin-template/user/login',
    method: 'post',
    data
  })
}
export function login(params) {
  return request({
    url: '/index/User/login',
    method: 'get',
    params
  })
}

export function getInfo(token) {
  return request({
    url: '/vue-admin-template/user/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/vue-admin-template/user/logout',
    method: 'post'
  })
}
