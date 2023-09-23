<template>
    <div>
      <ul>
        <li v-for="user of result.users" :key="user.id">
          {{ user.firstname }} {{ user.lastname }}
        </li>
      </ul>
    </div>
  </template>
  
  <script lang="ts">
  
  import { useQuery } from '@vue/apollo-composable'
import gql from 'graphql-tag'

export default {
  setup () {
    const { result } = useQuery(gql`
      query getUsers {
        users {
          id
          firstname
          lastname
          email
        }
      }
    `)
      return {
        result,
      }
  },
}
  </script>