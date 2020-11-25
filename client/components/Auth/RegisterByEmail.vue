<template>
  <a-form-model ref="emailSignupForm" :model="params" :rules="rules" @submit="handleSubmit" @submit.native.prevent>
    <a-form-model-item prop="email">
      <a-input v-model.trim="params.email" :placeholder="$t('AUTH.EMAIL')" size="large">
        <a-icon slot="prefix" type="user" style="color: rgba(0, 0, 0, 0.25)"></a-icon>
      </a-input>
    </a-form-model-item>

    <a-form-model-item prop="code" class="verify-code">
      <a-input v-model.trim="params.code" :placeholder="$t('AUTH.EMAIL_CODE')" size="large">
        <a-icon slot="prefix" type="safety-certificate" style="color: rgba(0, 0, 0, 0.25)"></a-icon>
        <SendCode slot="addonAfter" method="email" :value="params.email" :type="type" :before-send="beforeSend" />
      </a-input>
    </a-form-model-item>

    <a-form-model-item prop="password">
      <a-input-password v-model="params.password" :placeholder="$t('AUTH.PASSWORD')" size="large">
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
        {{ $t('AUTH.REGISTER') }}
      </a-button>
    </a-form-model-item>
  </a-form-model>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator';
import { ReqSignupBodyDto } from '../../types/dto/user/req.signup.body.dto';
import { NotifyTypeEnum } from '../../types/enum/notify.type.enum';
import User from '~/store/user';

@Component
export default class RegisterByEmail extends Vue {
  private params: ReqSignupBodyDto = {
    email: '',
    code: '',
    password: '',
    confirmPassword: '',
    profile: {},
  };

  loading = false;

  type: NotifyTypeEnum = NotifyTypeEnum.REGISTER;

  private checkConfirmPass(_: any, value: string, callback: any): void {
    if (!value) {
      callback(new Error(this.$t('COMMON.VALIDATE.PASSWORD_CONFIRM') as string));
    } else if (value !== this.params.password) {
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
    password: [{ validator: this.$checkPassword, trigger: 'blur' }],
    confirmPassword: [{ validator: this.checkConfirmPass, trigger: 'blur' }],
  };

  beforeSend(): Promise<any> {
    return new Promise((resolve) => {
      const { validateField }: any = this.$refs.emailSignupForm;
      validateField('email', (valid: boolean) => {
        resolve(!valid);
      });
    });
  }

  handleSubmit(): void {
    const { validate }: any = this.$refs.emailSignupForm;
    validate(async (valid: boolean) => {
      if (valid) {
        this.loading = true;
        try {
          await User.signup(this.params);
          this.loading = false;
          this.$message.success(this.$t('AUTH.REGISTER_SUCCESS'));
          this.$router.push('/login');
        } catch (err) {
          this.loading = false;
        }
      }
    });
  }
}
</script>
