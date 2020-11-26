<template>
  <div>
    <page-tips title="应用管理" description="统一管理应用相关信息，以及用户和权限的分配等相关操作~">
      <a-button type="primary" @click="handleCreateApplication">添加应用</a-button>
    </page-tips>

    <div class="bg-white">
      <a-table
        row-key="id"
        :columns="columns"
        :loading="loading"
        :data-source="items"
        :pagination="pagination"
        :scroll="{ x: 1000 }"
        @change="handleChange"
      >
        <template slot="name" slot-scope="text, record">
          <nuxt-link :to="`/application/${$encode(record.id)}`">
            {{ text }}
          </nuxt-link>
        </template>

        <template slot="owner" slot-scope="text, record">
          <a v-if="text === userId" disabled> 自己 </a>
          <nuxt-link v-else :to="`/user/${$encode(record.createdById)}`">
            {{ record.createdBy.username || record.createdBy.phone || record.createdBy.email }}
          </nuxt-link>
        </template>

        <template slot="action" slot-scope="text, record">
          <a-tooltip title="编辑">
            <a-icon
              type="edit"
              :style="{ cursor: 'pointer', color: '#4aa271' }"
              @click="handleEditApplication(record)"
            />
          </a-tooltip>
          <a-divider type="vertical" />

          <a-popconfirm
            title="你确定要删除该应用吗？"
            ok-text="是"
            cancel-text="否"
            placement="topRight"
            @confirm="handleDelete(record.id)"
          >
            <a-tooltip title="删除">
              <a-icon type="delete" :style="{ cursor: 'pointer', color: '#f5222d' }" />
            </a-tooltip>
          </a-popconfirm>
        </template>
      </a-table>
    </div>

    <a-modal
      v-model="visible"
      :title="title"
      ok-text="确认"
      cancel-text="取消"
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
        <a-form-model-item prop="name" label="应用名称">
          <a-input v-model.trim="params.name" placeholder="请输入应用名称" size="large" />
        </a-form-model-item>

        <a-form-model-item prop="description" label="应用简介">
          <a-textarea
            v-model.trim="params.description"
            placeholder="请输入应用简介"
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
import * as dayjs from 'dayjs';
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
  private title = '添加应用';
  private params: ReqAddOrUpdateBodyDto = this.initParams();
  private confirmLoading = false;
  private rules: Record<string, any> = {
    name: [{ required: true, message: '请输入应用名称', trigger: 'blur' }],
    description: [{ required: true, message: '请输入应用简介', trigger: 'blur' }],
  };

  get userId() {
    return User.info?.id;
  }

  get columns() {
    return [
      {
        title: '应用名称',
        dataIndex: 'name',
        width: 120,
        scopedSlots: { customRender: 'name' },
      },
      {
        title: '应用简介',
        dataIndex: 'description',
        width: 200,
        ellipsis: true,
      },
      {
        title: '拥有者',
        dataIndex: 'updatedById',
        width: 120,
        ellipsis: true,
        scopedSlots: { customRender: 'owner' },
      },
      {
        title: '创建时间',
        dataIndex: 'createdAt',
        width: 160,
        customRender: (text: any) => this.$datetime(text),
      },
      {
        title: '更新时间',
        dataIndex: 'updatedAt',
        width: 160,
        customRender: (text: any) => this.$datetime(text),
      },
      {
        title: '操作',
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
    this.title = '添加应用';
    this.params = this.initParams();
    this.visible = true;
  }

  handleEditApplication(record: any) {
    this.title = '编辑应用';
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
          this.$message.success(this.params.id ? '编辑成功~' : '添加成功~');
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
      this.$message.success('删除成功~');
      await this.getData();
    } catch (error) {
      this.$message.success('删除失败~');
    }
  }
}
</script>

<router lang="yaml">
meta:
  icon: project
  title: COMMON.PAGE_TITLE.APPLICATION_MANAGEMENT
</router>
