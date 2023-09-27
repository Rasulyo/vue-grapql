import { createStore } from 'vuex';
import { useLazyQuery } from '@vue/apollo-composable';
import { HttpLink, ApolloClient, InMemoryCache } from "@apollo/client/core";
import { GET_OWN_REPOSITORIES, SEARCH_REPOS } from '../graphql/documents';

export default createStore({
  state: {
    ownRepositories: [],
    searchQuery: '',
    searchResults: [],
    searchOptions: {
      query: '',
      limit: 10,
      after: null,
    },
    pageInfo: {
      endCursor: null,
      startCursor: null,
      hasPreviousPage: false,
      hasNextPage: false
    },
    pages: null,
    page: 1
  },
  mutations: {
    setOwnRepositories(state, repositories) {
      state.ownRepositories = repositories;
    },
    setSearchOptions(state, options) {
      state.searchOptions.query = options.query;
      state.searchOptions.after = options.after;
    },
    setSearchQuery(state, query) {
      state.searchQuery = query;
    },
    setSearchResults(state, repos){
      state.searchResults = repos;
    },
    setPageInfo(state, pageInfo){
      state.pageInfo = pageInfo.pageInfo
    }
  },
  actions: {
    async fetchOwnRepositories({ commit }) {
      const { load } = useLazyQuery(GET_OWN_REPOSITORIES, { login: 'Rasulyo' });
      const result = await load();
      if (result) {
        commit('setOwnRepositories', result.user.repositories.edges);
      } else {
        console.error('Error fetching own repositories:');
      } 
    },
    async searchRepositories({ commit }, query: any) {
      commit('setSearchOptions', query);
      // because of request out of component was error  
      const apolloClient = new ApolloClient({
        link: new HttpLink({
          uri: 'https://api.github.com/graphql',
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_TOKEN}`,
          },
        }),
        cache: new InMemoryCache(),
      });
    
      const options = this.state.searchOptions;
      const offset = (this.state.page - 1) * this.state.searchOptions.limit;
      const result = await apolloClient.query({
        query: SEARCH_REPOS,
        variables: {
          query: options.query,
          limit: options.limit,
          after: options.after,
          offset,
        },
      });
      if (result) {
        commit('setSearchResults', result.data.search.edges);
        commit('setPageInfo', result.data.search);
      } else {
        console.error('Error searching repositories:');
      }
    },
    async fetchPage({commit}, data){
      commit('setPageInfo', data)
      const apolloClient = new ApolloClient({
        link: new HttpLink({
          uri: 'https://api.github.com/graphql',
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_TOKEN}`,
          },
        }),
        cache: new InMemoryCache(),
      });
      const options = this.state.searchOptions;

      const result = await apolloClient.query({
        query: SEARCH_REPOS,
        variables: options,
      });
      if (result) {
        commit('setSearchResults', result.data.search.edges);
        commit('setPageInfo', result.data.search);
      } else {
        console.error('Error searching repositories:');
      }
    }
  },
  getters: {
    ownRepositories(state) {
      return state.ownRepositories;
    },
    searchOptions(state) {
      return state.searchOptions;
    },
    searchQuery(state) {
      return state.searchQuery;
    },
    searchResults(state) {
      return state.searchResults;
    },
    pageInfo(state){
      return state.pageInfo;
    },
    pages(state){
      return state.pages
    },
    getPage(state){
      return state.page
    }
  },
});
