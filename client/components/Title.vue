<template>
  <div class="id-title">
    <span>
      <slot></slot>
    </span>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator';

@Component
export default class Title extends Vue {}
</script>

<style lang="less">
.id-title {
  position: relative;
  display: flex;
  align-items: center;
  height: 36px;
  font-size: 18px;
  font-weight: 500;
  margin-bottom: 10px;
  padding-left: 20px;

  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 0;
    transform: translateY(-50%);
    width: 3px;
    height: 18px;
    background-color: @primary-color;
    border-radius: 3px;
  }
}
</style>
