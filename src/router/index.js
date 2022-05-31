import Vue from 'vue'
import VueRouter from 'vue-router'
import Form from '../components/Form.vue'
import List from '../components/List.vue'


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
  
]

const router = new VueRouter({
  mode: 'history',
//   base: process.env.BASE_URL,
  routes,
});

export default router