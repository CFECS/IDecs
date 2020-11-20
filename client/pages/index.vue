<template>
  <div></div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator';

@Component
export default class Index extends Vue {
  head() {
    return {
      title: this.$generateTitle('首页'),
    };
  }
}
</script>
