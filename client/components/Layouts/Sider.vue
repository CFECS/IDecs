<template>
  <a-layout-sider v-model="collapsed" class="sider" :width="256" :trigger="null" collapsible>
    <div class="logo-wrap" @click="$navigateTo('/')">
      <img src="/favicon.png" alt="logo" />
      <h1 v-show="!collapsed">{{ $t('COMMON.LAYOUTS.NAME') }}</h1>
    </div>

    <a-menu theme="dark" mode="inline" :selected-keys="selectedKeys" @click="handleClick">
      <a-menu-item key="/application">
        <a-icon type="project" />
        <span>{{ $t('COMMON.PAGE_TITLE.APPLICATION_MANAGEMENT') }}</span>
      </a-menu-item>
    </a-menu>
  </a-layout-sider>
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator';
import Common from '~/store/common';

@Component
export default class Navbar extends Vue {
  get collapsed() {
    return Common.collapsed;
  }

  get selectedKeys() {
    return [this.$route.path];
  }

  handleClick({ key }: any) {
    this.$router.push(key);
  }
}
</script>

<style lang="less">
.sider {
  box-shadow: 2px 0 6px rgba(0, 21, 41, 0.35);
  background-color: #191a23;

  .logo-wrap {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 64px;
    padding: 0 20px;
    overflow: hidden;
    border-bottom: 1px solid #101117;
    cursor: pointer;
    transition: all 0.3s;

    img {
      display: inline-block;
      height: 40px;
      vertical-align: middle;
    }

    h1 {
      display: inline-block;
      margin-left: 12px;
      margin-bottom: 0;
      color: #ffffff;
      opacity: 0.95;
      font-size: 18px;
      vertical-align: middle;
      animation: fade-in;
      animation-duration: 0.3s;
    }
  }

  .ant-menu-dark {
    padding-top: 10px;
  }

  .ant-menu-dark,
  .ant-menu-dark .ant-menu-sub {
    background-color: #191a23;
  }
  .ant-menu-dark .ant-menu-inline.ant-menu-sub {
    background-color: #101117;
  }
}
</style>
