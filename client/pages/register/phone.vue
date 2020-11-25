<template>
  <div>
    <RegisterByPhone />
    <div class="form-footer">
      <span>
        <span>{{ $t('AUTH.HAS_ACCOUNT') }}</span>
        <nuxt-link to="/login">{{ $t('AUTH.NOW_LOGIN') }}</nuxt-link>
      </span>
      <nuxt-link to="/register/email" replace>{{ $t('AUTH.EMAIL_REGISTER') }}</nuxt-link>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator';

@Component({
  layout: 'auth',
  head() {
    return {
      title: this.$generateTitle(this.$t('COMMON.PAGE_TITLE.PHONE_REGISTER')),
    };
  },
})
export default class PhoneRegister extends Vue {}
</script>
