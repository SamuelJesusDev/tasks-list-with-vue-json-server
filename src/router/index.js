import Vue from 'vue'
import VueRouter from 'vue-router'
import Form from '../components/Form.vue'
import List from '../components/List.vue'
import Login from '../components/Login.vue'
import Register from '../components/Register.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/list',
    name: 'list',
    component: List,
  },
  {
    path: '/form',
    name: 'form',
    component: Form,
  },
  {
    path: '/login',
    name: 'login',
    component: Login,
  },
  {
    path: '/register',
    name: 'register',
    component: Register,
  },
  
]

const router = new VueRouter({
  mode: 'history',
//   base: process.env.BASE_URL,
  routes,
})
router.beforeEach((to, from, next)=>{
  if(to.name !=="login" && to.name !=="register" && !localStorage.getItem("authUser")){
    next({path: '/login'});
  }else{
    next();
  }
})

export default router