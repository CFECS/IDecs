<template>
  <a-dropdown :trigger="['hover']" placement="bottomRight">
    <div class="section hover">
      <a-avatar src="/avatar.jpg" small></a-avatar>
      <div class="name">
        {{ userInfo.profile.name || userInfo.phone || userInfo.email }}
      </div>
    </div>
    <a-menu slot="overlay">
      <a-menu-item key="0" @click="$navigateTo('/personal')">
        <a-icon type="user" />{{ $t('COMMON.LAYOUTS.PERSONAL') }}
      </a-menu-item>
      <a-menu-item key="1" @click="$navigateTo('https://idecs.github.io/IDecs', true)">
        <a-icon type="question-circle" />{{ $t('COMMON.LAYOUTS.CHECK_DOCUMENT') }}
      </a-menu-item>
      <a-menu-divider />
      <a-menu-item key="2" @click="lagout"> <a-icon type="poweroff" />{{ $t('COMMON.LAYOUTS.LAGOUT') }} </a-menu-item>
    </a-menu>
  </a-dropdown>
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator';
import User from '~/store/user';

@Component
export default class UserAvatar extends Vue {
  public lagout(): void {
    window.sessionStorage.removeItem('IDecs_token');
    window.location.reload();
  }

  get userInfo() {
    return User.userInfo;
  }
}
</script>

<style lang="less" scoped>
.name {
  display: inline-block;
  vertical-align: middle;
  margin-left: 6px;
  max-width: 68px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 12px;
}
</style>
