import { createStore } from 'vuex';

export default createStore({
  state: {
    ownRepositories: [],
    searchOptions: {
      query: '',
      limit: 10,
      after: '',
    },
  },
  mutations: {
    setOwnRepositories(state, repositories) {
      state.ownRepositories = repositories;
    },
    setSearchOptions(state, options) {
      state.searchOptions = options;
    },
  },
  actions: {
    async fetchOwnRepositories({ commit }) {
      // Здесь выполните запрос к API GitHub для получения собственных репозиториев
      // Затем вызовите мутацию setOwnRepositories для обновления состояния
    },
    async searchRepositories({ commit }, { query, after }) {
      // Здесь выполните запрос к API GitHub для поиска репозиториев
      // Затем вызовите мутацию setSearchOptions для обновления состояния
    },
  },
  getters: {
    ownRepositories(state) {
      return state.ownRepositories;
    },
    searchOptions(state) {
      return state.searchOptions;
    },
  },
});
