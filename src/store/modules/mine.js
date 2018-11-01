import api from 'common/api'
const state = {
  list: [],
  pageIndex: 1
}
const getters = {}
const mutations = {
  resetList (state, newVal = []) {
    state.list = newVal
  },
  concatList (state, newVal = []) {
    state.list = state.list.concat(newVal)
  },
  setPageIndex (state, type = undefined) {
    if (type === undefined) {
      state.pageIndex += 1
    }
    if (type === 'reset') {
      state.pageIndex = 1
    }
  }
}
const actions = {
  load ({ state, commit }) {
    return api.fetch({
      work: 'getcustinfo',
      pagesize: 15,
      indexpage: state.pageIndex
    })
  }
}
export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
