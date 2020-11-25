<template>
  <a-row :gutter="24">
    <a-col class="tab-list" span="6">
      <a-card title="个人设置" :bordered="false">
        <a-list item-layout="horizontal">
          <a-list-item
            v-for="(item, index) in tabs"
            :key="index"
            :class="{ active: current === index }"
            @click="current = index"
          >
            <a-list-item-meta :description="item.description">
              <span slot="title">{{ item.title }}</span>
            </a-list-item-meta>
          </a-list-item>
        </a-list>
      </a-card>
    </a-col>

    <a-col span="18">
      <a-card :title="tabs[current].title" :bordered="false">
        <div class="tab-content">
          <BasicInfo v-show="current === 0" />
          <ChangePhone v-show="current === 1" />
          <ChangeEmail v-show="current === 2" />
          <ChangePassword v-show="current === 3" />
        </div>
      </a-card>
    </a-col>
  </a-row>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator';

@Component
export default class Personal extends Vue {
  get tabs(): Record<string, string>[] {
    return [
      { title: '基本信息', description: '头像、用户名、个人介绍' },
      { title: '修改手机号', description: '绑定（修改）手机号' },
      { title: '修改邮箱', description: '绑定（修改）邮箱' },
      { title: '修改密码', description: '修改个人账号密码' },
    ];
  }

  current = 0;
}
</script>

<style lang="less">
.tab-list {
  .ant-card-body {
    padding: 0 !important;
  }

  .ant-list-item {
    padding: 7px 16px;
    cursor: pointer;
    transition: background 0.3s ease-in-out;

    &.active {
      background: lighten(@primary-color, 45%);
      border-bottom-color: transparent;

      .ant-list-item-meta-title,
      .ant-list-item-meta-description {
        color: @primary-color !important;
      }
    }
  }
}

.tab-content {
  max-width: 480px;
  padding-top: 10px;
}
</style>

<router lang="yaml">
meta:
  title: COMMON.PAGE_TITLE.PERSONAL
</router>
