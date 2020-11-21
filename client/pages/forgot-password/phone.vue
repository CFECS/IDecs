<template>
  <div>
    <a-form-model ref="phoneForgotForm" :model="params" :rules="rules" @submit="handleSubmit" @submit.native.prevent>
      <a-form-model-item prop="phone">
        <a-input v-model="params.phone" placeholder="手机号" size="large">
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
        <a-input v-model="params.code" placeholder="短信验证码" size="large">
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

      <a-form-model-item prop="newPassword">
        <a-input v-model="params.newPassword" type="password" placeholder="新密码" size="large">
          <a-icon slot="prefix" type="lock" style="color: rgba(0, 0, 0, 0.25)"></a-icon>
        </a-input>
      </a-form-model-item>

      <a-form-model-item prop="confirmPassword">
        <a-input v-model="params.confirmPassword" type="password" placeholder="确认密码" size="large">
          <a-icon slot="prefix" type="lock" style="color: rgba(0, 0, 0, 0.25)"></a-icon>
        </a-input>
      </a-form-model-item>

      <a-form-model-item>
        <a-button type="primary" :loading="loading" html-type="submit" block size="large">确认修改</a-button>
      </a-form-model-item>
    </a-form-model>

    <div class="form-footer">
      <nuxt-link to="/login">立即登录</nuxt-link>
      <nuxt-link to="/forgot-password/email" replace>通过邮箱修改密码</nuxt-link>
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
      title: this.$generateTitle('手机号修改密码'),
    };
  },
})
export default class PhoneForgotPassword extends Vue {
  private dialCode = '+86';

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
      callback(new Error('请再次输入密码'));
    } else if (value !== this.params.newPassword) {
      callback(new Error('两次密码不一致'));
    } else {
      callback();
    }
  }

  rules: Record<string, any> = {
    phone: [{ validator: this.$checkPhone, trigger: 'blur' }],
    code: [{ required: true, message: '请输入短信验证码', trigger: 'blur' }],
    newPassword: [{ validator: this.$checkPassword, trigger: 'blur' }],
    confirmPassword: [{ validator: this.checkConfirmPass, trigger: 'blur' }],
  };

  beforeSend(): Promise<any> {
    return new Promise((resolve) => {
      if (!this.params.phone) {
        const { validateField }: any = this.$refs.phoneForgotForm;
        validateField('phone');
        resolve(false);
      } else {
        resolve(true);
      }
    });
  }

  handleSubmit(): void {
    const { validate }: any = this.$refs.phoneForgotForm;
    validate(async (valid: boolean) => {
      if (valid) {
        this.loading = true;
        try {
          await User.resetPasswordByPhone({
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
