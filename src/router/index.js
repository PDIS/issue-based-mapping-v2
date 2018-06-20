import Vue from 'vue'
import Router from 'vue-router'
import index from '@/components/index'
import newboard from '@/components/newboard'
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
      path: '/newboard',
      name: 'newboard',
      component: newboard
    },
    {
      path: '/board/:id',
      name: 'board',
      component: board
    },
    {
      path: '/editboard/:id',
      name: 'editboard',
      component: newboard
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
