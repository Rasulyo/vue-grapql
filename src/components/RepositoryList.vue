<template>
  <div class="flex justify-center" v-if="loading">
    <p class="text-xl font-bold text-gray-500">Request is loading...</p>
  </div>
  <div class="flex justify-center" v-else-if="error">
    <p class="text-xl font-bold text-red-600">Request has failed!</p>
  </div>
  <div>
    <ul
      class="repositories"
    >
      <li class="" v-for="(repository, index) in repositories"
      :key="index">
        <Repository :repository="repository" :search-options="searchOptions" />
      </li>
    </ul>
    <button v-if="searchOptions.query.length" class="btn" @click="fetchNextPage">next</button>
    <button v-if="searchOptions.query" class="btn" @click="fetchPreviousPage">prev</button>
  </div>
</template>

<script lang="ts">
import { ref, toRefs, watch } from "vue";
import { SearchResultItemConnection } from "@octokit/graphql-schema";
import { SEARCH_REPOS } from "../graphql/documents";
import Repository from "./Repository.vue";
import Paginator from "./Paginator.vue";
import { useQuery } from "@vue/apollo-composable";

export default {
  name: "RepositoryList",
  components: {
    Repository,
    Paginator
  },
  props: {
    ownRepositories: {
      type: Array,
      default: () => [],
    },
    searchOptions: {
      type: Object,
      default() {
        return { query: "", limit: 10, after: "" };
      }
    },
    after: {
      type: String,
      required: true
    },
  },
  setup(props: { searchOptions: Record<string, any>, ownRepositories: Record<string, any> }) {
    const { searchOptions, ownRepositories } = toRefs(props);
    const { result, loading, error } = useQuery<{
      search: SearchResultItemConnection;
    }>(SEARCH_REPOS, searchOptions);

    const repositories = ref([]);
    
    watch([props, ownRepositories, result], () => {
      repositories.value = props.searchOptions.query.trim() ? (result.value?.search.edges || []) : ownRepositories.value;
    });

    const isPrev = result.value?.search.pageInfo.hasPreviousPage
    const fetchNextPage = () => {
      searchOptions.value.after = result.value?.search.pageInfo.endCursor;
    };

    const fetchPreviousPage = () => {
      searchOptions.value.after = result.value?.search.pageInfo.startCursor;
    };

    return {
      loading,
      error,
      repositories: repositories,
      Repository,
      isPrev,
      fetchNextPage,
      fetchPreviousPage,
      searchOptions
    };
  }
};
</script>

<style scoped>
.repositories {
  gap: 10px;
  display: flex;
  margin: 10px auto;
  flex-direction: column;
}

.btn{
  border: 1px solid white;
  border-radius: 5px;
  background: transparent;
  color: whitesmoke;
  cursor: pointer;
  padding: 0 10px;
  margin-right: 10px;
}
</style>