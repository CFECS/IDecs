<template>
  <div>
    <a-form-model ref="forgotForm" :model="params" :rules="rules" @submit="handleSubmit" @submit.native.prevent>
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
      <a @click="$router.back()">返回登录</a>
      <nuxt-link to="/forgot-password/phone" replace>通过手机号修改密码</nuxt-link>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator';
import { ReqPasswordResetBodyDto } from '../../../../common/dto//user/req.password.reset.body.dto';
import { NotifyTypeEnum } from '../../../../common/enum/notify.type.enum';

@Component
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

  rules: any = {
    email: [
      { required: true, message: '请输入邮箱', trigger: 'change' },
      { type: 'email', message: '请输入正确的邮箱' },
    ],
    code: [{ required: true, message: '请输入邮箱验证码', trigger: 'change' }],
    newPassword: [{ validator: this.$checkPassword, trigger: 'change' }],
    confirmPassword: [{ validator: this.checkConfirmPass, trigger: 'change' }],
  };

  beforeSend(): Promise<any> {
    return new Promise((resolve) => {
      if (!this.params.email) {
        const { validateField }: any = this.$refs.forgotForm;
        validateField('email');
        resolve(false);
      } else {
        resolve(true);
      }
    });
  }

  handleSubmit(): void {
    const { validate }: any = this.$refs.forgotForm;
    validate(async (valid: boolean) => {
      if (valid) {
        this.loading = true;
        try {
          await this.$axios.put('/user/password/reset/email', this.params);
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
