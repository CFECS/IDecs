<template>
  <div>
    <a-form-model ref="emailForgotForm" :model="params" :rules="rules" @submit="handleSubmit" @submit.native.prevent>
      <a-form-model-item prop="email">
        <a-input v-model="params.email" placeholder="邮箱" size="large">
          <a-icon slot="prefix" type="user" style="color: rgba(0, 0, 0, 0.25)"></a-icon>
        </a-input>
      </a-form-model-item>

      <a-form-model-item prop="code" class="verify-code">
        <a-input v-model="params.code" placeholder="邮箱验证码" size="large">
          <a-icon slot="prefix" type="safety-certificate" style="color: rgba(0, 0, 0, 0.25)"></a-icon>
          <SendCode slot="addonAfter" method="email" :value="params.email" :type="type" :before-send="beforeSend" />
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
      <nuxt-link to="/forgot-password/phone" replace>通过手机号修改密码</nuxt-link>
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
      title: this.$generateTitle('邮箱修改密码'),
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
      callback(new Error('请再次输入密码'));
    } else if (value !== this.params.newPassword) {
      callback(new Error('两次密码不一致'));
    } else {
      callback();
    }
  }

  rules: Record<string, any> = {
    email: [
      { required: true, message: '请输入邮箱', trigger: 'blur' },
      { type: 'email', message: '请输入正确的邮箱' },
    ],
    code: [{ required: true, message: '请输入邮箱验证码', trigger: 'blur' }],
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
