<template lang="pug">
  div
    a-form-model(
      ref="signupForm"
      :model="params"
      :rules="rules"
      @submit="handleSubmit"
      @submit.native.prevent
    )
      a-form-model-item(prop="phone")
        a-input(v-model="params.phone" placeholder="手机号" size="large")
          a-select(
            slot="addonBefore"
            v-model="params.dialCode"
            :style="{ width: '70px' }"
            :dropdown-match-select-width="false"
            option-label-prop="value"
          )
            a-select-option(v-for="code in $countryDialCodes()" :key="code.value" :value="code.value") {{ code.label }}

      a-form-model-item(prop="code" class="verify-code")
        a-input(v-model="params.code" placeholder="短信验证码" size="large")
          a-icon(slot="prefix" type="safety-certificate" style="color: rgba(0, 0, 0, 0.25)")
          send-code(
            slot="addonAfter"
            method="sms"
            :value="params.dialCode + params.phone"
            :type="1"
            :before-send="beforeSend"
          )

      a-form-model-item(prop="newPassword")
        a-input(v-model="params.newPassword" type="password" placeholder="新密码" size="large")
          a-icon(slot="prefix" type="lock" style="color: rgba(0, 0, 0, 0.25)")

      a-form-model-item(prop="confirmPassword")
        a-input(v-model="params.confirmPassword" type="password" placeholder="确认密码" size="large")
          a-icon(slot="prefix" type="lock" style="color: rgba(0, 0, 0, 0.25)")

      a-form-model-item
        a-button(type="primary" :loading="loading" html-type="submit" block size="large") 确认修改

    .form-footer
      a(@click="$router.back()") 返回登录
      nuxt-link(to="/forgot-password/email" replace) 通过邮箱修改密码
</template>

<script lang="ts">
import { defineComponent, useContext, reactive, ref } from '@nuxtjs/composition-api';

export default defineComponent({
  name: 'PhoneRegister',

  setup(props, { root }) {
    const { $axios, $checkPhone, $checkPassword }: any = useContext();

    const signupForm: any = ref(null);
    const loading = ref(false);

    const state = reactive({
      params: {
        dialCode: '+86',
        phone: '',
        code: '',
        newPassword: '',
        confirmPassword: '',
      },
    });

    const checkConfirmPass = (rule: any, value: string, callback: any) => {
      if (!value) {
        callback(new Error('请再次输入密码'));
      } else if (value !== state.params.newPassword) {
        callback(new Error('两次密码不一致'));
      } else {
        callback();
      }
    };

    const rules: any = {
      phone: [{ validator: $checkPhone, trigger: 'change' }],
      code: [{ required: true, message: '请输入短信验证码', trigger: 'change' }],
      newPassword: [{ validator: $checkPassword, trigger: 'change' }],
      confirmPassword: [{ validator: checkConfirmPass, trigger: 'change' }],
    };

    const beforeSend = () => {
      return new Promise((resolve) => {
        if (!state.params.phone) {
          signupForm.value.validateField('phone');
          resolve(false);
        } else {
          resolve(true);
        }
      });
    };

    const handleSubmit = () => {
      signupForm.value.validate(async (valid: boolean) => {
        if (valid) {
          loading.value = true;
          const { dialCode, phone, code, newPassword, confirmPassword } = state.params;
          try {
            await $axios.put('/user/password/reset/phone', {
              phone: dialCode + phone,
              newPassword,
              code,
              confirmPassword,
            });
            loading.value = false;
            root.$router.back();
          } catch (err) {
            loading.value = false;
          }
        }
      });
    };

    return {
      signupForm,
      ...state,
      loading,
      rules,
      beforeSend,
      handleSubmit,
    };
  },
});
</script>
