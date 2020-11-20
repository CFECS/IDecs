<template>
  <div>
    <a-form-model ref="signupForm" :model="params" :rules="rules" @submit="handleSubmit" @submit.native.prevent>
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

      <a-form-model-item prop="password">
        <a-input v-model="params.password" type="password" placeholder="密码" size="large">
          <a-icon slot="prefix" type="lock" style="color: rgba(0, 0, 0, 0.25)"></a-icon>
        </a-input>
      </a-form-model-item>

      <a-form-model-item prop="confirmPassword">
        <a-input v-model="params.confirmPassword" type="password" placeholder="确认密码" size="large">
          <a-icon slot="prefix" type="lock" style="color: rgba(0, 0, 0, 0.25)"></a-icon>
        </a-input>
      </a-form-model-item>

      <a-form-model-item>
        <a-button type="primary" :loading="loading" html-type="submit" block size="large">注册</a-button>
      </a-form-model-item>
    </a-form-model>

    <div class="form-footer">
      <span>
        <span>已有账号，</span>
        <a @click="$router.back()">立即登录</a>
      </span>
      <nuxt-link to="/register/email" replace>邮箱注册</nuxt-link>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator';
import { ReqSignupBodyDto } from '../../../common/dto/user/req.signup.body.dto';
import { NotifyTypeEnum } from '../../../common/enum/notify.type.enum';

@Component
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
      callback(new Error('请再次输入密码'));
    } else if (value !== this.params.password) {
      callback(new Error('两次密码不一致'));
    } else {
      callback();
    }
  }

  rules: Record<string, any> = {
    phone: [{ validator: this.$checkPhone, trigger: 'change' }],
    code: [{ required: true, message: '请输入短信验证码', trigger: 'change' }],
    password: [{ validator: this.$checkPassword, trigger: 'change' }],
    confirmPassword: [{ validator: this.checkConfirmPass, trigger: 'change' }],
  };

  beforeSend(): Promise<any> {
    return new Promise((resolve) => {
      if (!this.params.phone) {
        const { validateField }: any = this.$refs.signupForm;
        validateField('phone');
        resolve(false);
      } else {
        resolve(true);
      }
    });
  }

  handleSubmit(): void {
    const { validate }: any = this.$refs.signupForm;
    validate(async (valid: boolean) => {
      if (valid) {
        this.loading = true;
        try {
          await this.$axios.post('/user/signup', {
            ...this.params,
            phone: this.dialCode + this.params.phone,
          });
          this.loading = false;
          this.$router.back();
        } catch (err) {
          this.loading = false;
        }
      }
    });
  }
}
</script>
