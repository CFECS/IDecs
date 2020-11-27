<template>
  <a-spin size="large" :spinning="$fetchState.pending">
    <a-page-header :ghost="false" :title="details.name" @back="() => $router.back()">
      <a-descriptions class="pl-20 mt-20">
        <a-descriptions-item :label="$t('APPLICATION.NAME')">
          {{ details.name || '-' }}
        </a-descriptions-item>
        <a-descriptions-item :label="$t('APPLICATION.DESCRIPTION')">
          {{ details.description || '-' }}
        </a-descriptions-item>
        <a-descriptions-item :label="$t('COMMON.LAYOUTS.CREATED_AT')">
          {{ $datetime(details.createdAt) || '-' }}
        </a-descriptions-item>
        <a-descriptions-item :label="$t('COMMON.LAYOUTS.UPDATED_AT')">
          {{ $datetime(details.updatedAt) || '-' }}
        </a-descriptions-item>
      </a-descriptions>

      <template v-if="details.createdById">
        <a-divider></a-divider>

        <a-descriptions class="pl-20" :title="$t('APPLICATION.CREATED_BY')">
          <a-descriptions-item :label="$t('USER.USERNAME')">
            {{ details.createdBy.username || '-' }}
          </a-descriptions-item>
          <a-descriptions-item :label="$t('USER.PHONE')">
            {{ details.createdBy.phone || '-' }}
          </a-descriptions-item>
          <a-descriptions-item :label="$t('USER.EMAIL')"> {{ details.createdBy.email || '-' }} </a-descriptions-item>
          <a-descriptions-item :label="$t('USER.INTRODUCTION')">
            {{
              details.createdBy.profile && details.createdBy.profile.description
                ? details.createdBy.profile.description
                : '-'
            }}
          </a-descriptions-item>
        </a-descriptions>
      </template>

      <template v-if="details.updatedById">
        <a-divider></a-divider>

        <a-descriptions class="pl-20" :title="$t('APPLICATION.UPDATED_BY')">
          <a-descriptions-item :label="$t('USER.USERNAME')">
            {{ details.updatedBy.username || '-' }}
          </a-descriptions-item>
          <a-descriptions-item :label="$t('USER.PHONE')">
            {{ details.updatedBy.phone || '-' }}
          </a-descriptions-item>
          <a-descriptions-item :label="$t('USER.EMAIL')"> {{ details.updatedBy.email || '-' }} </a-descriptions-item>
          <a-descriptions-item :label="$t('USER.INTRODUCTION')">
            {{
              details.updatedBy.profile && details.updatedBy.profile.description
                ? details.updatedBy.profile.description
                : '-'
            }}
          </a-descriptions-item>
        </a-descriptions>
      </template>
    </a-page-header>
  </a-spin>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator';
import { Route } from 'vue-router';
import Application from '@/store/application';

@Component
export default class ApplicationDetails extends Vue {
  get applicationId() {
    return this.$decode(this.$route.params.id);
  }

  get details() {
    return Application.details;
  }

  async fetch() {
    if (!this.applicationId) {
      this.$showErrorTip(this.$t('APPLICATION.INFO_ERROR'));
      return;
    }
    try {
      await Application.getById(this.applicationId);
    } catch (error) {
      this.$showErrorTip(this.$t('APPLICATION.NOT_FOUND'));
    }
  }
}
</script>

<router lang="yaml">
meta:
  icon: project
  title: COMMON.PAGE_TITLE.APPLICATION_DETAILS
</router>
