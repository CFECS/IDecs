<template>
  <div class="bg-white">
    <a-table
      row-key="id"
      :columns="columns"
      :loading="loading"
      :data-source="items"
      :pagination="pagination"
      :scroll="{ x: 1400 }"
      @change="handleChange"
    >
      <template slot="id" slot-scope="text, record">
        <nuxt-link :to="`/user/${$encode(record.id)}`">
          {{ text }}
        </nuxt-link>
      </template>

      <template slot="username" slot-scope="text">
        {{ text || '-' }}
      </template>

      <template slot="phone" slot-scope="text">
        {{ text || '-' }}
      </template>

      <template slot="email" slot-scope="text">
        {{ text || '-' }}
      </template>

      <template slot="description" slot-scope="text">
        {{ text || '-' }}
      </template>

      <template slot="action" slot-scope="text, record">
        <a-popconfirm
          :title="$t('USER.DELETE_TIPS')"
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
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator';
import User from '@/store/user';
import { ReqPaginationBaseDto } from '../../types/dto/base/req.pagination.base.dto';

@Component
export default class UserManagement extends Vue {
  private queryParams: ReqPaginationBaseDto = {
    page: 1,
    limit: 10,
  };

  private loading = false;

  get columns() {
    return [
      {
        title: '#ID',
        dataIndex: 'id',
        width: 90,
        scopedSlots: { customRender: 'id' },
      },
      {
        title: this.$t('USER.USERNAME'),
        dataIndex: 'username',
        width: 120,
        scopedSlots: { customRender: 'username' },
      },
      {
        title: this.$t('USER.PHONE'),
        dataIndex: 'phone',
        width: 120,
        scopedSlots: { customRender: 'phone' },
      },
      {
        title: this.$t('USER.EMAIL'),
        dataIndex: 'email',
        width: 200,
        ellipsis: true,
        scopedSlots: { customRender: 'email' },
      },
      {
        title: this.$t('USER.INTRODUCTION'),
        dataIndex: 'profile.description',
        width: 200,
        ellipsis: true,
        scopedSlots: { customRender: 'description' },
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
        width: 60,
        align: 'center',
        scopedSlots: { customRender: 'action' },
      },
    ];
  }

  get items() {
    return User.items;
  }

  get pagination() {
    return User.pagination;
  }

  async fetch() {
    await this.getData();
  }

  async getData() {
    try {
      this.loading = true;
      await User.getAll(this.queryParams);
      this.loading = false;
    } catch (err) {
      this.loading = false;
    }
  }

  async handleChange(pagination: any) {
    this.queryParams.page = pagination.current;
    await this.getData();
  }

  async handleDelete(id: number) {
    try {
      await User.removeById(id);
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
  icon: user
  title: COMMON.PAGE_TITLE.USER_MANAGEMENT
</router>
