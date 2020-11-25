<template>
  <a-row :gutter="24">
    <a-col class="tab-list" span="6">
      <a-card :title="$t('PERSONAL.TITLE')" :bordered="false">
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
      { title: this.$t('PERSONAL.PART_TITLE_1'), description: this.$t('PERSONAL.PART_DESCRIPTION_1') },
      { title: this.$t('PERSONAL.PART_TITLE_2'), description: this.$t('PERSONAL.PART_DESCRIPTION_2') },
      { title: this.$t('PERSONAL.PART_TITLE_3'), description: this.$t('PERSONAL.PART_DESCRIPTION_3') },
      { title: this.$t('PERSONAL.PART_TITLE_4'), description: this.$t('PERSONAL.PART_DESCRIPTION_4') },
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
