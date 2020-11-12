import { scryptSync } from 'crypto';
import { config } from '../config';

export class Utils {
  static generateApiKey(timestamp: number, baseUrl: string): string {
    return scryptSync(`${timestamp}:${baseUrl}`, config.api.secret, 64).toString('hex');
  }

  static toBase64(data: string): string {
    return Buffer.from(data).toString('base64');
  }

  static decodeBase64(base64String: string): string {
    return Buffer.from(base64String, 'base64').toString();
  }
}
