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
  // 分页拼接
  concatList (state, newVal = []) {
    state.list = state.list.concat(newVal)
  },
  // 更改单个数据
  updateListItem (state, obj) {
    let index = state.list.findIndex(ele => ele.ID === obj.ID)
    state.list[index] = obj
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
