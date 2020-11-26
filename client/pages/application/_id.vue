<template>
  <a-spin size="large" :spinning="$fetchState.pending">
    <a-page-header :ghost="false" :title="details.name" @back="() => $router.back()">
      <a-descriptions>
        <a-descriptions-item label="应用名称">
          {{ details.name || '-' }}
        </a-descriptions-item>
        <a-descriptions-item label="应用简介">
          {{ details.description || '-' }}
        </a-descriptions-item>
        <a-descriptions-item label="创建时间">
          {{ $datetime(details.createdAt) || '-' }}
        </a-descriptions-item>
        <a-descriptions-item label="更新时间">
          {{ $datetime(details.updatedAt) || '-' }}
        </a-descriptions-item>
      </a-descriptions>

      <template v-if="details.createdById">
        <a-divider></a-divider>

        <div class="pl-20">
          <Title>创建者</Title>
          <a-descriptions>
            <a-descriptions-item label="用户名"> {{ details.createdBy.username || '-' }} </a-descriptions-item>
            <a-descriptions-item label="手机号">
              {{ details.createdBy.phone || '-' }}
            </a-descriptions-item>
            <a-descriptions-item label="邮箱"> {{ details.createdBy.email || '-' }} </a-descriptions-item>
            <a-descriptions-item label="简介">
              {{
                details.createdBy.profile && details.createdBy.profile.description
                  ? details.createdBy.profile.description
                  : '-'
              }}
            </a-descriptions-item>
          </a-descriptions>
        </div>
      </template>

      <template v-if="details.updatedById">
        <a-divider></a-divider>

        <div class="pl-20">
          <Title>修改者</Title>
          <a-descriptions>
            <a-descriptions-item label="用户名"> {{ details.updatedBy.username || '-' }} </a-descriptions-item>
            <a-descriptions-item label="手机号">
              {{ details.updatedBy.phone || '-' }}
            </a-descriptions-item>
            <a-descriptions-item label="邮箱"> {{ details.updatedBy.email || '-' }} </a-descriptions-item>
            <a-descriptions-item label="简介">
              {{
                details.updatedBy.profile && details.updatedBy.profile.description
                  ? details.updatedBy.profile.description
                  : '-'
              }}
            </a-descriptions-item>
          </a-descriptions>
        </div>
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
      this.$showErrorTip('应用信息不符合系统要求，请返回后重试');
      return;
    }
    try {
      await Application.getById(this.applicationId);
    } catch (error) {
      this.$showErrorTip('您查看的应用已经不存在了，请返回后重试');
    }
  }
}
</script>

<style lang="less">
.pl-20 {
  padding-left: 20px;
}
</style>

<router lang="yaml">
meta:
  icon: project
  title: COMMON.PAGE_TITLE.APPLICATION_DETAILS
</router>
