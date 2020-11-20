import { Module, VuexModule, Mutation, getModule } from 'vuex-module-decorators';
import { store } from './index';

interface commonDto {
  collapsed: boolean;
}

@Module({ dynamic: true, store, name: 'Common', namespaced: true })
class Common extends VuexModule implements commonDto {
  collapsed = false;

  @Mutation
  public triggerCollapsed(collapsed: boolean) {
    this.collapsed = collapsed;
  }
}

export default getModule(Common);
