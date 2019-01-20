import { createHelpers } from 'vuex-map-fields';

const { getListField, updateListField } = createHelpers({
  getterType: 'getListField',
  mutationType: 'updateListField',
});

const state = {
  lists: [],
  cards: [],
  stakeholderslist: [],
  evidenceslist: [],
}

const getters = {
  getListField
}

const actions = {
  async getlists ({commit, dispatch}, id) {
    state.lists = []
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
          card.hover = false
          state.cards.push(card)
          card.desc.stakeholders.map( async (personid) => {
            let person = await Trello.cards.get(personid)
            card.tagsfrom.push(person.name)
          })
          let attach = await Trello.cards.get(card.id,{fields: 'attachments',attachments: true})
          if (attach.attachments.length != 0) {
            attach.attachments.map( async (att) => {
              let attachment = {}
              attachment.id = att.id
              attachment.name = att.name
              attachment.url = att.url
              if (att.previews.length != 0) {
                attachment.preview = att.previews[4]
              }
              card.attachments = await attachment
            })
          }
        })
        state.lists.push(list)
      }
    })
    dispatch('getstakeholders')
    dispatch('getevidences')
  },
  getstakeholders ({commit}) {
    state.lists.map(list => {
      if (list.name == '利害關係人') {
        list.cards.map( stakeholder => {
          state.stakeholderslist.push({
            'id': stakeholder.id,
            'name': stakeholder.name
          })
        })
      }
    })
  },
  getevidences ({commit}) {
    state.lists.map(list => {
      if (list.name == '佐證文件') {
        list.cards.map( evidence => {
          state.evidenceslist.push({
            'id': evidence.id,
            'name': evidence.name
          })
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