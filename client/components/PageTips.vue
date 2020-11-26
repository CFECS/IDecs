<template>
  <div class="page-tips">
    <a-icon type="info-circle" />
    <div class="intro">
      <h3>{{ title }}</h3>
      <p v-if="description">{{ description }}</p>
    </div>
    <slot></slot>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator';

@Component
export default class PageTips extends Vue {
  @Prop({ type: String, required: true })
  title!: string;

  @Prop({ type: String, default: '' })
  description!: string;
}
</script>

<style lang="less">
.page-tips {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  position: relative;
  padding: 15px 15px 15px 64px;
  color: rgba(0, 0, 0, 0.65);
  line-height: 1.5;
  border-radius: 4px;
  margin-bottom: 20px;
  background-color: lighten(@primary-color, 48%);
  border: 1px solid lighten(@primary-color, 40%);

  i {
    position: absolute;
    top: 16px;
    left: 24px;
    color: @primary-color;
    font-size: 24px;
  }

  .intro {
    flex: 1;
    margin-right: 20px;
    min-width: 260px;

    h3 {
      color: rgba(0, 0, 0, 0.85);
      font-size: 16px;
      white-space: nowrap;
    }

    p {
      color: rgba(0, 0, 0, 0.65);
      font-size: 14px;
    }
  }
}
</style>
