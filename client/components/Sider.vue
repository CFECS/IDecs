<template>
  <a-layout-sider v-model="collapsed" :width="240" :trigger="null" collapsible>
    <div class="logo-wrap">
      <img src="/favicon.png" alt="logo" />
      <h1 v-show="!collapsed">IDecs 身份管理</h1>
    </div>
    <a-menu theme="dark" mode="inline" :default-selected-keys="['1']">
      <a-menu-item key="1">
        <a-icon type="user" />
        <span>nav 1</span>
      </a-menu-item>
      <a-menu-item key="2">
        <a-icon type="video-camera" />
        <span>nav 2</span>
      </a-menu-item>
      <a-menu-item key="3">
        <a-icon type="upload" />
        <span>nav 3</span>
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
}
</script>

<style lang="less">
.logo-wrap {
  position: relative;
  display: flex;
  align-items: center;
  height: 64px;
  padding: 0 20px;
  overflow: hidden;
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
    opacity: 0.9;
    font-size: 20px;
    vertical-align: middle;
    animation: fade-in;
    animation-duration: 0.3s;
  }
}
</style>
