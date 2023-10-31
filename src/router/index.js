import VueRouter from "vue-router";
const routes = [
    {
        path:'/',
        name:'login',
        component:()=>import('../components/LogIn.vue')
    },
    {
        path:'/Index',
        name:'IndexPage',
        component:()=>import('../components/IndexPage.vue'),
        children:[
            {
                path:'/Home',
                name:'Home',
                meta:{
                    title:'首页'
                },
                component:()=>import('../components/Home.vue')
            },
            {
                path:'/UserHome',
                name:'UserHome',
                meta:{
                  title:'个人中心'
                },
                component:()=>import('../components/UserHome.vue')
            },
            {
                path:'/Chat',
                name:'Chat',
                meta:{
                    title:'聊天室'
                },
                component:()=>import('../components/Chat.vue')
            },
            {
                path:'/Post/:postId',
                name:'Post',
                meta:{
                    title:'帖子详情'
                },
                component:()=>import('../components/Post.vue')
            },
        ]
    }
]
const router = new VueRouter({
    mode:'hash',/*去井号 history*/
    routes
})

//取消报错
const VueRouterPush = VueRouter.prototype.push
VueRouter.prototype.push = function push (to){
    return VueRouterPush.call(this, to).catch(err => err)
}

// 归零路径
export function resetRouter() {
    router.matcher = new VueRouter({
        mode:'history',
        routes:[]
    }).matcher
}
export default router;