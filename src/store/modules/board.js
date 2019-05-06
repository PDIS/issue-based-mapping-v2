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
    admins: [],
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
  async getboardinfo ({ commit }, route) {
    let data = await fetch("https://improxy.pdis.nat.gov.tw/getboardinfo/" + route)
    let boardinfo = await data.json()
    commit('getboardinfo', boardinfo)
    /* Trello.boards.get(route, {'fields':'all'}, function(res) {
      commit('getboardinfo', res)
    }) */
  },
  async getboards ({ commit }) {
    let data = await fetch("https://improxy.pdis.nat.gov.tw/getboards/")
    let boards = await data.json()
    commit('getboards', boards)
    /* Trello.organizations.get('pdisimi/boards',{'filter':'open'}, function(res) {
      commit('getboards', res)
    }) */
  },
  editboard ({ commit }, id) {
    commit('editboard', id)
  },
}

const mutations = {
  getboardinfo (state, res) {
    state.board.id = res.data.id
    state.board.name = res.data.name
    state.board.desc = JSON.parse(res.data.desc)
    state.board.admins = []
    state.board.members = []
    res.data.admins.map( admin => {
      state.board.admins.push(admin)
    })
    res.data.members.map( member => {
      state.board.members.push(member)
    })
    /* res.memberships.map( m => {
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
    }) */
  },
  getboards (state, res) {
    state.boards = []
    res.map(b => {
      let board = {};
      board.id = b.data.id
      board.title = b.data.name
      board.desc = JSON.parse(b.data.desc)
      board.admins = []
      b.data.admins.map( admin => {
        board.admins.push(admin)
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