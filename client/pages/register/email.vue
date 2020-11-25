<template>
  <div>
    <RegisterByEmail />
    <div class="form-footer">
      <span>
        <span>{{ $t('AUTH.HAS_ACCOUNT') }}</span>
        <nuxt-link to="/login">{{ $t('AUTH.NOW_LOGIN') }}</nuxt-link>
      </span>
      <nuxt-link to="/register/phone" replace>{{ $t('AUTH.PHONE_REGISTER') }}</nuxt-link>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator';
import User from '@/store/user';
import { ReqSignupBodyDto } from '../../types/dto/user/req.signup.body.dto';
import { NotifyTypeEnum } from '../../types/enum/notify.type.enum';

@Component({
  layout: 'auth',
  head() {
    return {
      title: this.$generateTitle(this.$t('COMMON.PAGE_TITLE.EMAIL_REGISTER')),
    };
  },
})
export default class EmailRegister extends Vue {}
</script>
