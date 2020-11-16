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

      a-form-model-item(prop="password")
        a-input(v-model="params.password" type="password" placeholder="密码" size="large")
          a-icon(slot="prefix" type="lock" style="color: rgba(0, 0, 0, 0.25)")
      a-form-model-item(prop="confirmPassword")
        a-input(v-model="params.confirmPassword" type="password" placeholder="确认密码" size="large")
          a-icon(slot="prefix" type="lock" style="color: rgba(0, 0, 0, 0.25)")
      a-form-model-item
        a-button(type="primary" :loading="loading" html-type="submit" block size="large") 注册

    .form-footer
      span
        span 已有账号，
        nuxt-link(to="/login") 立即登录
      nuxt-link(to="/register/email") 邮箱注册
</template>

<script lang="ts">
import { defineComponent, useContext, reactive, ref } from '@nuxtjs/composition-api';

export default defineComponent({
  name: 'PhoneRegister',

  setup(props, { root }) {
    const { $axios, $checkPhone, $checkPassword, $checkConfirmPass }: any = useContext();

    const signupForm: any = ref(null);

    const state = reactive({
      params: {
        dialCode: '+86',
        phone: '',
        password: '',
        confirmPassword: '',
        profile: {},
      },
      loading: false,
    });

    const checkConfirmPass = (rule: any, value: string, callback: any) => {
      if (!value) {
        callback(new Error('请再次输入密码'));
      } else if (value !== state.params.password) {
        callback(new Error('两次密码不一致'));
      } else {
        callback();
      }
    };

    const rules: any = {
      phone: [{ validator: $checkPhone, trigger: 'change' }],
      password: [{ validator: $checkPassword, trigger: 'change' }],
      confirmPassword: [{ validator: checkConfirmPass, trigger: 'change' }],
    };

    const handleSubmit = () => {
      signupForm.value.validate(async (valid: boolean) => {
        if (valid) {
          state.loading = true;
          const { dialCode, phone, password, confirmPassword, profile } = state.params;
          try {
            await $axios.post('/signup', {
              ...state.params,
              phone: dialCode + phone,
              password,
              confirmPassword,
              profile,
            });
            state.loading = false;
            root.$router.push('/login');
          } catch (err) {
            state.loading = false;
          }
        }
      });
    };

    return {
      signupForm,
      ...state,
      rules,
      handleSubmit,
    };
  },
});
</script>
