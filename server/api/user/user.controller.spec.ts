import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { SuperAgentTest } from 'supertest';
import * as cookieParser from 'cookie-parser';
import { AppModule } from '../../app.module';
import { ReqSignupBodyDto } from '../../../common/dto/user/req.signup.body.dto';
import { ReqLoginBodyDto } from '../../../common/dto/user/req.login.body.dto';
import { LoginTypeEnum } from '../../../common/enum/login.type.enum';
import { Utils } from '../../../common/utils';
import { ResponseCodeEnum } from '../../../common/enum/response.code.enum';
import { UserModule } from './user.module';

let app: INestApplication;
let agent: SuperAgentTest;

beforeAll(async () => {
  const module: TestingModule = await Test.createTestingModule({
    imports: [UserModule, AppModule],
  }).compile();
  app = module.createNestApplication();
  app.use(cookieParser());
  await app.init();
  agent = request.agent(app.getHttpServer());
  agent.timeout(3000);
});

afterAll(async () => {
  await app.close();
});

function setHeaders(agent: SuperAgentTest, baseUrl: string): void {
  const now = Date.now();
  agent.set('timestamp', now.toString());
  agent.set('api-key', Utils.generateApiKey(now, baseUrl));
}

function doSignupAndLogin(): Promise<string> {
  const email = `${Date.now()}.test@idecs.com`;
  const password = 'IDecs@2020';
  const signupData: ReqSignupBodyDto = {
    email,
    password,
    confirmPassword: password,
    profile: { username: 'IDecs_tester' },
  };
  let url = '/api/user/signup';
  setHeaders(agent, url);
  return agent
    .post(url)
    .send(signupData)
    .expect(201)
    .then(() => {
      const loginData: ReqLoginBodyDto = {
        identity: email,
        password,
        type: LoginTypeEnum.PASSWORD,
      };
      url = '/api/user/login';
      setHeaders(agent, url);
      return agent
        .post(url)
        .send(loginData)
        .expect(201)
        .then((res) => {
          url = '/api/user/ticket/validate';
          setHeaders(agent, url);
          return agent
            .get(url)
            .query({ ticket: res.body.data.ticket })
            .expect(200)
            .then((res) => {
              expect(res.body.head.code).toEqual(ResponseCodeEnum.OK);
              return res;
            })
            .then((res) => res.body.data.token);
        });
    });
}

describe('Signup and login', () => {
  it('should create user by email successful', () => {
    const data: ReqSignupBodyDto = {
      email: `${Date.now()}.test@idecs.com`,
      password: 'IDecs@2020',
      confirmPassword: 'IDecs@2020',
      profile: { username: 'IDecs_tester' },
    };
    const url = '/api/user/signup';
    setHeaders(agent, url);
    return agent
      .post(url)
      .send(data)
      .expect(201)
      .then((res) => expect(res.body.head.code).toEqual(ResponseCodeEnum.OK));
  });

  it('should create user by phone successful', () => {
    const data: ReqSignupBodyDto = {
      phone: `+861${Date.now().toString().slice(4, 13)}`,
      password: 'IDecs@2020',
      confirmPassword: 'IDecs@2020',
      profile: { username: 'IDecs_tester' },
    };
    const url = '/api/user/signup';
    setHeaders(agent, url);
    return agent
      .post(url)
      .send(data)
      .expect(201)
      .then((res) => expect(res.body.head.code).toEqual(ResponseCodeEnum.OK));
  });

  it('should create user by email and login successful', () => {
    return doSignupAndLogin();
  });
});

describe('UserController', () => {
  beforeAll(async () => {
    const token = await doSignupAndLogin();
    agent.set('Cookie', [`token=${token}`]);
  });

  it('should get self successful', () => {
    const url = '/api/user';
    setHeaders(agent, url);
    return agent
      .get(url)
      .expect(200)
      .then((res) => expect(res.body.head.code).toEqual(ResponseCodeEnum.OK));
  });

  it('should get user by id successful', () => {
    const url = '/api/user/12';
    setHeaders(agent, url);
    return agent
      .get(url)
      .expect(200)
      .then((res) => expect(res.body.head.code).toEqual(ResponseCodeEnum.OK));
  });

  it('should delete user by id successful', () => {
    const url = '/api/user/12';
    setHeaders(agent, url);
    return agent
      .delete(url)
      .expect(200)
      .then((res) => expect(res.body.head.code).toEqual(ResponseCodeEnum.OK));
  });
});
