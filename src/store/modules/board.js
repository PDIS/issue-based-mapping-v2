import { createHelpers } from 'vuex-map-fields';

const { getBoardField, updateBoardField } = createHelpers({
  getterType: 'getBoardField',
  mutationType: 'updateBoardField',
});

const state = {
  boards: [],
  board: {
    id: '',
    name: '',
    desc:{
      'title': '',
      'person': '',
      'date': null,
      'department': '',
      'codepartment': '',
      'link': '',
      'issuesource': 'dep'
    },
    admin: [],
    members: [],
    avatars: [],
  },
  openboard: false,
  selectedboardid: '',
  openstakeholders: false,
  openevidences: false,
  boardtitledialog: false,
  search: '',
}

const getters = {
  /* board: state => state.board,
  boards: state => state.boards,
  openboard: state => state.openboard,
  selectedboardid: state => state.selectedboardid, */
  getBoardField
}

const actions = {
  getboardinfo ({ commit }, route) {
    Trello.boards.get(route, {'fields':'all'}, function(res) {
      commit('getboardinfo', res)
    })
  },
  getboards ({ commit }) {
    Trello.organizations.get('pdisimi/boards',{'filter':'open'}, function(res) {
      commit('getboards', res)
    })
  },
  editboard ({ commit }, id) {
    commit('editboard', id)
  },
}

const mutations = {
  getboardinfo (state, res) {
    state.board.admin = []
    state.board.members = []
    state.board.avatars = []
    state.board.id = res.id
    state.board.name = res.name
    state.board.desc = JSON.parse(res.desc)
    res.memberships.map( m => {
      if (m.memberType == 'admin') {
        state.board.admin.push(m.idMember)
        Trello.get('/members/' + m.idMember, (res) => {
          state.board.avatars.push(res.avatarUrl);
        })
      }
      else {
        state.board.members.push(m.idMember)
        Trello.get('/members/' + m.idMember, (res) => {
          state.board.avatars.push(res.avatarUrl);
        })
      }
    })
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
  editboard (state, id) {
    state.openboard = !state.openboard
    state.selectedboardid = id
  },
  updateBoardField
}

export default {
  state,
  getters,
  actions,
  mutations
}