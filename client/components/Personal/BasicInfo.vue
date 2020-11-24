<template>
  <a-form-model layout="horizontal" :model="formData" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
    <a-form-model-item label="头像">
      <div class="avatar-wrapper">
        <a-avatar :src="formData.avatar || '/avatar.jpg'" :size="68"></a-avatar>
      </div>
      <a-popover v-model="showUpload" trigger="click" placement="bottomLeft">
        <template slot="content">
          <a-form-model ref="uploadForm" class="upload-form" :model="uploadForm">
            <a-form-model-item
              prop="url"
              :rules="[
                {
                  required: true,
                  message: '请输入图片的网络地址',
                  trigger: 'blur',
                },
                {
                  type: 'url',
                  message: '请输入正确的网络地址',
                  trigger: 'blur',
                },
              ]"
            >
              <a-input v-model="uploadForm.url" placeholder="请输入图片的网络地址"></a-input>
            </a-form-model-item>
            <div class="actions">
              <a-button size="small" @click="cancel">取消</a-button>
              <a-button type="primary" size="small" @click="confirm">确定上传</a-button>
            </div>
          </a-form-model>
        </template>
        <a-button size="small">更换头像</a-button>
      </a-popover>
    </a-form-model-item>

    <a-form-model-item label="用户名">
      <a-input v-model="formData.username" placeholder="请输入用户名"></a-input>
    </a-form-model-item>

    <a-form-model-item label="个人介绍">
      <a-textarea
        v-model="formData.profile.description"
        placeholder="请输入个人介绍"
        :auto-size="{ minRows: 3, maxRows: 5 }"
      />
    </a-form-model-item>
    <a-row>
      <a-col :span="4"></a-col>
      <a-col :span="20"><a-button type="primary" :loading="loading" @click="submit">更新信息</a-button></a-col>
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

  showUpload = false;

  uploadForm: Record<string, string> = {
    url: this.userInfo?.avatar || '',
  };

  public confirm(): void {
    const { validate }: any = this.$refs.uploadForm;
    validate((valid: boolean) => {
      if (valid) {
        this.formData.avatar = this.uploadForm.url;
        this.showUpload = false;
      }
    });
  }

  public cancel(): void {
    this.showUpload = false;
  }

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

<style lang="less" scoped>
.actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 10px;

  .ant-btn-sm:first-child {
    margin-right: 5px;
  }
}

.upload-form {
  min-width: 240px;
}
</style>
