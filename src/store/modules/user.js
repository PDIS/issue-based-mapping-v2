const state = {
  user: {
    'id':'',
    'name':'',
    'avatar': ''
  },
}

const getters = {
  user: state => state.user,
}

const actions = {
  login ({ commit }) {
    Trello.authorize({name: '議題分析表' ,expiration:'never',scope: { read: true, write: true },})
  },
  getuser ({ commit, dispatch }) {
    Trello.members.get('me', function (res) {
      commit('getuser', res)
    }, dispatch('login'))
  },
}

const mutations = {
  getuser (state,res) {
    state.user.id = res.id
    state.user.name = res.fullName
    if (res.avatarSource != 'none')
    {
      state.user.avatar = res.avatarUrl + '/50.png'
    }
  },
}

export default {
  state,
  getters,
  actions,
  mutations
}