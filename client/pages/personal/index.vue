<template>
  <div>
    <Title>个人信息</Title>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator';

@Component
export default class Personal extends Vue {
  head() {
    return {
      title: this.$generateTitle('个人信息'),
    };
  }
}
</script>
