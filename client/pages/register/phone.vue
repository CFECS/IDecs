<template>
  <div>
    <a-form-model ref="phoneSignupForm" :model="params" :rules="rules" @submit="handleSubmit" @submit.native.prevent>
      <a-form-model-item prop="phone">
        <a-input v-model="params.phone" :placeholder="$t('AUTH.PHONE')" size="large">
          <a-select
            slot="addonBefore"
            v-model="dialCode"
            :style="{ width: '70px' }"
            :dropdown-match-select-width="false"
            option-label-prop="value"
          >
            <a-select-option v-for="code in $countryDialCodes()" :key="code.value" :value="code.value">
              {{ code.label }}
            </a-select-option>
          </a-select>
        </a-input>
      </a-form-model-item>

      <a-form-model-item prop="code" class="verify-code">
        <a-input v-model="params.code" :placeholder="$t('AUTH.PHONE_CODE')" size="large">
          <a-icon slot="prefix" type="safety-certificate" style="color: rgba(0, 0, 0, 0.25)"></a-icon>
          <SendCode
            slot="addonAfter"
            method="sms"
            :value="dialCode + params.phone"
            :type="type"
            :before-send="beforeSend"
          />
        </a-input>
      </a-form-model-item>

      <a-form-model-item prop="password">
        <a-input v-model="params.password" type="password" :placeholder="$t('AUTH.PASSWORD')" size="large">
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
          {{ $t('AUTH.REGISTER') }}
        </a-button>
      </a-form-model-item>
    </a-form-model>

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
import User from '@/store/user';
import { ReqSignupBodyDto } from '../../types/dto/user/req.signup.body.dto';
import { NotifyTypeEnum } from '../../types/enum/notify.type.enum';

@Component({
  layout: 'auth',
  head() {
    return {
      title: this.$generateTitle(this.$t('COMMON.PAGE_TITLE.PHONE_REGISTER')),
    };
  },
})
export default class PhoneRegister extends Vue {
  private dialCode = '+86';

  private params: ReqSignupBodyDto = {
    phone: '',
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
    phone: [{ validator: this.$checkPhone, trigger: 'blur' }],
    code: [{ required: true, message: this.$t('COMMON.VALIDATE.PHONE_CODE'), trigger: 'blur' }],
    password: [{ validator: this.$checkPassword, trigger: 'blur' }],
    confirmPassword: [{ validator: this.checkConfirmPass, trigger: 'blur' }],
  };

  beforeSend(): Promise<any> {
    return new Promise((resolve) => {
      if (!this.params.phone) {
        const { validateField }: any = this.$refs.phoneSignupForm;
        validateField('phone');
        resolve(false);
      } else {
        resolve(true);
      }
    });
  }

  handleSubmit(): void {
    const { validate }: any = this.$refs.phoneSignupForm;
    validate(async (valid: boolean) => {
      if (valid) {
        this.loading = true;
        try {
          await User.signup({
            ...this.params,
            phone: this.dialCode + this.params.phone,
          });
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
