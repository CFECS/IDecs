<template>
  <a-layout-header class="navbar">
    <div class="left">
      <a-icon class="trigger" :type="collapsed ? 'menu-unfold' : 'menu-fold'" @click="trigger" />
      <Breadcrumb />
    </div>

    <div class="right">
      <UserAvatar />
      <SwitchLang />
    </div>
  </a-layout-header>
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator';
import Common from '~/store/common';

@Component
export default class Navbar extends Vue {
  get collapsed() {
    return Common.collapsed;
  }

  public trigger(): void {
    Common.triggerCollapsed(!this.collapsed);
  }
}
</script>

<style lang="less">
.navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #fff;
  padding: 0 20px 0 0;
  box-shadow: @box-shadow-base;

  .trigger {
    font-size: 18px;
    line-height: 64px;
    padding: 0 24px;
    cursor: pointer;
    transition: color 0.3s;

    &:hover {
      color: @primary-color;
    }
  }

  .section {
    display: inline-block;
    height: 64px;
    line-height: 64px;
    padding: 0 12px;
    cursor: pointer;
    transition: all 0.2s ease-in-out;

    &.hover:hover {
      background-color: #f8f8f9;
    }
  }
}
</style>
