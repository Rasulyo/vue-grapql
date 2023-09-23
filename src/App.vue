<script lang="ts">
import { defineComponent, ref } from 'vue';
import Paginator from './components/Paginator.vue'
import { UseQueryReturn, useQuery } from '@vue/apollo-composable';
import { gql } from '@apollo/client';
import { Repository } from './components/types';

export default defineComponent({
  name: 'App',
  components: {
    Paginator
  },
  
  setup() {
    const searchQuery = ref('')
    const repositories = ref<Array<Repository>>([])
    const currentPage = ref(1)

    // Запрос списка репозиториев
    const data: UseQueryReturn<any, { variables: { searchQuery: any; page: any; }; }> = useQuery(gql`
      query {
        repositories(type: "public", search: $searchQuery, page: $page) {
          nodes {
            name
            stargazers_count
            updated_at
            html_url
          }
          total_count
        }
      }
    `, {
      variables: {
        searchQuery, // Передать пустую строку в качестве значения переменной при первом запросе данных
        page: currentPage,
      },
    })

    // Отображение списка репозиториев
    if (!data.loading) {
      console.log(repositories.value, 'repositories.value')
    }

    return {
      searchQuery,
      repositories,
      currentPage,
      // Изменение типа свойства `pages` на `Array<number>`
    }
  },
});
</script>

<template>
  <div>
    <a href="https://vitejs.dev" target="_blank">
      <img src="/vite.svg" class="logo" alt="Vite logo" />
    </a>
    <a href="https://vuejs.org/" target="_blank">
      <img src="./assets/vue.svg" class="logo vue" alt="Vue logo" />
    </a>
  </div>
  <HelloWorld msg="Vite + Vue" />
  <div>
    <h1>Github Repo Search</h1>

    <input v-model="searchQuery" type="text" placeholder="Search...">

    <ul v-for="repository of repositories" :key="repository.id">
      <li>
        <a :href="repository.html_url">
          {{ repository.name }}
        </a>
        <span>
          {{ repository.stargazers_count }} stars
          <br>
          {{ repository.updated_at }}
        </span>
      </li>
    </ul>

    <paginator :pages="pages" :activePage="currentPage"></paginator>
  </div>
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
