<template>
  <a-layout-header class="navbar">
    <a-icon class="trigger" :type="collapsed ? 'menu-unfold' : 'menu-fold'" @click="trigger" />

    <div class="right">
      <div class="section">
        <a-dropdown :trigger="['click']" placement="bottomRight">
          <a-avatar icon="user" />
          <a-menu slot="overlay">
            <a-menu-item key="0">
              <nuxt-link to="/personal">个人信息</nuxt-link>
            </a-menu-item>
            <a-menu-divider />
            <a-menu-item key="2">
              <nuxt-link to="/login">退出登录</nuxt-link>
            </a-menu-item>
          </a-menu>
        </a-dropdown>
      </div>
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
    padding: 0 12px;
    cursor: pointer;
  }
}
</style>
