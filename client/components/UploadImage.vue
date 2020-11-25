<template>
  <div class="upload-image">
    <Avatar :src="value" :size="68" />
    <a-popover v-model="showUpload" trigger="click" placement="bottomLeft">
      <template slot="content">
        <a-form-model ref="uploadForm" class="upload-form" :model="uploadForm">
          <a-form-model-item
            prop="url"
            :rules="[
              {
                required: true,
                message: $t('COMMON.VALIDATE.IMAGE_REQUIRE'),
                trigger: 'blur',
              },
            ]"
            :validate-status="validateStatus"
            :help="help"
          >
            <a-input
              ref="uploadInput"
              v-model="uploadForm.url"
              :placeholder="$t('COMMON.VALIDATE.IMAGE_REQUIRE')"
              size="large"
              @blur="clearValidate"
            ></a-input>
          </a-form-model-item>
          <div class="actions">
            <a-button size="small" @click="cancel">{{ $t('COMMON.LAYOUTS.CANCEL') }}</a-button>
            <a-button type="primary" size="small" :loading="uploadLoading" @click="confirm">{{
              $t('COMMON.LAYOUTS.COMFIRM_UPLOAD')
            }}</a-button>
          </div>
        </a-form-model>
      </template>
      <a-tooltip>
        <template slot="title"> {{ $t('COMMON.LAYOUTS.UPLOAD_IMAGE') }} </template>
        <a-icon class="upload-button" type="camera" :style="{ fontSize: '20px', color: '#4aa271' }" />
      </a-tooltip>
    </a-popover>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator';

@Component
export default class UploadImage extends Vue {
  @Prop({ type: String, required: true })
  value!: string;

  showUpload = false;
  uploadForm: Record<string, string> = {
    url: this.value,
  };

  validateStatus = '';
  help = '';
  uploadLoading = false;

  confirm(): void {
    const { validate }: any = this.$refs.uploadForm;
    validate((valid: boolean) => {
      if (valid) {
        this.uploadLoading = true;
        const img = new Image();
        img.src = this.uploadForm.url;
        img.onload = () => {
          this.uploadLoading = false;
          this.showUpload = false;
          this.$emit('input', this.uploadForm.url);
        };
        img.onerror = () => {
          this.uploadLoading = false;
          this.validateStatus = 'error';
          this.help = this.$t('COMMON.VALIDATE.IMAGE_FORMAT');
          const uploadInput: any = this.$refs.uploadInput;
          uploadInput.focus();
          uploadInput.select();
        };
      }
    });
  }

  clearValidate() {
    this.validateStatus = '';
    this.help = '';
  }

  cancel(): void {
    this.showUpload = false;
  }
}
</script>

<style lang="less">
.upload-image {
  position: relative;

  .upload-button {
    position: absolute;
    top: 64px;
    left: 64px;
    transform: translate(-50%, -50%);
    cursor: pointer;
  }

  .actions {
    display: flex;
    justify-content: flex-end;
    margin-top: 10px;

    .ant-btn-sm:first-child {
      margin-right: 5px;
    }
  }
}
.upload-form {
  min-width: 280px;
}
</style>
