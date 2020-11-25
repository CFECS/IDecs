<template>
  <div>
    <a-tabs v-model="tab" size="large" @change="saveKey">
      <a-tab-pane key="phone" :tab="$t('AUTH.LOGIN_BY_PHONE')">
        <LoginByPhone />
        <div class="form-footer">
          <span>
            <span>{{ $t('AUTH.NO_ACCOUNT') }}</span>
            <nuxt-link to="/register/phone">{{ $t('AUTH.NOW_REGISTER') }}</nuxt-link>
          </span>
          <nuxt-link to="/forgot-password/phone">{{ $t('AUTH.FOTGOT_PASSWORD') }}</nuxt-link>
        </div>
      </a-tab-pane>

      <a-tab-pane key="email" :tab="$t('AUTH.LOGIN_BY_EMAIL')">
        <LoginByEmail />
        <div class="form-footer">
          <span>
            <span>{{ $t('AUTH.NO_ACCOUNT') }}</span>
            <nuxt-link to="/register/email">{{ $t('AUTH.NOW_REGISTER') }}</nuxt-link>
          </span>
          <nuxt-link to="/forgot-password/email">{{ $t('AUTH.FOTGOT_PASSWORD') }}</nuxt-link>
        </div>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator';
import * as Cookies from 'js-cookie';

@Component({
  layout: 'auth',
  head() {
    return {
      title: this.$generateTitle(this.$t('COMMON.PAGE_TITLE.LOGIN')),
    };
  },
})
export default class Login extends Vue {
  private tab: string = Cookies.get('IDecs_login_tabs_key') || 'phone';

  public saveKey(key: string): void {
    Cookies.set('IDecs_login_tabs_key', key);
  }
}
</script>
