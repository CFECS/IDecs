<template>
  <a-dropdown :trigger="['hover']" placement="bottomRight">
    <div class="section hover">
      <a-icon type="global" />
    </div>
    <a-menu slot="overlay" selectable :selected-keys="selectedKeys" @select="onSelectChange">
      <a-menu-item key="zh-cn">
        {{ $t('COMMON.LAYOUTS.CHINESE') }}
      </a-menu-item>
      <a-menu-item key="en">
        {{ $t('COMMON.LAYOUTS.ENGLISH') }}
      </a-menu-item>
    </a-menu>
  </a-dropdown>
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator';

@Component
export default class SwitchLang extends Vue {
  get selectedKeys() {
    return [this.$i18n.locale];
  }

  public onSelectChange({ key }: any) {
    this.$i18n.setLocale(key);
  }
}
</script>
