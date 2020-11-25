<template>
  <a-breadcrumb class="section no-cursor">
    <a-breadcrumb-item v-for="item in routes" :key="item.name">
      {{ item.name }}
    </a-breadcrumb-item>
  </a-breadcrumb>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator';

@Component
export default class Breadcrumb extends Vue {
  get routes() {
    return this.$route.matched;
  }
}
</script>
