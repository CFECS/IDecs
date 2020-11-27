<template>
  <div>
    <page-tips :title="$t('APPLICATION.TITLE')" :description="$t('APPLICATION.INTRO')">
      <a-button type="primary" @click="handleCreateApplication">{{ $t('APPLICATION.ADD') }}</a-button>
    </page-tips>

    <div class="bg-white">
      <a-table
        row-key="id"
        :columns="columns"
        :loading="loading"
        :data-source="items"
        :pagination="pagination"
        :scroll="{ x: 1200 }"
        @change="handleChange"
      >
        <template slot="id" slot-scope="text, record">
          <nuxt-link :to="`/application/${$encode(record.id)}`">
            {{ text }}
          </nuxt-link>
        </template>

        <template slot="name" slot-scope="text">
          {{ text || '-' }}
        </template>

        <template slot="description" slot-scope="text">
          {{ text || '-' }}
        </template>

        <template slot="owner" slot-scope="text, record">
          <a v-if="text === userId" disabled> {{ $t('APPLICATION.SELF') }} </a>
          <nuxt-link v-else :to="`/user/${$encode(record.createdById)}`">
            {{ record.createdBy.username || record.createdBy.phone || record.createdBy.email }}
          </nuxt-link>
        </template>

        <template slot="action" slot-scope="text, record">
          <a-tooltip :title="$t('COMMON.LAYOUTS.EDIT')">
            <a-icon
              type="edit"
              :style="{ cursor: 'pointer', color: '#4aa271' }"
              @click="handleEditApplication(record)"
            />
          </a-tooltip>
          <a-divider type="vertical" />

          <a-popconfirm
            :title="$t('APPLICATION.DELETE_TIPS')"
            :ok-text="$t('COMMON.LAYOUTS.YES')"
            :cancel-text="$t('COMMON.LAYOUTS.NO')"
            placement="topRight"
            @confirm="handleDelete(record.id)"
          >
            <a-tooltip :title="$t('COMMON.LAYOUTS.DELETE')">
              <a-icon type="delete" :style="{ cursor: 'pointer', color: '#f5222d' }" />
            </a-tooltip>
          </a-popconfirm>
        </template>
      </a-table>
    </div>

    <a-modal
      v-model="visible"
      :title="title"
      :ok-text="$t('COMMON.LAYOUTS.CONFIRM')"
      :cancel-text="$t('COMMON.LAYOUTS.CANCEL')"
      :confirm-loading="confirmLoading"
      @ok="submit"
    >
      <a-form-model
        ref="applicationForm"
        layout="horizontal"
        hide-required-mark
        :model="params"
        :rules="rules"
        :label-col="{ span: 4 }"
        :wrapper-col="{ span: 20 }"
      >
        <a-form-model-item prop="name" :label="$t('APPLICATION.NAME')">
          <a-input v-model.trim="params.name" :placeholder="$t('APPLICATION.NAME_PLACEHOLDER')" size="large" />
        </a-form-model-item>

        <a-form-model-item prop="description" :label="$t('APPLICATION.DESCRIPTION')">
          <a-textarea
            v-model.trim="params.description"
            :placeholder="$t('APPLICATION.DESCRIPTION_PLACEHOLDER')"
            :auto-size="{ minRows: 3, maxRows: 5 }"
            size="large"
          />
        </a-form-model-item>
      </a-form-model>
    </a-modal>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator';
import Application from '@/store/application';
import User from '@/store/user';
import { ReqPaginationBaseDto } from '../../types/dto/base/req.pagination.base.dto';
import { ReqAddOrUpdateBodyDto } from '../../types/dto/project/req.add.or.update.body.dto';

@Component
export default class ApplicationManagement extends Vue {
  private queryParams: ReqPaginationBaseDto = {
    page: 1,
    limit: 10,
  };

  private loading = false;

  private visible = false;
  private title = this.$t('APPLICATION.ADD');
  private params: ReqAddOrUpdateBodyDto = this.initParams();
  private confirmLoading = false;
  private rules: Record<string, any> = {
    name: [{ required: true, message: this.$t('APPLICATION.NAME_PLACEHOLDER'), trigger: 'blur' }],
    description: [{ required: true, message: this.$t('APPLICATION.DESCRIPTION_PLACEHOLDER'), trigger: 'blur' }],
  };

  get userId() {
    return User.info?.id;
  }

  get columns() {
    return [
      {
        title: '#ID',
        dataIndex: 'id',
        width: 80,
        scopedSlots: { customRender: 'id' },
      },
      {
        title: this.$t('APPLICATION.NAME'),
        dataIndex: 'name',
        width: 120,
        scopedSlots: { customRender: 'name' },
      },
      {
        title: this.$t('APPLICATION.DESCRIPTION'),
        dataIndex: 'description',
        width: 200,
        ellipsis: true,
        scopedSlots: { customRender: 'description' },
      },
      {
        title: this.$t('APPLICATION.OWNER'),
        dataIndex: 'updatedById',
        width: 120,
        ellipsis: true,
        scopedSlots: { customRender: 'owner' },
      },
      {
        title: this.$t('COMMON.LAYOUTS.CREATED_AT'),
        dataIndex: 'createdAt',
        width: 160,
        customRender: (text: any) => this.$datetime(text),
      },
      {
        title: this.$t('COMMON.LAYOUTS.UPDATED_AT'),
        dataIndex: 'updatedAt',
        width: 160,
        customRender: (text: any) => this.$datetime(text),
      },
      {
        title: this.$t('COMMON.LAYOUTS.ACTIONS'),
        fixed: 'right',
        width: 90,
        scopedSlots: { customRender: 'action' },
      },
    ];
  }

  get items() {
    return Application.items;
  }

  get pagination() {
    return Application.pagination;
  }

  async fetch() {
    await this.getData();
  }

  async getData() {
    try {
      this.loading = true;
      await Application.getAll(this.queryParams);
      this.loading = false;
    } catch (err) {
      this.loading = false;
    }
  }

  async handleChange(pagination: any) {
    this.queryParams.page = pagination.current;
    await this.getData();
  }

  initParams(): ReqAddOrUpdateBodyDto {
    return {
      name: '',
      description: '',
    };
  }

  handleCreateApplication() {
    this.title = this.$t('APPLICATION.ADD');
    this.params = this.initParams();
    this.visible = true;
  }

  handleEditApplication(record: any) {
    this.title = this.$t('APPLICATION.EDIT');
    this.params.id = record.id;
    this.params.name = record.name;
    this.params.description = record.description;
    this.visible = true;
  }

  submit() {
    const applicationForm: any = this.$refs.applicationForm;
    applicationForm.validate(async (valid: boolean) => {
      if (valid) {
        this.confirmLoading = true;
        try {
          const request = this.params.id ? Application.updateById : Application.add;
          await request(this.params);
          this.confirmLoading = false;
          this.visible = false;
          this.$message.success(
            this.params.id ? this.$t('COMMON.LAYOUTS.EDIT_SUCCESS') : this.$t('COMMON.LAYOUTS.ADD_SUCCESS'),
          );
          await this.getData();
        } catch (err) {
          this.confirmLoading = false;
        }
      }
    });
  }

  async handleDelete(id: number) {
    try {
      await Application.removeById(id);
      this.$message.success(this.$t('COMMON.LAYOUTS.DELETE_SUCCESS'));
      await this.getData();
    } catch (error) {
      this.$message.success(this.$t('COMMON.LAYOUTS.DELETE_ERROR'));
    }
  }
}
</script>

<router lang="yaml">
meta:
  icon: project
  title: COMMON.PAGE_TITLE.APPLICATION_MANAGEMENT
</router>
