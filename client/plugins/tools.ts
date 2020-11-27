import { Plugin } from '@nuxt/types';
import * as scrypt from 'scrypt-async';
import PhoneNumber from 'awesome-phonenumber';
import Hashids from 'hashids';
import * as dayjs from 'dayjs';
import * as customParseFormat from 'dayjs/plugin/customParseFormat';
import * as advancedFormat from 'dayjs/plugin/advancedFormat';
import * as localizedFormat from 'dayjs/plugin/localizedFormat';
import 'dayjs/locale/zh-cn';
import 'dayjs/locale/en';
import { Modal } from 'ant-design-vue';
import { DialCodeDto } from '../types/dto/common';

dayjs.extend(customParseFormat);
dayjs.extend(localizedFormat);
dayjs.extend(advancedFormat);

const hashids = new Hashids();

declare module 'vue/types/vue' {
  interface Vue {
    $generateApiKey(password: any, salt: any): Promise<any>;
    $countryDialCodes(): DialCodeDto[];
    $checkPhone(rule: any, value: string, callback: any): void;
    $checkPassword(rule: any, value: string, callback: any): void;
    $generateTitle(title: string): string;
    $navigateTo(path: string, external: boolean): void;
    $getPhoneNumber(phone: any): Record<string, string>;
    $isPhone(phone: any): boolean;
    $logout(): void;
    $encode(val: any): any;
    $decode(val: any): any;
    $showErrorTip(content: string): void;
    $parseDateWithLocale(string: string, format: string, locale: string): string | boolean;
    $getLocale(): string;
    $datetime(datetime: any): any;
    $date(datetime: any): any;
  }
}

const Tools: Plugin = ({ env, app }: any, inject) => {
  inject('parseDateWithLocale', (string: string, format: string, locale: string) => {
    const dt = dayjs(string, format);
    if (!string || !dt.isValid()) {
      return false;
    }
    const localeDt = dt.locale(locale);
    return localeDt;
  });

  inject('getLocale', () => app.i18n.getLocaleCookie());

  inject('datetime', (datetime: any) => {
    const locale = app.$getLocale();
    const localeDt = app.$parseDateWithLocale(datetime, 'YYYY-MM-DD HH:mm:ss', locale);
    if (!localeDt) {
      return datetime;
    }
    let outputFormat;
    if (!outputFormat) {
      switch (locale) {
        case 'zh-cn':
          outputFormat = 'LL HH:mm:ss';
          break;
        default:
          outputFormat = 'DD MMM YYYY HH:mm:ss';
          break;
      }
    }
    return localeDt.locale(locale).format(outputFormat);
  });

  inject('date', (date: any) => {
    const locale = app.$getLocale();
    const localeDt = app.$parseDateWithLocale(date, 'YYYY-MM-DD HH:mm:ss', locale);
    if (!localeDt) {
      return null;
    }
    let outputFormat;
    if (!outputFormat) {
      switch (locale) {
        case 'zh-cn':
          outputFormat = 'LL';
          break;
        default:
          outputFormat = 'DD MMM YYYY';
          break;
      }
    }
    return localeDt.locale(locale).format(outputFormat);
  });

  inject('showErrorTip', (content: string) => {
    Modal.error({
      title: app.i18n.t('COMMON.LAYOUTS.TIPS'),
      content,
      onOk: () => {
        app.router.back();
      },
    });
  });

  inject('encode', (val: any): any => hashids.encode(val));

  inject('decode', (val: any): any => hashids.decode(val)[0]);

  inject('logout', (): void => {
    window.sessionStorage.removeItem('IDecs_token');
    window.location.reload();
  });

  inject('getPhoneNumber', (phone: any) => {
    try {
      const pn = new PhoneNumber(phone);
      if (!app.$isPhone(phone)) {
        return {
          dialCode: '+86',
          phone,
        };
      }
      return {
        dialCode: '+' + pn.getCountryCode(),
        phone: pn.getNumber('significant'),
      };
    } catch (err) {
      return {
        dialCode: '+86',
        phone: '',
      };
    }
  });

  inject('isPhone', (phone: any) => {
    const pn = new PhoneNumber(phone);
    return pn.isValid();
  });

  inject('navigateTo', (path: string, external = false) => {
    if (external) {
      window.open(path);
    } else if (app.router.currentRoute.fullPath !== path) {
      app.router.push(path);
    }
  });

  inject(
    'generateApiKey',
    (password: any, salt: any): Promise<any> => {
      return new Promise((resolve) => {
        scrypt(
          password,
          salt,
          {
            N: 16384,
            r: 8,
            p: 1,
            dkLen: 64,
            encoding: 'hex',
          },
          (derivedKey: any) => {
            resolve(derivedKey);
          },
        );
      });
    },
  );

  inject('countryDialCodes', (): DialCodeDto[] =>
    Array.from(new Set(PhoneNumber.getSupportedCallingCodes())).map((n) => ({
      label: `+${n}`,
      value: `+${n}`,
    })),
  );

  inject('checkPhone', (_: any, value: any, callback: any): void => {
    if (!value) {
      callback(new Error(app.i18n.t('COMMON.VALIDATE.REQUIRED') as string));
    } else if (!app.$isPhone(value)) {
      callback(new Error(app.i18n.t('COMMON.VALIDATE.PHONE_FORMAT') as string));
    } else {
      callback();
    }
  });

  inject('checkPassword', (_: any, value: string, callback: any): void => {
    if (!value) {
      callback(new Error(app.i18n.t('COMMON.VALIDATE.PASSWORD_REQUIRED') as string));
    } else if (!new RegExp(env.passwordReg).test(value)) {
      callback(new Error(app.i18n.t('COMMON.VALIDATE.PASSWORD_FORMAT') as string));
    } else {
      callback();
    }
  });

  inject('generateTitle', (title: string): string => {
    return `${title}-${app.i18n.t('COMMON.PAGE_TITLE.DEFAULT') as string}`;
  });
};

export default Tools;
