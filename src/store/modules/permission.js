import {constantRoutes} from '@/router'
import {getRouters} from '@/api/menu'
import Layout from '@/layout/index'

const permission={
    state:{
        routes:[],
        addRoutes:[]
    },
    mutations:{
        SET_ROUTES:(state,routes)=>{
            state.addRoutes=routes
            state.routes=constantRoutes.concat(routes)
        }
    },
    actions:{
        //生成路由
        GenerateRoutes({commit}){
            return new Promise(resolve=>{
                //向后端请求路由
                getRouters().then(res=>{
                    const accessedRoutes=filterAsyncRouter(res)
                    accessedRoutes.push({path:'*',redirect:"/404",hidden:true})
                    commit('SET_ROUTES',accessedRoutes)
                    resolve(accessedRoutes)
                })
            })
        }
    }
}
//遍历后台传来的路由字符换
function filterAsyncRouter(asyncRouterMap){
    return asyncRouterMap.filter(route=>{
        if(route.component){
            if(route.component==='Layout'){
                route.component=Layout
                route.alwaysShow=true
                route.icon=route.icons
            }else{
                route.component=loadView(route.component)
                route.alwaysShow=false
                route.icon=route.icons
            }
            route.meta={}
            route.meta.title=route.menuname
            route.meta.icon=route.icon
        }
        if(route.children!=null&&route.children&&route.children.length){
            route.children=filterAsyncRouter(route.children)
        }
        return true
    })
}

// export const loadView=(view)=>{
//     return (resolve)=>require([`@/views/${view}`],resolve)
// }
export const loadView = (view) => {
    return (resolve) => require([`@/views/${view}.vue`], resolve)
}
export default permission