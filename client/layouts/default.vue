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
import { Component, Vue } from 'nuxt-property-decorator';
import User from '@/store/user';

@Component({
  async middleware(context: any) {
    const token: string | null = sessionStorage.getItem('IDecs_token');
    if (!token) {
      if (User.ticket) {
        const isOk: boolean = await User.validateTicket({ ticket: User.ticket });
        if (!isOk) {
          context.redirect('/login');
        }
      } else {
        context.redirect('/login');
      }
    }
  },
})
export default class DefaultLayouts extends Vue {}
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
