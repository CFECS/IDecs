<template>
  <a-layout class="default-layouts">
    <Sider />
    <a-layout>
      <Navbar />
      <a-layout-content>
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
  head() {
    return {
      title: this.$generateTitle(this.$t(this.$route.meta.title)),
    };
  },
})
export default class DefaultLayouts extends Vue {}
</script>

<style lang="less">
.default-layouts {
  height: 100%;

  .ant-layout {
    display: flex;
    flex-direction: column;
  }

  .ant-layout-content {
    flex: 1;
    padding: 24px 20px;
    overflow: auto;

    &::-webkit-scrollbar {
      width: 8px;
      background: #f0f2f5;
    }

    &::-webkit-scrollbar-corner,
    &::-webkit-scrollbar-track {
      background-color: #f0f2f5;
      box-shadow: inset -3px 2px 4px rgba(0, 0, 0, 0.15);
    }

    &::-webkit-scrollbar-thumb {
      background-color: @disabled-color;
    }
  }
}
</style>
