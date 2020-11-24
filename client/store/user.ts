import { Module, VuexModule, MutationAction, Action, getModule } from 'vuex-module-decorators';
import { ReqLoginBodyDto } from '../types/dto/user/req.login.body.dto';
import { ResLoginDto } from '../types/dto//user/res.login.dto';
import { ResTokenValidateDto } from '../types/dto//user/res.token.validate.dto';
import { ReqSignupBodyDto } from '../types/dto/user/req.signup.body.dto';
import { ReqPasswordResetBodyDto } from '../types/dto//user/req.password.reset.body.dto';
import { ReqProfileUpdateBodyDto } from '../types/dto/user/req.profile.update.body.dto';
import { ReqEmailOrPhoneChangeBodyDto } from '../types/dto/user/req.email.or.phone.change.body.dto';
import { ReqPasswordChangeBodyDto } from '../types/dto/user/req.password.change.body.dto';
import { $axios } from './axios';
import { store } from './index';

interface moduleDto {
  ticket: string;
  info: any;
}

@Module({ dynamic: true, store, name: 'User', namespaced: true })
class User extends VuexModule implements moduleDto {
  ticket = '';
  info = null;

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

  @MutationAction
  async getUserInfo() {
    try {
      const info: any = await $axios.get('/user');
      return {
        info,
      };
    } catch (err) {
      return {
        info: this.info,
      };
    }
  }

  @Action
  async setProfile(payload: ReqProfileUpdateBodyDto) {
    await $axios.put('/user/profile', payload);
    await this.getUserInfo();
  }

  @Action
  async changePhone(payload: ReqEmailOrPhoneChangeBodyDto) {
    await $axios.put('/user/phone/change', payload);
    await this.getUserInfo();
  }

  @Action
  async changeEmail(payload: ReqEmailOrPhoneChangeBodyDto) {
    await $axios.put('/user/email/change', payload);
    await this.getUserInfo();
  }

  @Action
  async changePassword(payload: ReqPasswordChangeBodyDto) {
    await $axios.put('/user/password/change', payload);
    await this.getUserInfo();
  }
}

export default getModule(User);
