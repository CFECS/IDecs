<template>
  <a-layout class="default-layouts">
    <Sider />
    <a-layout>
      <Navbar />
      <a-layout-content class="content">
        <Nuxt />
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator';

@Component
export default class DefaultLayouts extends Vue {}
</script>

<style lang="less">
.default-layouts {
  height: 100%;

  .content {
    margin: 24px 20px;
    padding: 0 24px;
    min-height: 280px;
  }
}
</style>
