<template>
  <div>
    <ForgotPasswordByEmail />
    <div class="form-footer">
      <nuxt-link to="/login">{{ $t('AUTH.NOW_LOGIN') }}</nuxt-link>
      <nuxt-link to="/forgot-password/phone" replace>{{ $t('AUTH.CHANGE_BY_PHONE') }}</nuxt-link>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator';

@Component({
  layout: 'auth',
})
export default class EmailForgotPassword extends Vue {}
</script>

<router lang="yaml">
meta:
  title: COMMON.PAGE_TITLE.EMAIL_FORGOT_PASSWORD
</router>
