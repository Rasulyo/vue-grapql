<template>
  <div v-if="loading">
    <p>Request is loading...</p>
  </div>
  <div v-else-if="error">
    <p>Request has failed!</p>
  </div>
  <div>
    <ul
      class="repositories"
    >
      <li class="" v-for="(repository, index) in repositories"
      :key="index">
        <Repository :repository="repository"/>
      </li>
    </ul>
    <Paginator :pages="pages" :activePage="activePage"/>
    <button class="btn" v-if="isNotMy.length" @click="fetchNextPage">next</button>
    <button class="btn" v-if="isPrev && isNotMy.length" @click="fetchPreviousPage">prev</button>
  </div>
</template>

<script lang="ts">
import { computed, ref} from "vue";
import Repository from "./Repository.vue";
import Paginator from "./Paginator.vue";
import { useStore } from 'vuex';

export default {
  name: "RepositoryList",
  components: {
    Repository,
    Paginator
  },
  setup() {
    const loading = ref(false);
    const error = ref(null);
    const store = useStore();

    const repositories = computed(() => {
      const query = store.getters.searchOptions.query?.trim();
      const result = store.getters.searchResults;
      return query ? result : store.getters.ownRepositories;
    });

    const pages = computed(() => store.getters.pages)
    const activePage = computed(() => store.getters.page)

    const isPrev = computed(() => store.getters.pageInfo?.hasPreviousPage);
    const isNotMy = computed(() => store.getters.searchResults);
    console.log({
      isNotMy,
      isPrev
    })

    const fetchNextPage = () => {
      const endCursor = store.getters.pageInfo?.endCursor;
      const res = { query: '', after: endCursor }; 
      store.dispatch('fetchPage', res);
    };

    const fetchPreviousPage = () => {
      const startCursor = store.getters.pageInfo?.startCursor;
      store.dispatch('fetchPage', { query: '', after: startCursor });
    };

    return {
      loading,
      error,
      repositories,
      isPrev,
      fetchNextPage,
      fetchPreviousPage,
      isNotMy,
      pages,
      activePage
    };
  },
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