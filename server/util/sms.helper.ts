import * as RPCClient from '@alicloud/pop-core';
import { sms } from 'tencentcloud-sdk-nodejs';
import { SendSmsRequest } from 'tencentcloud-sdk-nodejs/src/services/sms/v20190711/sms_models';
import { Injectable, Logger } from '@nestjs/common';
import { config } from '../../config';
import { CustomException } from '../exception/custom.exception';
import { ResponseCodeEnum } from '../enum/response.code.enum';

@Injectable()
export class SmsHelper {
  private readonly clientAli;
  private readonly clientTencent;

  constructor(private readonly logger: Logger) {
    this.clientAli = new RPCClient({
      apiVersion: '2017-05-25',
      endpoint: 'https://dysmsapi.aliyuncs.com',
      ...config.sms.aliyun,
    });
    this.clientTencent = new sms.v20190711.Client({
      credential: {
        secretId: config.sms.tencent.secretId,
        secretKey: config.sms.tencent.secretKey,
      },
      region: 'ap-guangzhou',
    });
  }

  sendSms(code: string, phone: string): Promise<string> {
    const smsConfig = config.sms;
    for (const key of Object.keys(smsConfig)) {
      if (!smsConfig[key].enable) {
        continue;
      }
      switch (key) {
        case 'aliyun':
          return this.sendAliSms(code, phone);
        case 'tencent':
          return this.sendTencentSms(code, phone);
      }
    }
    throw new CustomException(ResponseCodeEnum.UNKNOWN_SMS_VENDOR);
  }

  async sendAliSms(code: string, phone: string): Promise<string> {
    const templateParam: any = {};
    templateParam[config.sms.aliyun.codeVarPlaceHolder] = code;
    const params = {
      SignName: config.sms.aliyun.signName,
      TemplateCode: config.sms.aliyun.templateCode,
      PhoneNumbers: phone,
      TemplateParam: JSON.stringify(templateParam),
    };
    const response: any = await this.clientAli.request('SendSms', params, { method: 'POST' });
    this.logger.debug(response);
    if (response.Code === 'OK') {
      return response.RequestId;
    }
    throw new CustomException(ResponseCodeEnum.SMS_SENT_FAILED);
  }

  async sendTencentSms(code: string, phone: string): Promise<string> {
    const params: SendSmsRequest = {
      SmsSdkAppid: config.sms.tencent.smsSdkAppid,
      Sign: config.sms.tencent.sign,
      TemplateID: config.sms.tencent.templateID,
      PhoneNumberSet: [phone],
      TemplateParamSet: [code],
    };
    const response = await this.clientTencent.SendSms(params);
    this.logger.debug(response);
    if (response.SendStatusSet && response.SendStatusSet[0].Code !== 'Ok') {
      throw new CustomException(ResponseCodeEnum.SMS_SENT_FAILED);
    }
    return response.RequestId ?? '';
  }
}
