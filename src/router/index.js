import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import index from '@/components/index'
import newboard from '@/components/newboard'
import board from '@/components/board'
import editboard from '@/components/editboard'
import test from '@/components/test'

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
      component: editboard
    },
    {
      path: '/HelloWorld',
      name: 'HelloWorld',
      component: HelloWorld
    },
    {
      path: '/test',
      name: 'test',
      component: test
    }
  ]
})
