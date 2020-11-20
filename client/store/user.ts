import { Module, VuexModule, Action, getModule } from 'vuex-module-decorators';
import { ReqLoginBodyDto } from '../types/dto/user/req.login.body.dto';
import { ReqSignupBodyDto } from '../types/dto/user/req.signup.body.dto';
import { ReqPasswordResetBodyDto } from '../types/dto//user/req.password.reset.body.dto';
import { $axios } from './axios';
import { store } from './index';

@Module({ dynamic: true, store, name: 'User', namespaced: true })
class User extends VuexModule implements Record<string, any> {
  @Action
  async login(payload: ReqLoginBodyDto) {
    await $axios.post('/user/login', payload);
  }

  @Action
  async signup(payload: ReqSignupBodyDto) {
    await $axios.post('/user/signup', payload);
  }

  @Action
  async resetPasswordByEmail(payload: ReqPasswordResetBodyDto) {
    await $axios.post('/user/password/reset/email', payload);
  }

  @Action
  async resetPasswordByPhone(payload: ReqPasswordResetBodyDto) {
    await $axios.post('/user/password/reset/phone', payload);
  }
}

export default getModule(User);
