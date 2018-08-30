const state = {
  boards: [],
  board: {
    id: '',
    name: '',
    desc: {
      'title': '',
      'person': '',
      'date': null,
      'department': '',
      'link': ''
    },
  },
  boardform: false,
  selectedboardid: ''
}

const getters = {
  board: state => state.board,
  boards: state => state.boards,
  boardform: state => state.boardform,
  selectedboardid: state => state.selectedboardid
}

const actions = {
  getboardinfo ({ commit }, route) {
    Trello.boards.get(route, function(res) {
      commit('getboardinfo', res)
    })
  },
  getboards ({ commit }) {
    Trello.organizations.get('pdisimi/boards',{'filter':'open'}, function(res) {
      commit('getboards', res)
    })
  },
  changeboardform ({ commit }, id) {
    commit('changeboardform', id)
  },
}

const mutations = {
  getboardinfo (state, res) {
    state.board.id = res.id
    state.board.name = res.name
    state.board.desc = JSON.parse(res.desc)
  },
  getboards (state, res) {
    state.boards = []
    res.map(b => {
      let board = {};
      board.id = b.id
      board.title = b.name
      board.desc = JSON.parse(b.desc)
      board.admin = []
      b.memberships.map( m => {
        if (m.memberType == 'admin') {
          board.admin.push(m.idMember)
        }
      })
      state.boards.push(board)
    })
  },
  changeboardform (state, id) {
    state.boardform = !state.boardform
    state.selectedboardid = id
  },
}

export default {
  state,
  getters,
  actions,
  mutations
}