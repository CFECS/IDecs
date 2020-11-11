import { scryptSync } from 'crypto';

export class Utils {
  static generateApiKey(timestamp: number, secret: string, originalUrl: string): string {
    return scryptSync(`${timestamp}:${originalUrl}`, secret, 64).toString('hex');
  }
}
