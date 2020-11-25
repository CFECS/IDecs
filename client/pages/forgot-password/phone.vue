<template>
  <div>
    <ForgotPasswordByPhone />
    <div class="form-footer">
      <nuxt-link to="/login">{{ $t('AUTH.NOW_LOGIN') }}</nuxt-link>
      <nuxt-link to="/forgot-password/email" replace>{{ $t('AUTH.CHANGE_BY_EMAIL') }}</nuxt-link>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator';

@Component({
  layout: 'auth',
  head() {
    return {
      title: this.$generateTitle(this.$t('COMMON.PAGE_TITLE.PHONE_FORGOT_PASSWORD')),
    };
  },
})
export default class PhoneForgotPassword extends Vue {}
</script>
