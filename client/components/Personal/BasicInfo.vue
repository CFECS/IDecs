<template>
  <a-form-model layout="horizontal" :model="formData" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
    <a-form-model-item :label="$t('PERSONAL.AVATAR')">
      <UploadImage v-model="formData.avatar" />
    </a-form-model-item>

    <a-form-model-item :label="$t('PERSONAL.USERNAME')">
      <a-input v-model="formData.username" :placeholder="$t('PERSONAL.USERNAME_PLACEHOLDER')" size="large"></a-input>
    </a-form-model-item>

    <a-form-model-item :label="$t('PERSONAL.INTRODUCTION')">
      <a-textarea
        v-model="formData.profile.description"
        :placeholder="$t('PERSONAL.INTRODUCTION_PLACEHOLDER')"
        :auto-size="{ minRows: 3, maxRows: 5 }"
      />
    </a-form-model-item>
    <a-row>
      <a-col :span="4"></a-col>
      <a-col :span="20">
        <a-button type="primary" :loading="loading" @click="submit">{{ $t('PERSONAL.UPLOAD_INFORMATION') }}</a-button>
      </a-col>
    </a-row>
  </a-form-model>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator';
import { ReqProfileUpdateBodyDto } from '../../types/dto/user/req.profile.update.body.dto';
import User from '~/store/user';

@Component
export default class BasicInfo extends Vue {
  get userInfo() {
    return User.info;
  }

  formData: ReqProfileUpdateBodyDto = {
    avatar: this.userInfo?.avatar || '',
    username: this.userInfo?.username || '',
    profile: {
      description: this.userInfo?.profile?.description || '',
    },
  };

  loading = false;

  async submit() {
    try {
      this.loading = true;
      await User.setProfile(this.formData);
      this.loading = false;
    } catch (err) {
      this.loading = false;
    }
  }
}
</script>
