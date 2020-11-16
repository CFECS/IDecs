import { charset, generate } from 'voucher-code-generator';

export class CodeGenerateHelper {
  static generateCode(length: number): string {
    return generate({ length })[0];
  }

  static generateNumberCode(length: number): string {
    return generate({ length, charset: charset('numbers') })[0];
  }
}
