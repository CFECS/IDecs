<template>
  <a-spin size="large" :spinning="$fetchState.pending">
    <a-page-header
      :ghost="false"
      :title="details.username || details.phone || details.email"
      @back="() => $router.back()"
    >
      <a-descriptions class="pl-20 mt-20">
        <a-descriptions-item :label="$t('USER.USERNAME')">
          {{ details.username || '-' }}
        </a-descriptions-item>
        <a-descriptions-item :label="$t('USER.PHONE')">
          {{ details.phone || '-' }}
        </a-descriptions-item>
        <a-descriptions-item :label="$t('USER.EMAIL')">
          {{ details.email || '-' }}
        </a-descriptions-item>
        <a-descriptions-item :label="$t('USER.INTRODUCTION')">
          {{ details.profile && details.profile.description ? details.profile.description : '-' }}
        </a-descriptions-item>
        <a-descriptions-item :label="$t('COMMON.LAYOUTS.CREATED_AT')">
          {{ $datetime(details.createdAt) || '-' }}
        </a-descriptions-item>
        <a-descriptions-item :label="$t('COMMON.LAYOUTS.UPDATED_AT')">
          {{ $datetime(details.updatedAt) || '-' }}
        </a-descriptions-item>
      </a-descriptions>
    </a-page-header>
  </a-spin>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator';
import { Route } from 'vue-router';
import User from '@/store/user';

@Component
export default class UserDetails extends Vue {
  get userId() {
    return this.$decode(this.$route.params.id);
  }

  get details() {
    return User.details;
  }

  async fetch() {
    if (!this.userId) {
      this.$showErrorTip(this.$t('USER.INFO_ERROR'));
      return;
    }
    try {
      await User.getById(this.userId);
    } catch (error) {
      this.$showErrorTip(this.$t('USER.NOT_FOUND'));
    }
  }
}
</script>

<router lang="yaml">
meta:
  icon: user
  title: COMMON.PAGE_TITLE.USER_DETAILS
</router>
