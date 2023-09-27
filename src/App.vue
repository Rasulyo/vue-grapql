<template>
  <h1>
    Find
    <span>GitHub</span>
    Repositories:
  </h1>
  <SearchBar/>
  <RepositoryList />
</template>

<script lang="ts">
import { defineComponent, computed, onMounted } from "vue";
import { useStore } from "vuex";
import RepositoryList from "./components/RepositoryList.vue";
import SearchBar from "./components/SearchBar.vue";

export default defineComponent({
  name: "App",
  components: {
    RepositoryList,
    SearchBar,
  },
  setup() {
    const store = useStore();

    const searchOptions = computed(() => store.getters["repositories/searchOptions"]);
    const repositories = computed(() => store.getters["repositories/ownRepositories"]);

    const getOwnRep = async () => {
      await store.dispatch('fetchOwnRepositories');
    };

    onMounted( async() => {
      await getOwnRep();
    });

    return {
      searchOptions,
      repositories
    }; 
  },
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
