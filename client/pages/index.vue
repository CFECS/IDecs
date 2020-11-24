<template>
  <div>
    <p v-for="item in 100" :key="item">{{ item }}</p>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator';

@Component({
  head() {
    return {
      title: this.$generateTitle(this.$t('COMMON.PAGE_TITLE.INDEX')),
    };
  },
})
export default class Index extends Vue {}
</script>
