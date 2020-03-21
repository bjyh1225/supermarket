import Vue from 'vue'
import VueRouter from 'vue-router'

const Index = () => import('../views/index/Index')
const Cart = () => import('../views/cart/Cart')
const Category = () => import('../views/category/Category')
const Profile= () => import('../views/profile/Profile')
const Detail = () => import('../views/detail/Detail')

Vue.use(VueRouter)

const routes = [
  {
    path:'/',
    redirect:'/index'
  },
  {
    path:'/index',
    component: Index
  },
  {
    path:'/category',
    component: Category
  },
  {
    path:'/cart',
    component: Cart
  },
  {
    path:'/profile',
    component: Profile 
  },
  {
    path:'/detail/:iid',
    component: Detail 
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
