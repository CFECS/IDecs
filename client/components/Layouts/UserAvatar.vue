<template>
  <a-dropdown :trigger="['hover']" placement="bottomRight">
    <div class="section hover">
      <Avatar :src="userInfo.avatar" small />
      <div class="name">
        {{ userInfo.username || userInfo.phone || userInfo.email }}
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
      <a-menu-item key="2" @click="$logout"> <a-icon type="poweroff" />{{ $t('COMMON.LAYOUTS.LAGOUT') }} </a-menu-item>
    </a-menu>
  </a-dropdown>
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator';
import User from '~/store/user';

@Component
export default class UserAvatar extends Vue {
  get userInfo() {
    return User.info;
  }
}
</script>

<style lang="less" scoped>
.name {
  display: inline-block;
  vertical-align: middle;
  max-width: 60px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 12px;
}
</style>
