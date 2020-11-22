<template>
  <div></div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator';

@Component({
  head() {
    return {
      title: this.$generateTitle('首页'),
    };
  },
})
export default class Index extends Vue {}
</script>
