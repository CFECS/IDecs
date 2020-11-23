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
import { Component, Watch, Vue } from 'nuxt-property-decorator';
import User from '@/store/user';

@Component({
  async middleware(context: any) {
    const token: string | null = sessionStorage.getItem('IDecs_token');
    if (!token) {
      if (User.ticket) {
        const isOk: boolean = await User.validateTicket({ ticket: User.ticket });
        if (!isOk) {
          context.redirect('/login');
        } else {
          await User.getUserInfo();
        }
      } else {
        context.redirect('/login');
      }
    } else if (!User.userInfo) {
      await User.getUserInfo();
    }
  },
})
export default class DefaultLayouts extends Vue {
  @Watch('$route')
  change() {
    if (this.$nuxt.isOffline) {
      const isprompted: string | null = window.sessionStorage.getItem('IDecs_offline_tips');
      if (isprompted) return;
      this.$warning({
        title: this.$t('COMMON.LAYOUTS.TIPS'),
        content: this.$t('COMMON.LAYOUTS.OFFLINE'),
        okText: this.$t('COMMON.LAYOUTS.GOT_IT'),
        onOk: () => {
          window.sessionStorage.setItem('IDecs_offline_tips', '1');
        },
      });
    }
  }
}
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
