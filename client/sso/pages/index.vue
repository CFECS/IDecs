<template>
  <div></div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator';

@Component
export default class Index extends Vue {
  created() {
    this.$router.replace('/login');
  }
}
</script>

<style></style>
