import { decode, sign, SignOptions, verify } from 'jsonwebtoken';
import { Constants } from '../common/constants';

export class JwtTool {
  private static readonly jwtOption: SignOptions = { keyid: Constants.KEY_ID };

  static signToken(sub: string, expiresIn: string | number): string {
    return sign({ sub }, Constants.JWT_SECRET, { expiresIn, ...this.jwtOption });
  }

  static decodeToken(token: string): any {
    return decode(token, { complete: true });
  }

  static verifyToken(token: string): void {
    verify(token, Constants.JWT_SECRET, this.jwtOption);
  }
}
