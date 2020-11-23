<template>
  <a-layout-sider v-model="collapsed" :width="240" :trigger="null" collapsible>
    <div class="logo-wrap">
      <img src="/favicon.png" alt="logo" />
      <h1 v-show="!collapsed">{{ $t('COMMON.LAYOUTS.NAME') }}</h1>
    </div>
    <a-menu theme="dark" mode="inline" :default-selected-keys="['1']">
      <a-menu-item key="2">
        <a-icon type="user" />
        <span>{{ $t('COMMON.LAYOUTS.USER_MANAGEMENT') }}</span>
      </a-menu-item>
      <a-sub-menu key="sub1">
        <span slot="title"
          ><a-icon type="appstore" /><span>{{ $t('COMMON.LAYOUTS.APPLICATION_MANAGEMENT') }}</span></span
        >
        <a-menu-item key="3"> {{ $t('COMMON.LAYOUTS.APPLICATION_LIST') }} </a-menu-item>
        <a-menu-item key="4"> {{ $t('COMMON.LAYOUTS.APPLICATION_MONITOR') }} </a-menu-item>
      </a-sub-menu>
      <a-sub-menu key="sub2">
        <span slot="title"
          ><a-icon type="appstore" /><span>{{ $t('COMMON.LAYOUTS.DEVELOP_MANAGEMENT') }}</span></span
        >
        <a-menu-item key="3"> {{ $t('COMMON.LAYOUTS.SMS_MANAGEMENT') }} </a-menu-item>
        <a-menu-item key="4"> {{ $t('COMMON.LAYOUTS.EMAIL_MANAGEMENT') }} </a-menu-item>
      </a-sub-menu>
      <a-sub-menu key="sub3">
        <span slot="title"
          ><a-icon type="appstore" /><span>{{ $t('COMMON.LAYOUTS.LOG_MANAGEMENT') }}</span></span
        >
        <a-menu-item key="3"> {{ $t('COMMON.LAYOUTS.VERIFY_CODE') }} </a-menu-item>
        <a-menu-item key="4"> {{ $t('COMMON.LAYOUTS.OPERATION_RECORD') }} </a-menu-item>
      </a-sub-menu>
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
    opacity: 0.95;
    font-size: 18px;
    vertical-align: middle;
    animation: fade-in;
    animation-duration: 0.3s;
  }
}
</style>
