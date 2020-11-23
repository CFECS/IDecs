import { Plugin } from '@nuxt/types';
import * as scrypt from 'scrypt-async';
import { DialCodeDto } from '../types/dto/common';

declare module 'vue/types/vue' {
  interface Vue {
    $generateApiKey(password: any, salt: any): Promise<any>;
    $countryDialCodes(): DialCodeDto[];
    $checkPhone(rule: any, value: string, callback: any): void;
    $checkPassword(rule: any, value: string, callback: any): void;
    $generateTitle(title: string): string;
    $navigateTo(path: string, external: boolean): void;
  }
}

const Tools: Plugin = ({ env, app }: any, inject) => {
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

  inject('countryDialCodes', (): DialCodeDto[] => [
    { label: '+86', value: '+86' },
    { label: '+852', value: '+852' },
    { label: '+853', value: '+853' },
    { label: '+886', value: '+886' },
    { label: '+1', value: '+1' },
    { label: '+65', value: '+65' },
    { label: '+62', value: '+62' },
    { label: '+63', value: '+63' },
    { label: '+81', value: '+81' },
    { label: '+82', value: '+82' },
  ]);

  inject('checkPhone', (_: any, value: string, callback: any): void => {
    if (!value) {
      callback(new Error(app.i18n.t('COMMON.VALIDATE.REQUIRED') as string));
    } else if (!/^\d+$/.test(value)) {
      callback(new Error(app.i18n.t('COMMON.VALIDATE.PHONE_FORMAT') as string));
    } else {
      callback();
    }
  });

  inject('checkPassword', (_: any, value: string, callback: any): void => {
    if (!value) {
      callback(new Error(app.i18n.t('COMMON.VALIDATE.PASSWORD_REQUIRED') as string));
    } else if (!env.passwordReg.test(value)) {
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
