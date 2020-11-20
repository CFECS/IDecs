<template>
  <div class="error-page">
    <a-result :status="ErrorDto.status" :title="ErrorDto.title" :sub-title="ErrorDto.description">
      <template #extra>
        <a-button type="primary" @click="$router.back()"> 返回上一页 </a-button>
        <a-button @click="$router.push('/')"> 回到首页 </a-button>
      </template>
    </a-result>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator';
import { PAGE_ERROR } from '../types/constants';
import { NuxtError } from '../types/dto';

@Component
export default class ErrorLayouts extends Vue {
  @Prop({ type: Object })
  error!: NuxtError;

  layout() {
    return 'empty';
  }

  get ErrorDto(): Record<string, string | number> {
    console.log(this.error);
    return PAGE_ERROR[this.error.statusCode || 500];
  }
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
