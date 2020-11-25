<template>
  <a-form-model ref="phoneLoginForm" :model="params" :rules="rules" @submit="handleSubmit" @submit.native.prevent>
    <a-form-model-item prop="identity">
      <Phone v-model.trim="params.identity" />
    </a-form-model-item>

    <a-form-model-item prop="password">
      <a-input-password v-model="params.password" :placeholder="$t('AUTH.PASSWORD')" size="large">
        <a-icon slot="prefix" type="lock" style="color: rgba(0, 0, 0, 0.25)"></a-icon>
      </a-input-password>
    </a-form-model-item>

    <a-form-model-item>
      <a-button type="primary" :loading="loading" html-type="submit" block size="large">
        {{ $t('AUTH.LOGIN') }}
      </a-button>
    </a-form-model-item>
  </a-form-model>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator';
import { LoginTypeEnum } from '../../types/enum/login.type.enum';
import { ReqLoginBodyDto } from '../../types/dto/user/req.login.body.dto';
import User from '~/store/user';

@Component
export default class LoginByPhone extends Vue {
  private params: ReqLoginBodyDto = {
    identity: '',
    password: '',
    type: LoginTypeEnum.PASSWORD,
  };

  loading = false;

  rules: Record<string, any> = {
    identity: [{ validator: this.$checkPhone, trigger: 'blur' }],
    password: [{ required: true, message: this.$t('COMMON.VALIDATE.PASSWORD_REQUIRED'), trigger: 'blur' }],
  };

  public handleSubmit(): void {
    const loginForm: any = this.$refs.phoneLoginForm;
    loginForm.validate(async (valid: boolean) => {
      if (valid) {
        this.loading = true;
        try {
          await User.login(this.params);
          this.loading = false;
          this.$message.success('登录成功~');
          this.$router.push('/');
        } catch (err) {
          this.loading = false;
        }
      }
    });
  }
}
</script>
