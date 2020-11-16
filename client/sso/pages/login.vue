<template lang="pug">
  div
    a-tabs(v-model="tab" size="large")
      a-tab-pane(key="phone" tab="手机号登录")
        a-form-model(
          ref="loginForm"
          :model="phoneForm"
          :rules="phoneRules"
          @submit="handleSubmit"
          @submit.native.prevent
        )
          a-form-model-item(prop="identity")
            a-input(v-model="phoneForm.identity" placeholder="手机号" size="large")
              a-select(
                slot="addonBefore"
                v-model="phoneForm.dialCode"
                :style="{ width: '70px' }"
                :dropdown-match-select-width="false"
                option-label-prop="value"
              )
                a-select-option(v-for="code in $countryDialCodes()" :key="code.value" :value="code.value") {{ code.label }}
          a-form-model-item(prop="password")
            a-input(v-model="phoneForm.password" type="password" placeholder="密码" size="large")
              a-icon(slot="prefix" type="lock" style="color: rgba(0, 0, 0, 0.25)")
          a-form-model-item
            a-button(type="primary" html-type="submit" block size="large") 登录

        .form-footer
          span
            span 暂无账号，
            nuxt-link(to="/register/phone") 立即注册
          nuxt-link(to="/forgot-password") 忘记密码

      a-tab-pane(key="email" tab="邮箱登录")
        a-form-model(
          ref="loginForm"
          :model="emailForm"
          :rules="emailRules"
          @submit="handleSubmit"
          @submit.native.prevent
        )
          a-form-model-item(prop="identity")
            a-input(v-model="emailForm.identity" placeholder="邮箱" size="large")
              a-icon(slot="prefix" type="user" style="color: rgba(0, 0, 0, 0.25)")
          a-form-model-item(prop="password")
            a-input(v-model="emailForm.password" type="password" placeholder="密码" size="large")
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
import { defineComponent, useContext, reactive, ref, computed } from '@nuxtjs/composition-api';
import { LoginTypeEnum } from '../../../common/enum/login.type.enum';

export default defineComponent({
  name: 'Login',

  setup() {
    const { $axios, $checkPhone }: any = useContext();

    const loginForm: any = ref(null);

    const state = reactive({
      tab: 'phone',
      phoneForm: {
        dialCode: '+86',
        identity: '',
        password: '',
        type: LoginTypeEnum.PASSWORD,
      },
      emailForm: {
        identity: '',
        password: '',
        type: LoginTypeEnum.PASSWORD,
      },
      loading: false,
    });

    const phoneRules = {
      identity: [{ validator: $checkPhone, trigger: 'change' }],
      password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
    };

    const emailRules = {
      identity: [
        { required: true, message: '请输入邮箱', trigger: 'change' },
        { type: 'email', message: '请输入正确的邮箱' },
      ],
      password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
    };

    const handleSubmit = () => {
      loginForm.value.validate((valid: boolean) => {
        if (valid) {
          state.loading = true;
          try {
            const { dialCode, identity, password, type } = state.phoneForm;

            const params =
              state.tab === 'phone'
                ? {
                    identity: dialCode + identity,
                    password,
                    type,
                  }
                : state.emailForm;

            $axios.post('/login', params);
            state.loading = false;
          } catch (err) {
            state.loading = false;
          }
        }
      });
    };

    return {
      loginForm,
      ...state,
      phoneRules,
      emailRules,
      handleSubmit,
    };
  },
});
</script>
