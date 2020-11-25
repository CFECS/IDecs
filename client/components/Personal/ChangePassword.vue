<template>
  <a-form-model
    ref="changePasswordForm"
    layout="horizontal"
    hide-required-mark
    :model="params"
    :rules="rules"
    :label-col="{ span: 5 }"
    :wrapper-col="{ span: 19 }"
    @submit="handleSubmit"
    @submit.native.prevent
  >
    <a-form-model-item prop="oldPassword" :label="$t('AUTH.OLD_PASSWORD')">
      <a-input-password v-model="params.oldPassword" :placeholder="$t('AUTH.PASSWORD')" size="large">
        <a-icon slot="prefix" type="lock" style="color: rgba(0, 0, 0, 0.25)"></a-icon>
      </a-input-password>
    </a-form-model-item>

    <a-form-model-item prop="newPassword" :label="$t('AUTH.NEW_PASSWORD')">
      <a-input-password v-model="params.newPassword" :placeholder="$t('AUTH.NEW_PASSWORD')" size="large">
        <a-icon slot="prefix" type="lock" style="color: rgba(0, 0, 0, 0.25)"></a-icon>
      </a-input-password>
    </a-form-model-item>

    <a-form-model-item prop="confirmPassword" :label="$t('AUTH.PASSWORD_CONFIRM')">
      <a-input-password v-model="params.confirmPassword" :placeholder="$t('AUTH.PASSWORD_CONFIRM')" size="large">
        <a-icon slot="prefix" type="lock" style="color: rgba(0, 0, 0, 0.25)"></a-icon>
      </a-input-password>
    </a-form-model-item>

    <a-row>
      <a-col :span="5"></a-col>
      <a-col :span="19">
        <a-button type="primary" :loading="loading" html-type="submit">
          {{ $t('AUTH.CONFIRM_CHANGE') }}
        </a-button>
      </a-col>
    </a-row>
  </a-form-model>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator';
import User from '@/store/user';
import { ReqPasswordChangeBodyDto } from '../../types/dto//user/req.password.change.body.dto';

@Component
export default class ChangePassword extends Vue {
  private params: ReqPasswordChangeBodyDto = {
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  };

  loading = false;

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
    oldPassword: [{ required: true, message: this.$t('COMMON.VALIDATE.PASSWORD_REQUIRED'), trigger: 'blur' }],
    newPassword: [{ validator: this.$checkPassword, trigger: 'blur' }],
    confirmPassword: [{ validator: this.checkConfirmPass, trigger: 'blur' }],
  };

  handleSubmit(): void {
    const { validate }: any = this.$refs.changePasswordForm;
    validate(async (valid: boolean) => {
      if (valid) {
        this.loading = true;
        try {
          await User.changePassword(this.params);
          this.loading = false;
          this.$message.success(this.$t('AUTH.CHANGE_SUCCESS'));
          this.$logout();
        } catch (err) {
          this.loading = false;
        }
      }
    });
  }
}
</script>
