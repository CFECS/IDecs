<template>
  <div class="page">
    <div class="logo" />
    <div class="description">IDecs 低成本、完全开放、易于配置的身份管理服务</div>
    <a-form-model ref="form" :model="params" :rules="rules" @submit="handleSubmit" @submit.native.prevent>
      <a-form-model-item prop="user">
        <a-input v-model="params.user" placeholder="手机号/邮箱" size="large">
          <a-icon slot="prefix" type="user" style="color: rgba(0, 0, 0, 0.25)" />
        </a-input>
      </a-form-model-item>
      <a-form-model-item prop="password">
        <a-input v-model="params.password" type="password" placeholder="密码" size="large">
          <a-icon slot="prefix" type="lock" style="color: rgba(0, 0, 0, 0.25)" />
        </a-input>
      </a-form-model-item>
      <a-form-model-item>
        <a-button type="primary" html-type="submit" block size="large"> 注册 </a-button>
      </a-form-model-item>
    </a-form-model>
    <div class="form-footer">
      <span>已有账号，<nuxt-link to="/login">立即登录</nuxt-link></span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Register',

  data() {
    return {
      params: {
        user: '',
        password: '',
      },
      rules: {
        user: [{ required: true, message: '请输入手机号或邮箱', trigger: 'blur' }],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
      },
    };
  },

  methods: {
    handleSubmit() {
      this.$refs.form.validate((valid) => {
        // console.log(valid);
      });
    },
  },
};
</script>
