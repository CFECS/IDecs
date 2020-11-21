import { sign, SignOptions, verify } from 'jsonwebtoken';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { Constants } from '../common/constants';
import { TokenTypeEnum } from '../enum/token.type.enum';
import { CustomException } from '../exception/custom.exception';
import { ResponseCodeEnum } from '../enum/response.code.enum';
import { Session, SessionDocument } from '../model/mongo/session.model';
import { config } from '../../config';
import { UserModel } from '../model/rds/user.model';
import { Utils } from './utils';

interface TicketPayload {
  sub: string;
  type: TokenTypeEnum;
}

interface TokenPayload extends TicketPayload {
  sessionId: string;
}

export interface JwtPayload extends TokenPayload {
  profile: UserModel;
}

@Injectable()
export class JwtUtil {
  private static readonly jwtOption: SignOptions = { keyid: Constants.KEY_ID };

  constructor(
    @InjectModel(Session.name)
    private readonly sessionModel: Model<SessionDocument>,
  ) {}

  static signToken(payload: TicketPayload | TokenPayload, expiresIn: string | number): string {
    return sign(payload, Constants.JWT_SECRET, { expiresIn, ...this.jwtOption });
  }

  static signTicket(payload: TicketPayload): string {
    return this.signToken(payload, '5m');
  }

  static signAccessToken(payload: TokenPayload): string {
    return this.signToken(payload, config.expire.session);
  }

  async verifyToken(token: string, type: TokenTypeEnum): Promise<JwtPayload> {
    let decodeData;
    try {
      decodeData = verify(token, Constants.JWT_SECRET, { complete: true, ...JwtUtil.jwtOption });
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        throw new CustomException(ResponseCodeEnum.TOKEN_EXPIRED);
      }
      throw new CustomException(ResponseCodeEnum.INVALID_TOKEN);
    }
    const jwtPayload = (decodeData as any).payload as JwtPayload;
    if (jwtPayload?.type !== type) {
      throw new CustomException(ResponseCodeEnum.UNKNOWN_TOKEN_TYPE);
    }
    if (jwtPayload?.type === TokenTypeEnum.ACCESS_TOKEN) {
      const session = await this.sessionModel.findOne({ sessionId: jwtPayload.sessionId });
      if (session?.token !== token || Utils.decodeBase64(jwtPayload.sub) !== session?.profile.id.toString()) {
        throw new CustomException(ResponseCodeEnum.INVALID_TOKEN);
      }
      jwtPayload.profile = session.profile as UserModel;
    }
    return jwtPayload;
  }
}
