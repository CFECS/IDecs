import { Request } from 'express';
import { JwtPayload } from '../util/jwt.util';

export interface RequestAo extends Request {
  payload: JwtPayload;
}
