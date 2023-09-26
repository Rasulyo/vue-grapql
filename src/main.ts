import App from './App.vue'
import { createApp, provide, h } from 'vue'
import { DefaultApolloClient } from '@vue/apollo-composable'
import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client/core'

// const githubToken = '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'; 
const githubToken = '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'; 

const httpLink = createHttpLink({
  uri: 'https://api.github.com/graphql',
  headers: {
    Authorization: `Bearer ${githubToken}`, 
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
app.mount("#app")