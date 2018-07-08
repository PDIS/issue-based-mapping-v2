import Vue from 'vue'
import Router from 'vue-router'
import index from '@/components/index'
import board from '@/components/board'
import newcard from '@/components/newcard'
import test from '@/components/test'
import mindmap from '@/components/mindmap'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'index',
      component: index
    },
    {
      path: '/board/:id',
      name: 'board',
      component: board
    },
    {
      path: '/newcard',
      name: 'newcard',
      component: newcard
    },
    {
      path: '/test',
      name: 'test',
      component: test
    },
    {
      path: '/mindmap/:id',
      name: 'mindmap',
      component: mindmap
    }
  ]
})
