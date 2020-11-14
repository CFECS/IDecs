import * as scrypt from 'scrypt-async';

export default (_: any, inject: any) => {
  inject('generateApiKey', function (password: any, salt: any): Promise<any> {
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
  });
};
