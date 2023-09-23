<template>
    <ul>
      <li v-for="page in pages" :key="page">
        <a @click="activePage++">
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
  
    setup() {
      const activePage = ref(1)
  
      return {
        activePage,
      }
    },
  })
  </script>