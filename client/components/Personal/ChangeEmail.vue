<template>
  <a-form-model
    ref="changeEmailForm"
    layout="horizontal"
    hide-required-mark
    :model="formData"
    :rules="rules"
    :label-col="{ span: 5 }"
    :wrapper-col="{ span: 19 }"
    @submit="submit"
    @submit.native.prevent
  >
    <a-form-model-item prop="email" label="邮箱">
      <a-input v-model.trim="formData.email" :placeholder="$t('AUTH.EMAIL')" size="large">
        <a-icon slot="prefix" type="user" style="color: rgba(0, 0, 0, 0.25)"></a-icon>
      </a-input>
    </a-form-model-item>

    <a-form-model-item prop="code" class="verify-code" label="邮箱验证码">
      <a-input v-model.trim="formData.code" :placeholder="$t('AUTH.EMAIL_CODE')" size="large">
        <a-icon slot="prefix" type="safety-certificate" style="color: rgba(0, 0, 0, 0.25)"></a-icon>
        <SendCode
          slot="addonAfter"
          method="email"
          :value="formData.email"
          :type="type"
          :before-send="beforeSend"
          :disabled="cacheEmail === formData.email"
        />
      </a-input>
    </a-form-model-item>
    <a-row>
      <a-col :span="5"></a-col>
      <a-col :span="19">
        <a-button type="primary" :loading="loading" :disabled="cacheEmail === formData.email" html-type="submit">
          确认修改
        </a-button>
      </a-col>
    </a-row>
  </a-form-model>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator';
import { ReqEmailOrPhoneChangeBodyDto } from '../../types/dto/user/req.email.or.phone.change.body.dto';
import { NotifyTypeEnum } from '../../types/enum/notify.type.enum';
import User from '~/store/user';

@Component
export default class ChangeEmail extends Vue {
  get userInfo() {
    return User.info;
  }

  get cacheEmail() {
    return User.info?.email || '';
  }

  formData: ReqEmailOrPhoneChangeBodyDto = {
    email: this.userInfo?.email || '',
    phone: this.userInfo?.phone,
    code: '',
  };

  loading = false;

  type: NotifyTypeEnum = NotifyTypeEnum.BINDING;

  rules: Record<string, any> = {
    email: [
      { required: true, message: this.$t('COMMON.VALIDATE.EMAIL_REQUIRED'), trigger: 'blur' },
      { type: 'email', message: this.$t('COMMON.VALIDATE.EMAIL_FORMAT') },
    ],
    code: [{ required: true, message: this.$t('COMMON.VALIDATE.EMAIL_CODE'), trigger: 'blur' }],
  };

  beforeSend(): Promise<any> {
    return new Promise((resolve) => {
      const { validateField }: any = this.$refs.changeEmailForm;
      validateField('email', (valid: boolean) => {
        resolve(!valid);
      });
    });
  }

  submit() {
    const { validate }: any = this.$refs.changeEmailForm;
    validate(async (valid: boolean) => {
      if (valid) {
        try {
          this.loading = true;
          await User.changeEmail(this.formData);
          this.loading = false;
          this.formData.code = '';
          this.$message.success('修改成功~');
        } catch (err) {
          this.loading = false;
        }
      }
    });
  }
}
</script>
