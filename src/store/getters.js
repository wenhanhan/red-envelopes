const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  permission_routes:state=>state.permission.routes,
  permission_addRouters:state=>state.permission.addRouters,
  name: state => state.user.name,
  loginName:state=>state.user.loginName,
  authInfo:state=>state.user.authInfo
}
export default getters
