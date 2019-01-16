import { createHelpers } from 'vuex-map-fields';

const { getDictionaryField, updateDictionaryField } = createHelpers({
  getterType: 'getDictionaryField',
  mutationType: 'updateDictionaryField',
});

const state = {
  opendictionary: false
}

const getters = {
  getDictionaryField
}

const actions = {
}

const mutations = {
  updateDictionaryField
}

export default {
  state,
  getters,
  actions,
  mutations
}