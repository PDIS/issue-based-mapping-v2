const state = {
  user: {
    'id':'',
    'name':'',
    'avatar': '',
    'email': ''
  },
  members: []
}

const getters = {
  user: state => state.user,
  members: state => state.members
}

const actions = {
  login ({ commit }) {
    Trello.authorize({name: 'PDIS議題分析表' ,expiration:'never',scope: { read: true, write: true },})
  },
  getuser ({ commit, dispatch }) {
    Trello.members.get('me', function (res) {
      commit('getuser', res)
    })
  },
  getmembers ({ commit }) {
    Trello.organizations.get('pdisimi',{'fields':'all'}, function(res) {
      commit('getmembers',res)
    })
  }
}

const mutations = {
  getuser (state, res) {
    state.user.id = res.id
    state.user.name = res.fullName
    if (res.avatarSource != 'none')
    {
      state.user.avatar = res.avatarUrl + '/50.png'
    }
  },
  getmembers (state, res) {
    res.memberships.map(m => {
      state.members.push(m.idMember)
    })
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}