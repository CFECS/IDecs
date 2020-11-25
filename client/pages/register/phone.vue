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
})
export default class PhoneRegister extends Vue {}
</script>

<router lang="yaml">
meta:
  title: COMMON.PAGE_TITLE.PHONE_REGISTER
</router>
