import Vue from 'vue'
import VueRouter from 'vue-router'

import Main from '@/views/main/Main.vue'
import Home from '@/views/home/Home.vue'
import ArticleList from '@/views/article/ArticleList.vue'
import ArticleDetail from '@/views/article/ArticleDetail.vue'
import ArticleType from '@/views/article/ArticleType.vue'
import ArticlePublish from '@/views/article/ArticlePublish.vue'
import UserInfo from '@/views/user/UserInfo.vue'
import AvatarReplace from '@/views/user/AvatarReplace.vue'
import ResetPassword from '@/views/user/ResetPassword.vue'
import Login from '@/views/login/UserLogin.vue'
import FindPassword from '@/views/findPAssword/FindPassword.vue'
import Search from '@/views/search/Search.vue'
import Admin from '@/views/admin/Admin.vue'

Vue.use(VueRouter)

const router = new VueRouter({
  routes: [
    { path: '/', redirect: '/main' },
    {
      path: '/main',
      component: Main,
      children: [
        { path: '', redirect: 'home' },
        { path: 'home', component: Home },
        { path: 'articlelist', component: ArticleList },
        { path: 'articledetail/:id', component: ArticleDetail },
        { path: 'articletype', component: ArticleType },
        { path: 'articlepublish', component: ArticlePublish },
        { path: 'userinfo', component: UserInfo },
        { path: 'avatarreplace', component: AvatarReplace },
        { path: 'resetpassword', component: ResetPassword },
        { path: 'search', component: Search }
      ]
    },
    { path: '/login', component: Login },
    { path: '/findpassword', component: FindPassword },
    { path: '/admin', component: Admin }
  ]
})

export default router
