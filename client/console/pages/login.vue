<template>
  <div class="page login">
    <div class="logo" />
    <div class="description">IDecs 低成本、完全开放、易于配置的身份管理服务</div>
    <a-form-model :model="params" @submit="handleSubmit" @submit.native.prevent>
      <a-form-model-item>
        <a-input v-model="params.user" placeholder="手机号/邮箱">
          <a-icon slot="prefix" type="user" style="color: rgba(0, 0, 0, 0.25)" />
        </a-input>
      </a-form-model-item>
      <a-form-model-item>
        <a-input v-model="params.password" type="password" placeholder="密码">
          <a-icon slot="prefix" type="lock" style="color: rgba(0, 0, 0, 0.25)" />
        </a-input>
      </a-form-model-item>
      <a-form-model-item>
        <a-button type="primary" html-type="submit" block> 登录 </a-button>
      </a-form-model-item>
    </a-form-model>
    <div class="form-footer">
      <span>暂无账号，<nuxt-link to="/register">立即注册</nuxt-link></span>
      <nuxt-link to="/forgot-password">忘记密码</nuxt-link>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Login',

  data() {
    return {
      params: {
        user: '',
        password: '',
      },
    };
  },

  methods: {
    handleSubmit() {
      console.log(111);
    },
  },
};
</script>

<style lang="less" scoped>
.login {
  .logo {
    width: 100px;
    height: 100px;
    margin: 0 auto;
    background: url('/favicon.png') no-repeat center center;
    background-size: contain;
  }

  .description {
    text-align: center;
    margin: 12px 0 16px;
    color: @text-color-secondary;
  }

  .form-footer {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
  }
}
</style>
