import { createApp, provide, h } from 'vue'
import { DefaultApolloClient } from '@vue/apollo-composable'
import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client/core'
import App from './App.vue'
import store from './store/store';
import { GITHUB_TOKEN } from './utils/constant';

const httpLink = createHttpLink({
  uri: 'https://api.github.com/graphql',
  headers: {
    Authorization: `Bearer ${GITHUB_TOKEN}`, 
  },
})

const apolloClient = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
})

const app = createApp({
  setup () {
    provide(DefaultApolloClient, apolloClient)
  },

  render: () => h(App),
})
app.provide("$store", store);
app.use(store);
app.mount("#app")