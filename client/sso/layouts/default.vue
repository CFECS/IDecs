<template>
  <div class="page">
    <div class="logo" />
    <div class="description">IDecs 低成本、完全开放、易于配置的身份管理服务</div>
    <Nuxt />
  </div>
</template>

<script lang="ts">
import { Component, Watch, Vue } from 'nuxt-property-decorator';
import { Route } from 'vue-router';
import { PAGE_TITLE } from '../types/constants';

@Component
export default class DefaultLayouts extends Vue {
  @Watch('$route', {
    immediate: true,
    deep: true,
  })
  routeChange(to: Route) {
    document.title = this.$generateTitle(PAGE_TITLE[to.name || 'default']);
  }
}
</script>
