<template lang="pug">
  div
    a-form-model(
      ref="loginForm"
      :model="params"
      :rules="rules"
      @submit="handleSubmit"
      @submit.native.prevent
    )
      a-form-model-item(prop="identity")
        a-input(v-model="params.identity" placeholder="手机号/邮箱" size="large")
          a-icon(slot="prefix" type="user" style="color: rgba(0, 0, 0, 0.25)")
      a-form-model-item(prop="password")
        a-input(v-model="params.password" type="password" placeholder="密码" size="large")
          a-icon(slot="prefix" type="lock" style="color: rgba(0, 0, 0, 0.25)")
      a-form-model-item
        a-button(type="primary" html-type="submit" block size="large") 登录

    .form-footer
      span
        span 暂无账号，
        nuxt-link(to="/register/phone") 立即注册
      nuxt-link(to="/forgot-password") 忘记密码
</template>

<script lang="ts">
import { defineComponent, useContext, reactive, ref } from '@nuxtjs/composition-api';
import { LoginTypeEnum } from '../../../common/enum/login.type.enum';

export default defineComponent({
  name: 'Login',

  setup() {
    const { $axios }: any = useContext();

    const params = reactive({
      identity: '',
      password: '',
      type: LoginTypeEnum.PASSWORD,
    });

    const rules: any = {
      identity: [{ required: true, message: '请输入手机号或邮箱', trigger: 'blur' }],
      password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
    };

    const loginForm: any = ref(null);

    const handleSubmit = () => {
      loginForm.value.validate((valid: boolean) => {
        if (valid) {
          $axios.post('/login', params);
        }
      });
    };

    return {
      loginForm,
      params,
      rules,
      handleSubmit,
    };
  },
});
</script>
