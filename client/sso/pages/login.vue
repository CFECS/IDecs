<template>
  <div>
    <a-tabs v-model="tab" size="large" @change="saveKey">
      <a-tab-pane key="phone" tab="手机号登录">
        <a-form-model
          ref="loginForm"
          :model="phoneForm"
          :rules="phoneRules"
          @submit="handleSubmit"
          @submit.native.prevent
        >
          <a-form-model-item prop="identity">
            <a-input v-model="phoneForm.identity" placeholder="手机号" size="large">
              <a-select
                slot="addonBefore"
                v-model="dialCode"
                :style="{ width: '70px' }"
                :dropdown-match-select-width="false"
                option-label-prop="value"
              >
                <a-select-option v-for="code in $countryDialCodes()" :key="code.value" :value="code.value">
                  {{ code.label }}
                </a-select-option>
              </a-select>
            </a-input>
          </a-form-model-item>

          <a-form-model-item prop="password">
            <a-input v-model="phoneForm.password" type="password" placeholder="密码" size="large">
              <a-icon slot="prefix" type="lock" style="color: rgba(0, 0, 0, 0.25)"></a-icon>
            </a-input>
          </a-form-model-item>

          <a-form-model-item>
            <a-button type="primary" :loading="loading" html-type="submit" block size="large">登录</a-button>
          </a-form-model-item>
        </a-form-model>

        <div class="form-footer">
          <span>
            <span>暂无账号，</span>
            <nuxt-link to="/register/phone">立即注册</nuxt-link>
          </span>
          <nuxt-link to="/forgot-password/phone">忘记密码</nuxt-link>
        </div>
      </a-tab-pane>

      <a-tab-pane key="email" tab="邮箱登录">
        <a-form-model
          ref="loginForm"
          :model="emailForm"
          :rules="emailRules"
          @submit="handleSubmit"
          @submit.native.prevent
        >
          <a-form-model-item prop="identity">
            <a-input v-model="emailForm.identity" placeholder="邮箱" size="large">
              <a-icon slot="prefix" type="user" style="color: rgba(0, 0, 0, 0.25)"></a-icon>
            </a-input>
          </a-form-model-item>

          <a-form-model-item prop="password">
            <a-input v-model="emailForm.password" type="password" placeholder="密码" size="large">
              <a-icon slot="prefix" type="lock" style="color: rgba(0, 0, 0, 0.25)"></a-icon>
            </a-input>
          </a-form-model-item>

          <a-form-model-item>
            <a-button type="primary" :loading="loading" html-type="submit" block size="large">登录</a-button>
          </a-form-model-item>
        </a-form-model>

        <div class="form-footer">
          <span>
            <span>暂无账号，</span>
            <nuxt-link to="/register/email">立即注册</nuxt-link>
          </span>
          <nuxt-link to="/forgot-password/email">忘记密码</nuxt-link>
        </div>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator';
import * as Cookies from 'js-cookie';
import { LoginTypeEnum } from '../../../common/enum/login.type.enum';
import { ReqLoginBodyDto } from '../../../common/dto/user/req.login.body.dto';

@Component
export default class Login extends Vue {
  private tab: string = Cookies.get('IDecs_login_tabs_key') || 'phone';

  private dialCode = '+86';

  private phoneForm: ReqLoginBodyDto = {
    identity: '',
    password: '',
    type: LoginTypeEnum.PASSWORD,
  };

  private emailForm: ReqLoginBodyDto = {
    identity: '',
    password: '',
    type: LoginTypeEnum.PASSWORD,
  };

  loading = false;

  phoneRules: any = {
    identity: [{ validator: this.$checkPhone, trigger: 'change' }],
    password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
  };

  emailRules: any = {
    identity: [
      { required: true, message: '请输入邮箱', trigger: 'change' },
      { type: 'email', message: '请输入正确的邮箱' },
    ],
    password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
  };

  public saveKey(key: string): void {
    Cookies.set('IDecs_login_tabs_key', key);
  }

  public pickParams(): ReqLoginBodyDto {
    return this.tab === 'phone'
      ? { ...this.phoneForm, identity: this.dialCode + this.phoneForm.identity }
      : this.emailForm;
  }

  public handleSubmit(): void {
    const loginForm: any = this.$refs.loginForm;
    loginForm.validate(async (valid: boolean) => {
      if (valid) {
        this.loading = true;
        const params: ReqLoginBodyDto = this.pickParams();
        try {
          await this.$axios.post('/user/login', params);
          this.loading = false;
        } catch (err) {
          this.loading = false;
        }
      }
    });
  }
}
</script>
