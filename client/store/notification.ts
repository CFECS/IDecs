import { Module, VuexModule, Action, getModule } from 'vuex-module-decorators';
import { ReqOtpSendPhoneBodyDto } from '../types/dto/notification/req.otp.send.phone.body.dto';
import { ReqOtpVerifyPhoneBodyDto } from '../types/dto/notification/req.otp.verify.phone.body.dto';
import { ReqOtpSendEmailBodyDto } from '../types/dto/notification/req.otp.send.email.body.dto';
import { ReqOtpVerifyEmailBodyDto } from '../types/dto/notification/req.otp.verify.email.body.dto';
import { $axios } from './axios';
import { store } from './index';

@Module({ dynamic: true, store, name: 'Notification', namespaced: true })
class Notification extends VuexModule {
  @Action
  async sendSms(payload: ReqOtpSendPhoneBodyDto) {
    await $axios.post('/sms', payload);
  }

  @Action
  async verifySms(payload: ReqOtpVerifyPhoneBodyDto) {
    await $axios.post('/sms/verify', payload);
  }

  @Action
  async sendEmail(payload: ReqOtpSendEmailBodyDto) {
    await $axios.post('/email', payload);
  }

  @Action
  async verifyEmail(payload: ReqOtpVerifyEmailBodyDto) {
    await $axios.post('/email/verify', payload);
  }
}

export default getModule(Notification);
