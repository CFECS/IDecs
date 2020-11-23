<template>
  <div class="auth-layouts">
    <div class="switch-lang">
      <SwitchLang />
    </div>
    <div class="page">
      <div class="logo" />
      <div class="description">{{ $t('COMMON.LAYOUTS.DESCRIPTION') }}</div>
      <Nuxt />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator';

@Component({
  middleware(context: any) {
    const token: string | null = sessionStorage.getItem('IDecs_token');
    if (token) {
      context.redirect('/');
    }
  },
})
export default class AuthLayouts extends Vue {}
</script>

<style lang="less">
.auth-layouts {
  position: relative;
  height: 100%;
  background: url('/bg.jpg') no-repeat center center;
  background-size: cover;

  .switch-lang {
    position: absolute;
    top: 20px;
    right: 60px;
    color: #fff;
    cursor: pointer;
    transition: color 0.3s ease-in-out;

    &:hover {
      color: @primary-color;
    }
  }

  .page {
    position: absolute;
    top: 50%;
    right: 60px;
    width: 440px;
    max-width: 100%;
    transform: translate(0, -50%);
    padding: 20px 24px;
    background-color: rgba(255, 255, 255, 0.7);
    box-shadow: @box-shadow-base;

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

  .ant-input,
  .ant-input-group-addon,
  .ant-btn-primary[disabled] {
    background: transparent !important;
  }

  .ant-tabs-nav {
    width: 100%;

    .ant-tabs-tab {
      width: 50%;
      text-align: center;
      margin-right: 0;
    }
  }

  .verify-code {
    .ant-input-group .ant-input {
      border-radius: @border-radius-base;
    }

    .ant-input-group-addon {
      border: none;
      padding: 0 0 0 10px;

      > button {
        border: none !important;
      }
    }
  }
}

@media screen and (max-width: 768px) {
  .auth-layouts {
    background: #fff;

    .switch-lang {
      right: 40px;
      color: rgba(0, 0, 0, 0.65);
    }

    .page {
      right: 50%;
      transform: translate(50%, -50%);
      padding: 0 15px;
      background-color: transparent;
      box-shadow: none;
    }
  }
}
</style>
