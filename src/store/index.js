import Vue from 'vue'
import Vuex from 'vuex'
import user from './modules/user'
import board from './modules/board'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    user,
    board
  },
  strict: true
})