import Vue from 'vue'
import Vuex from 'vuex'
import user from './modules/user'
import board from './modules/board'
import card from './modules/card'
import list from './modules/list'
import dictionary from './modules/dictionary'
import snackbar from './modules/snackbar'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    user,
    board,
    card,
    list,
    dictionary,
    snackbar
  },
  namespaced: true,
})