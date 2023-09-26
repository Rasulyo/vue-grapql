<template>
  <h1>
    Find
    <span>GitHub</span>
    Repositories:
  </h1>
  <SearchBar @search="search" />
  <RepositoryList :search-options="searchOptions" :ownRepositories="repositories" :after="searchOptions.after" />
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, ref, watch } from "vue";
import RepositoryList from "./components/RepositoryList.vue";
import SearchBar from "./components/SearchBar.vue";
import { useQuery } from "@vue/apollo-composable";
import { GET_OWN_REPOSITORIES, SEARCH_REPOS } from "./graphql/documents";

export default defineComponent({
  name: "App",
  components: {
    RepositoryList,
    SearchBar
  },
  setup() {
    const ownRepo = reactive({
      login: "Rasulyo",
    });

    const searchOptions = reactive({
      query: "",
      limit: 10,
      after: ''
    });
  

    const { result: ownRepositoriesResult, execute: executeOwnRepositories } = useQuery(
      GET_OWN_REPOSITORIES,
      ownRepo
    );

    const { result: searchResult , execute: executeSearch} = useQuery(
      SEARCH_REPOS,
      searchOptions
    );


    const search = async(query: string, after: string) => {
      searchOptions.query = query;
      searchOptions.after = after;
      
      if (!searchOptions.query.trim()) {
        await executeOwnRepositories();
      }
      await executeSearch();
    };

    const repositories = ref([]);

    watch([ownRepositoriesResult, searchResult], () => {
      if (!searchOptions.query.trim()) {
        repositories.value = ownRepositoriesResult.value.user.repositories.edges;
      } else {
        repositories.value = ownRepositoriesResult.value.user.repositories.edges;
      }
    });

    onMounted(() => {
      repositories.value = ownRepositoriesResult.value?.user.repositories.edges || [];
    });

    return {
      searchOptions,
      search,
      repositories,
    };
  }
});
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Martian+Mono&family=Merriweather:wght@300;400;700;900&family=Roboto:wght@100;400;700&display=swap');
body {
  background: black;
  box-sizing: border-box;
  margin: 0;
  padding: 10px;
  font-family: 'Martian Mono', monospace;
}

ul {
  margin: 0;
  padding: 0;
}
</style>
