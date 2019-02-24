import Vue from 'vue'
import Router from 'vue-router'
import index from '@/components/index'
import board from '@/components/board'
import mindmap from '@/components/mindmap'
import printout from '@/components/printout'
import mindmapv2 from '@/components/mindmap-v2'

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
      path: '/mindmap/:id',
      name: 'mindmap',
      component: mindmapv2
    },
    {
      path: '/printout/:id',
      name: 'printout',
      component: printout
    },
    {
      path: '/mindmap-v2/:id',
      name: 'mindmapv2',
      component: mindmapv2
    },
  ]
})
