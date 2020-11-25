<template>
  <div class="error-page">
    <a-result
      :status="String(error.statusCode)"
      :title="String(error.statusCode)"
      :sub-title="$t(`COMMON.ERROR_PAGE.${error.statusCode || 500}`)"
    >
      <template #extra>
        {{ error }}
        <a-button type="primary" @click="$router.back()"> {{ $t('COMMON.LAYOUTS.RETURN_BACK') }} </a-button>
        <a-button @click="$router.push('/')"> {{ $t('COMMON.LAYOUTS.RETURN_HOME') }} </a-button>
      </template>
    </a-result>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator';
import { NuxtError } from '../types/dto/common';

@Component({
  layout: 'empty',
  head() {
    return {
      title: this.$generateTitle(this.$t('COMMON.PAGE_TITLE.ERROR')),
    };
  },
})
export default class ErrorLayouts extends Vue {
  @Prop({ type: Object })
  error!: NuxtError;
}
</script>

<style lang="less">
.error-page {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background-color: #fff;
}
</style>
