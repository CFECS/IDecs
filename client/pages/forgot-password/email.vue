<template>
  <div>
    <a-form-model ref="emailForgotForm" :model="params" :rules="rules" @submit="handleSubmit" @submit.native.prevent>
      <a-form-model-item prop="email">
        <a-input v-model="params.email" :placeholder="$t('AUTH.EMAIL')" size="large">
          <a-icon slot="prefix" type="user" style="color: rgba(0, 0, 0, 0.25)"></a-icon>
        </a-input>
      </a-form-model-item>

      <a-form-model-item prop="code" class="verify-code">
        <a-input v-model="params.code" :placeholder="$t('AUTH.EMAIL_CODE')" size="large">
          <a-icon slot="prefix" type="safety-certificate" style="color: rgba(0, 0, 0, 0.25)"></a-icon>
          <SendCode slot="addonAfter" method="email" :value="params.email" :type="type" :before-send="beforeSend" />
        </a-input>
      </a-form-model-item>

      <a-form-model-item prop="newPassword">
        <a-input v-model="params.newPassword" type="password" :placeholder="$t('AUTH.NEW_PASSWORD')" size="large">
          <a-icon slot="prefix" type="lock" style="color: rgba(0, 0, 0, 0.25)"></a-icon>
        </a-input>
      </a-form-model-item>

      <a-form-model-item prop="confirmPassword">
        <a-input
          v-model="params.confirmPassword"
          type="password"
          :placeholder="$t('AUTH.PASSWORD_CONFIRM')"
          size="large"
        >
          <a-icon slot="prefix" type="lock" style="color: rgba(0, 0, 0, 0.25)"></a-icon>
        </a-input>
      </a-form-model-item>

      <a-form-model-item>
        <a-button type="primary" :loading="loading" html-type="submit" block size="large">
          {{ $t('AUTH.CONFIRM_CHANGE') }}
        </a-button>
      </a-form-model-item>
    </a-form-model>

    <div class="form-footer">
      <nuxt-link to="/login">{{ $t('AUTH.NOW_LOGIN') }}</nuxt-link>
      <nuxt-link to="/forgot-password/phone" replace>{{ $t('AUTH.CHANGE_BY_PHONE') }}</nuxt-link>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator';
import User from '@/store/user';
import { ReqPasswordResetBodyDto } from '../../types/dto//user/req.password.reset.body.dto';
import { NotifyTypeEnum } from '../../types/enum/notify.type.enum';

@Component({
  layout: 'auth',
  head() {
    return {
      title: this.$generateTitle(this.$t('COMMON.PAGE_TITLE.EMAIL_FORGOT_PASSWORD')),
    };
  },
})
export default class EmailForgotPassword extends Vue {
  private params: ReqPasswordResetBodyDto = {
    phone: '',
    email: '',
    code: '',
    newPassword: '',
    confirmPassword: '',
  };

  loading = false;

  type: NotifyTypeEnum = NotifyTypeEnum.RESET_PASSWORD;

  private checkConfirmPass(_: any, value: string, callback: any): void {
    if (!value) {
      callback(new Error(this.$t('COMMON.VALIDATE.PASSWORD_CONFIRM') as string));
    } else if (value !== this.params.newPassword) {
      callback(new Error(this.$t('COMMON.VALIDATE.PASSWORD_NOT_SAME') as string));
    } else {
      callback();
    }
  }

  rules: Record<string, any> = {
    email: [
      { required: true, message: this.$t('COMMON.VALIDATE.EMAIL_REQUIRED'), trigger: 'blur' },
      { type: 'email', message: this.$t('COMMON.VALIDATE.EMAIL_FORMAT') },
    ],
    code: [{ required: true, message: this.$t('COMMON.VALIDATE.EMAIL_CODE'), trigger: 'blur' }],
    newPassword: [{ validator: this.$checkPassword, trigger: 'blur' }],
    confirmPassword: [{ validator: this.checkConfirmPass, trigger: 'blur' }],
  };

  beforeSend(): Promise<any> {
    return new Promise((resolve) => {
      if (!this.params.email) {
        const { validateField }: any = this.$refs.emailForgotForm;
        validateField('email');
        resolve(false);
      } else {
        resolve(true);
      }
    });
  }

  handleSubmit(): void {
    const { validate }: any = this.$refs.emailForgotForm;
    validate(async (valid: boolean) => {
      if (valid) {
        this.loading = true;
        try {
          await User.resetPasswordByEmail(this.params);
          this.loading = false;
          this.$router.push('/login');
        } catch (err) {
          this.loading = false;
        }
      }
    });
  }
}
</script>
