<template>
  <a-form-model ref="phoneForgotForm" :model="params" :rules="rules" @submit="handleSubmit" @submit.native.prevent>
    <a-form-model-item prop="phone">
      <Phone v-model.trim="params.phone" />
    </a-form-model-item>

    <a-form-model-item prop="code" class="verify-code">
      <a-input v-model.trim="params.code" :placeholder="$t('AUTH.PHONE_CODE')" size="large">
        <a-icon slot="prefix" type="safety-certificate" style="color: rgba(0, 0, 0, 0.25)"></a-icon>
        <SendCode slot="addonAfter" method="sms" :value="params.phone" :type="type" :before-send="beforeSend" />
      </a-input>
    </a-form-model-item>

    <a-form-model-item prop="newPassword">
      <a-input-password v-model="params.newPassword" :placeholder="$t('AUTH.NEW_PASSWORD')" size="large">
        <a-icon slot="prefix" type="lock" style="color: rgba(0, 0, 0, 0.25)"></a-icon>
      </a-input-password>
    </a-form-model-item>

    <a-form-model-item prop="confirmPassword">
      <a-input-password v-model="params.confirmPassword" :placeholder="$t('AUTH.PASSWORD_CONFIRM')" size="large">
        <a-icon slot="prefix" type="lock" style="color: rgba(0, 0, 0, 0.25)"></a-icon>
      </a-input-password>
    </a-form-model-item>

    <a-form-model-item>
      <a-button type="primary" :loading="loading" html-type="submit" block size="large">
        {{ $t('AUTH.CONFIRM_CHANGE') }}
      </a-button>
    </a-form-model-item>
  </a-form-model>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator';
import { ReqPasswordResetBodyDto } from '../../types/dto//user/req.password.reset.body.dto';
import { NotifyTypeEnum } from '../../types/enum/notify.type.enum';
import User from '~/store/user';

@Component
export default class ForgotPasswordByPhone extends Vue {
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
    phone: [{ validator: this.$checkPhone, trigger: 'blur' }],
    code: [{ required: true, message: this.$t('COMMON.VALIDATE.PHONE_CODE'), trigger: 'blur' }],
    newPassword: [{ validator: this.$checkPassword, trigger: 'blur' }],
    confirmPassword: [{ validator: this.checkConfirmPass, trigger: 'blur' }],
  };

  beforeSend(): Promise<any> {
    return new Promise((resolve) => {
      const { validateField }: any = this.$refs.phoneForgotForm;
      validateField('phone', (valid: boolean) => {
        resolve(!valid);
      });
    });
  }

  handleSubmit(): void {
    const { validate }: any = this.$refs.phoneForgotForm;
    validate(async (valid: boolean) => {
      if (valid) {
        this.loading = true;
        try {
          await User.resetPasswordByPhone(this.params);
          this.loading = false;
          this.$message.success('修改成功~');
          this.$router.push('/login');
        } catch (err) {
          this.loading = false;
        }
      }
    });
  }
}
</script>
