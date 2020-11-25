<template>
  <a-breadcrumb class="section breadcrumb">
    <a-breadcrumb-item v-for="(item, index) in routes" :key="item.name">
      <nuxt-link v-if="index !== routes.length - 1" :to="item.path">
        <a-icon v-if="item.meta.icon" :type="item.meta.icon" />
        {{ $t(item.meta.title) }}
      </nuxt-link>
      <template v-else>
        <a-icon v-if="item.meta.icon" :type="item.meta.icon" />
        {{ $t(item.meta.title) }}
      </template>
    </a-breadcrumb-item>
  </a-breadcrumb>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator';

@Component
export default class Breadcrumb extends Vue {
  get routes() {
    const matched: any = [...this.$route.matched];
    if (matched.length === 1 && matched[0].name !== 'index') {
      matched.unshift({ name: 'index', path: '/', meta: { title: 'COMMON.PAGE_TITLE.INDEX', icon: 'home' } });
    }
    return matched;
  }
}
</script>

<style lang="less">
.breadcrumb {
  cursor: auto;

  .ant-breadcrumb-link,
  .ant-breadcrumb-separator {
    animation: fade-in;
    animation-duration: 0.3s;
  }
}
</style>
