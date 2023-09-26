<template>
  <ul>
    <li v-for="page in pages" :key="page">
      <a @click="handlePageChange(page)" :class="page === activePage ? 'active' : ''">
        {{ page }}
      </a>
    </li>
  </ul>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'

export default defineComponent({
  props: {
    pages: {
      type: Array<number>,
      required: true,
    },
    activePage: {
      type: Number,
      required: true,
    },
  },
  emits: ['pageChanged'],

  setup() {
    const activePage = ref(1)

    const handlePageChange = (page: number) => {
      activePage.value = page
      // this.$emit('pageChanged', page)
    }

    return {
      activePage,
      handlePageChange,
    }
  },
})
</script>