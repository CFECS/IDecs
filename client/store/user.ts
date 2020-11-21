import { Module, VuexModule, MutationAction, Action, getModule } from 'vuex-module-decorators';
import { ReqLoginBodyDto } from '../types/dto/user/req.login.body.dto';
import { ResLoginDto } from '../types/dto//user/res.login.dto';
import { ResTokenValidateDto } from '../types/dto//user/res.token.validate.dto';
import { ReqSignupBodyDto } from '../types/dto/user/req.signup.body.dto';
import { ReqPasswordResetBodyDto } from '../types/dto//user/req.password.reset.body.dto';
import { $axios } from './axios';
import { store } from './index';

interface moduleDto {
  ticket: string;
}

@Module({ dynamic: true, store, name: 'User', namespaced: true })
class User extends VuexModule implements moduleDto {
  ticket = '';

  @Action
  async signup(payload: ReqSignupBodyDto) {
    await $axios.post('/user/signup', payload);
  }

  @MutationAction
  async login(payload: ReqLoginBodyDto) {
    const { ticket }: ResLoginDto = await $axios.post('/user/login', payload);
    return {
      ticket,
    };
  }

  @Action
  async validateTicket(params: ResLoginDto) {
    try {
      const { token }: ResTokenValidateDto = await $axios.get('/user/ticket/validate', {
        params,
      });
      window.sessionStorage.setItem('IDecs_token', token);
      return true;
    } catch (err) {
      return false;
    }
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
