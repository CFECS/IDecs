<template>
  <a-layout-header class="navbar">
    <a-icon class="trigger" :type="collapsed ? 'menu-unfold' : 'menu-fold'" @click="trigger" />

    <div class="right">
      <a-dropdown :trigger="['click']" placement="bottomRight">
        <div class="section">
          <Avatar username="Li Ziping" :size="40" />
        </div>
        <a-menu slot="overlay">
          <a-menu-item key="0">
            <nuxt-link to="/personal"> <a-icon type="user" /> {{ $t('COMMON.LAYOUTS.PERSONAL') }} </nuxt-link>
          </a-menu-item>
          <a-menu-item key="1">
            <nuxt-link to="/personal"> <a-icon type="setting" /> {{ $t('COMMON.LAYOUTS.CHANGE_PASSWORD') }} </nuxt-link>
          </a-menu-item>
          <a-menu-divider />
          <a-menu-item key="2">
            <nuxt-link to="/login"> <a-icon type="poweroff" /> {{ $t('COMMON.LAYOUTS.LAGOUT') }} </nuxt-link>
          </a-menu-item>
        </a-menu>
      </a-dropdown>
    </div>
  </a-layout-header>
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator';
import Avatar from 'vue-avatar';
import Common from '~/store/common';

@Component({
  components: { Avatar },
})
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
