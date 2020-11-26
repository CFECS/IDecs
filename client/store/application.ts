import { Module, VuexModule, Action, MutationAction, getModule } from 'vuex-module-decorators';
import { ReqAddOrUpdateBodyDto } from '../types/dto/project/req.add.or.update.body.dto';
import { ReqPaginationBaseDto } from '../types/dto/base/req.pagination.base.dto';
import { ResPaginationBaseDto } from '../types/dto/base/res.pagination.base.dto';
import { $axios } from './axios';
import { store } from './index';

interface moduleDto {
  items: any[];
  pagination: ResPaginationBaseDto;
  details: any;
}

@Module({ dynamic: true, store, name: 'Application', namespaced: true })
class Application extends VuexModule implements moduleDto {
  items = [];
  pagination = { current: 1, total: 0 };
  details = {};

  @MutationAction
  async getAll(params: ReqPaginationBaseDto) {
    const { items, total }: any = await $axios.get('/project', { params });
    return {
      items,
      pagination: {
        current: params.page,
        total,
      },
    };
  }

  @Action
  async add(payload: ReqAddOrUpdateBodyDto) {
    await $axios.post('/project', payload);
  }

  @Action
  async removeById(id: number) {
    await $axios.delete(`/project/${id}`);
  }

  @MutationAction
  async getById(id: number) {
    const data: any = await $axios.get(`/project/${id}`);
    return {
      details: data,
    };
  }

  @Action
  async updateById(payload: ReqAddOrUpdateBodyDto) {
    await $axios.put(`/project/${payload.id}`, payload);
  }
}

export default getModule(Application);
