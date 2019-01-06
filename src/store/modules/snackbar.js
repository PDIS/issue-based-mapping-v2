const state = {
  snackbar: {
    state: false,
    color: '',
    text: '',
  }
}

const getters = {
  snackbar: state => state.snackbar
}

const actions = {
  getsnackbar ({ commit }, snackbar) {
    commit('getsnackbar', snackbar)
  },
}

const mutations = {
  getsnackbar (state, snackbar) {
    state.snackbar.state = snackbar.state
    state.snackbar.color = snackbar.color
    state.snackbar.text = snackbar.text
  },
}

export default {
  state,
  getters,
  actions,
  mutations
}