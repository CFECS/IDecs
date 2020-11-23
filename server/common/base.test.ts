import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { SuperAgentTest } from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../module/app.module';
import { Utils } from '../util/utils';
import { ReqLoginBodyDto } from '../dto/user/req.login.body.dto';
import { LoginTypeEnum } from '../enum/login.type.enum';
import { ResponseCodeEnum } from '../enum/response.code.enum';
import { ReqSignupBodyDto } from '../dto/user/req.signup.body.dto';
import { config } from '../../config';

export class BaseTest {
  public static readonly password = 'IDecs@2020';

  static async init(): Promise<{ app: INestApplication; agent: SuperAgentTest }> {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    const app = module.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ transform: true }));
    await app.init();
    const agent = request.agent(app.getHttpServer());
    agent.timeout(3000);
    return { app, agent };
  }

  static setHeaders(agent: SuperAgentTest, baseUrl: string): SuperAgentTest {
    const now = Date.now();
    agent.set('timestamp', now.toString());
    agent.set('api-key', Utils.generateApiKey(now, baseUrl));
    return agent;
  }

  static doLoginByPassword(agent: SuperAgentTest, email: string, password: string): Promise<string> {
    const loginData: ReqLoginBodyDto = {
      identity: email,
      password,
      type: LoginTypeEnum.PASSWORD,
    };
    let url = '/api/user/login';
    return this.setHeaders(agent, url)
      .post(url)
      .send(loginData)
      .expect(201)
      .then((res) => {
        url = '/api/user/ticket/validate';
        return this.setHeaders(agent, url)
          .get(url)
          .query({ ticket: res.body.data.ticket })
          .expect(200)
          .then((res) => {
            expect(res.body.head.code).toEqual(ResponseCodeEnum.OK);
            return res;
          })
          .then((res) => res.body.data.token);
      });
  }

  static async doSignupAndLogin(agent: SuperAgentTest): Promise<{ email: string }> {
    const email = `${Date.now()}.test@idecs.com`;
    const signupData: ReqSignupBodyDto = {
      email,
      code: config.api.otp.code,
      password: this.password,
      confirmPassword: this.password,
      profile: { username: 'IDecs_tester' },
    };
    const url = '/api/user/signup';
    const token = await this.setHeaders(agent, url)
      .post(url)
      .send(signupData)
      .expect(201)
      .then(() => {
        return this.doLoginByPassword(agent, email, this.password);
      });
    agent.set('Authorization', token);
    return { email };
  }
}
