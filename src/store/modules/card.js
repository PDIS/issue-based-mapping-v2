import { createHelpers } from 'vuex-map-fields';

const { getCardField, updateCardField } = createHelpers({
  getterType: 'getCardField',
  mutationType: 'updateCardField',
});

const state = {
  card: {
    id: '',
    title: '',
    desc: {
      explain:'',
      responsetime: 'nowadays',
      department: '',
      background: '',
      role: '',
      stakeholders: [],
      evidences: [],
      related: [],
      attachment: '',
      x: 0,
      y: 0
    },
  },
  opencard: false,
  editable: false,
  selectedlist: {},
  titlecolor: '',
  titlestyle: 'border-bottom: 0.5vh solid ' ,
  relatedlist: [],
  deleteCard: false,
  deletedID: '',
  attachsnackbar: false,
}

const getters = {
  getCardField
}

const actions = {
}

const mutations = {
  updateCardField
}

export default {
  state,
  getters,
  actions,
  mutations
}