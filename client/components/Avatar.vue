<template>
  <a-avatar v-bind="$attrs" :src="src || '/avatar.jpg'"></a-avatar>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator';

@Component
export default class Avatar extends Vue {
  @Prop({ type: String })
  src!: string;
}
</script>
