<template>
  <a-form-model
    ref="changePhoneForm"
    layout="horizontal"
    hide-required-mark
    :model="formData"
    :rules="rules"
    :label-col="{ span: 5 }"
    :wrapper-col="{ span: 19 }"
    @submit="submit"
    @submit.native.prevent
  >
    <a-form-model-item prop="phone" :label="$t('AUTH.PHONE')">
      <Phone v-model.trim="formData.phone" />
    </a-form-model-item>

    <a-form-model-item prop="code" class="verify-code" :label="$t('AUTH.PHONE_CODE')">
      <a-input v-model.trim="formData.code" :placeholder="$t('AUTH.PHONE_CODE')" size="large">
        <a-icon slot="prefix" type="safety-certificate" style="color: rgba(0, 0, 0, 0.25)"></a-icon>
        <SendCode
          slot="addonAfter"
          method="sms"
          :value="formData.phone"
          :type="type"
          :before-send="beforeSend"
          :disabled="cachePhone === formData.phone"
        />
      </a-input>
    </a-form-model-item>
    <a-row>
      <a-col :span="5"></a-col>
      <a-col :span="19">
        <a-button type="primary" :loading="loading" :disabled="cachePhone === formData.phone" html-type="submit">
          {{ $t('AUTH.CONFIRM_CHANGE') }}
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
export default class ChangePhone extends Vue {
  get userInfo() {
    return User.info;
  }

  get cachePhone() {
    return User.info?.phone || '';
  }

  formData: ReqEmailOrPhoneChangeBodyDto = {
    email: this.userInfo?.email,
    phone: this.cachePhone,
    code: '',
  };

  loading = false;

  type: NotifyTypeEnum = NotifyTypeEnum.BINDING;

  rules: Record<string, any> = {
    phone: [{ validator: this.$checkPhone, trigger: 'blur' }],
    code: [{ required: true, message: this.$t('COMMON.VALIDATE.PHONE_CODE'), trigger: 'blur' }],
  };

  beforeSend(): Promise<any> {
    return new Promise((resolve) => {
      const { validateField }: any = this.$refs.changePhoneForm;
      validateField('phone', (valid: boolean) => {
        resolve(!valid);
      });
    });
  }

  submit() {
    const { validate }: any = this.$refs.changePhoneForm;
    validate(async (valid: boolean) => {
      if (valid) {
        try {
          this.loading = true;
          await User.changePhone(this.formData);
          this.loading = false;
          this.formData.code = '';
          this.$message.success(this.$t('AUTH.CHANGE_SUCCESS'));
        } catch (err) {
          this.loading = false;
        }
      }
    });
  }
}
</script>
