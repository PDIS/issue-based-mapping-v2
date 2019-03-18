import { createHelpers } from 'vuex-map-fields';

const { getListField, updateListField } = createHelpers({
  getterType: 'getListField',
  mutationType: 'updateListField',
});

const state = {
  lists: [],
  cards: [],
  stakeholders: [],
  evidences: [],
  stakeholderList : {
    id: '',
    name: '',
    color: '',
    cards: [],
    column: '',
  },
  evidenceList : {
    id: '',
    name: '',
    color: '',
    cards: [],
    column: '',
  },
}

const getters = {
  getListField
}

const actions = {
  async getlists ({commit, dispatch}, id) {
    /* state.lists = [] */
    let newLists = []
    let newCards = []
    let listarray = await Trello.boards.get(id + '/lists',{cards: 'open'})
    listarray.map( async (l) => {
      if (l.name != '專有名詞字典') {
        let list = {}
        list.id = l.id
        list.name = l.name
        list.cards = l.cards
        switch (list.name)
        {
          case '問題面向':
            list.color = '#FFCD13'
            list.column = 1
            break
            case '問題細節':
            list.color = '#FFE276'
            list.column = 2
            break
            case '現有解法':
            list.color = '#91AD70'
            list.column = 3
            break
            case '政府回應':
            list.color = '#F08B8B'
            list.column = 4
            break
            case '困難':
            list.color = '#C85938'
            list.column = 5
            break
            case '利害關係人':
            list.color = '#0097A7'
            list.column = 6
            break
            case '佐證文件':
            list.color = '#CFD8DC'
            list.column = 7
            break
            default:
            list.color = 'teal'
            break
        }
        list.cards.map( async (card) => {
          card.desc = JSON.parse(card.desc)
          card.color = '#FBF0D3'
          card.categorycolor = list.color
          card.column = list.column
          card.listname = list.name
          card.hover = false
          newCards.push(card)
        })
        newLists.push(list)
      }
      state.cards = newCards
      state.lists = newLists
    })
    dispatch('getstakeholders')
    dispatch('getevidences')
  },
  getstakeholders ({commit}) {
    state.stakeholders = []
    state.lists.map(list => {
      if (list.name == '利害關係人') {
        state.stakeholderList.id = list.id
        state.stakeholderList.name = list.name
        state.stakeholderList.cards = list.cards
        state.stakeholderList.color = '#0097A7'
        state.stakeholderList.column = 6
        list.cards.map( stakeholder => {
          state.stakeholders.push(stakeholder)
        })
      }
    })
  },
  getevidences ({commit}) {
    state.evidences = []
    state.lists.map(list => {
      if (list.name == '佐證文件') {
        state.evidenceList.id = list.id
        state.evidenceList.name = list.name
        state.evidenceList.cards = list.cards
        state.evidenceList.color = '#CFD8DC'
        state.evidenceList.column = 7
        list.cards.map( evidence => {
          state.evidences.push(evidence)
        })
      }
    })
  }, 
}

const mutations = {
  updateListField
}

export default {
  state,
  getters,
  actions,
  mutations
}