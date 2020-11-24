<template>
  <a-input v-model="phone" :placeholder="$t('AUTH.PHONE')" size="large" @change="inputChange" @blur="$emit('blur')">
    <a-select
      slot="addonBefore"
      v-model="dialCode"
      :style="{ width: '70px' }"
      :dropdown-match-select-width="false"
      option-label-prop="value"
      @change="selectChange"
    >
      <a-select-option v-for="code in $countryDialCodes()" :key="code.value" :value="code.value">
        {{ code.label }}
      </a-select-option>
    </a-select>
  </a-input>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator';

@Component
export default class Phone extends Vue {
  @Prop({ required: true, type: String, default: '' })
  value!: string;

  get dialCodeAndPhone() {
    return this.$getPhoneNumber(this.value);
  }

  dialCode = this.dialCodeAndPhone.dialCode;

  phone = this.dialCodeAndPhone.phone;

  inputChange(e: any) {
    if (!e.target.value) {
      this.$emit('input', '');
    } else {
      this.$emit('input', this.dialCode + e.target.value);
    }
  }

  selectChange(value: string) {
    this.$emit('input', value + this.phone);
  }
}
</script>
