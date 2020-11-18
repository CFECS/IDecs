<template lang="pug">
  div
    a-form-model(
      ref="signupForm"
      :model="params"
      :rules="rules"
      @submit="handleSubmit"
      @submit.native.prevent
    )
      a-form-model-item(prop="email")
        a-input(v-model="params.email" placeholder="邮箱" size="large")
          a-icon(slot="prefix" type="user" style="color: rgba(0, 0, 0, 0.25)")

      a-form-model-item(prop="code" class="verify-code")
        a-input(v-model="params.code" placeholder="邮箱验证码" size="large")
          a-icon(slot="prefix" type="safety-certificate" style="color: rgba(0, 0, 0, 0.25)")
          send-code(
            slot="addonAfter"
            method="email"
            :value="params.email"
            :type="0"
            :before-send="beforeSend"
          )

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
        a(@click="$router.back()") 立即登录
      nuxt-link(to="/register/phone" replace) 手机号注册
</template>

<script lang="ts">
import { defineComponent, useContext, reactive, ref } from '@nuxtjs/composition-api';

export default defineComponent({
  name: 'PhoneRegister',

  setup(props, { root }) {
    const { $axios, $checkPassword }: any = useContext();

    const signupForm: any = ref(null);
    const loading = ref(false);

    const state = reactive({
      params: {
        email: '',
        code: '',
        password: '',
        confirmPassword: '',
        profile: {},
      },
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
      email: [
        { required: true, message: '请输入邮箱', trigger: 'change' },
        { type: 'email', message: '请输入正确的邮箱' },
      ],
      code: [{ required: true, message: '请输入邮箱验证码', trigger: 'change' }],
      password: [{ validator: $checkPassword, trigger: 'change' }],
      confirmPassword: [{ validator: checkConfirmPass, trigger: 'change' }],
    };

    const beforeSend = () => {
      return new Promise((resolve) => {
        if (!state.params.email) {
          signupForm.value.validateField('email');
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
          try {
            await $axios.post('/user/signup', state.params);
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
