<template>
  <div></div>
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
