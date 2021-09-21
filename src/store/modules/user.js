import { login, logout, getInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'

const getDefaultState = () => {
  return {
    token: getToken(),
    name: '',
    avatar: '',
    loginName:'',
    authInfo:{}
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_LOGINNAME:(state,name)=>{
    state.loginName=name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_AUTHINFO:(state,authInfo)=>{
    state.authInfo=authInfo
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { appid, account,password} = userInfo
    return new Promise((resolve, reject) => {
      login({ appid: appid.trim(), account: account.trim(),password: password }).then(response => {
        if(response.errcode=="0"){
          // const { data} = response 无效解构
          commit('SET_LOGINNAME',response.LoginName)
          commit('SET_TOKEN', response.LoginName)
          setToken('admin')
          resolve(response)
        }else{
          resolve(response)
        } 
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo({type:'Public_GetSystemInfo'}).then(response => {
        if (!response) {
          return reject('Verification failed, please Login again.')
        }
        commit('SET_NAME', response.companyname)
        commit('SET_AUTHINFO', response)
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        removeToken() // must remove  token  first
        resetRouter()
        commit('RESET_STATE')
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

