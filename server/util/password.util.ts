import { randomBytes, scryptSync } from 'crypto';

export class PasswordTool {
  static generateSalt(): string {
    return randomBytes(16).toString('hex');
  }

  static encryptPwdWithSalt(password: string, salt: string): string {
    return scryptSync(password, salt, 32).toString('hex');
  }

  static generateStorePwd(password: string): string {
    const salt = this.generateSalt();
    return `${salt}:${this.encryptPwdWithSalt(password, salt)}`;
  }

  static verifyPwd(password: string, storePwd: string): boolean {
    const pwd = storePwd.split(':');
    const salt = pwd[0];
    return pwd[1] === this.encryptPwdWithSalt(password, salt);
  }
}
