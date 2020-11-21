import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { SuperAgentTest } from 'supertest';
import * as cookieParser from 'cookie-parser';
import { AppModule } from '../../app.module';
import { ReqSignupBodyDto } from '../../dto/user/req.signup.body.dto';
import { ReqLoginBodyDto } from '../../dto/user/req.login.body.dto';
import { LoginTypeEnum } from '../../enum/login.type.enum';
import { Utils } from '../../util/utils';
import { ResponseCodeEnum } from '../../enum/response.code.enum';
import { ReqPasswordChangeBodyDto } from '../../dto/user/req.password.change.body.dto';
import { ReqProfileUpdateBodyDto } from '../../dto/user/req.profile.update.body.dto';
import { config } from '../../../config';

let app: INestApplication;
let agent: SuperAgentTest;
const password = 'IDecs@2020';

beforeAll(async () => {
  const module: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();
  app = module.createNestApplication();
  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  await app.init();
  agent = request.agent(app.getHttpServer());
  agent.timeout(3000);
});

afterAll(async () => {
  await app.close();
});

function setHeaders(agent: SuperAgentTest, baseUrl: string): SuperAgentTest {
  const now = Date.now();
  agent.set('timestamp', now.toString());
  agent.set('api-key', Utils.generateApiKey(now, baseUrl));
  return agent;
}

function doLoginByPassword(email: string, password: string): Promise<string> {
  const loginData: ReqLoginBodyDto = {
    identity: email,
    password,
    type: LoginTypeEnum.PASSWORD,
  };
  let url = '/api/user/login';
  return setHeaders(agent, url)
    .post(url)
    .send(loginData)
    .expect(201)
    .then((res) => {
      url = '/api/user/ticket/validate';
      return setHeaders(agent, url)
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

async function doSignupAndLogin(): Promise<{ email: string; token: string }> {
  const email = `${Date.now()}.test@idecs.com`;
  const signupData: ReqSignupBodyDto = {
    email,
    code: config.api.otp.code,
    password,
    confirmPassword: password,
    profile: { username: 'IDecs_tester' },
  };
  const url = '/api/user/signup';
  const token = await setHeaders(agent, url)
    .post(url)
    .send(signupData)
    .expect(201)
    .then(() => {
      return doLoginByPassword(email, password);
    });
  return { email, token };
}

describe('Signup and login', () => {
  it('should create user by email successful', () => {
    const data: ReqSignupBodyDto = {
      email: `${Date.now()}.test@idecs.com`,
      code: config.api.otp.code,
      password,
      confirmPassword: password,
      profile: { username: 'IDecs_tester' },
    };
    const url = '/api/user/signup';
    return setHeaders(agent, url)
      .post(url)
      .send(data)
      .expect(201)
      .then((res) => expect(res.body.head.code).toEqual(ResponseCodeEnum.OK));
  });

  it('should create user by phone successful', () => {
    const data: ReqSignupBodyDto = {
      phone: `+861${Date.now().toString().slice(4, 13)}`,
      code: config.api.otp.code,
      password,
      confirmPassword: password,
      profile: { username: 'IDecs_tester' },
    };
    const url = '/api/user/signup';
    return setHeaders(agent, url)
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
  let email: string;
  beforeAll(async () => {
    const data = await doSignupAndLogin();
    email = data.email;
    agent.set('Cookie', [`token=${data.token}`]);
  });

  it('should get self successful', () => {
    const url = '/api/user';
    return setHeaders(agent, url)
      .get(url)
      .expect(200)
      .then((res) => expect(res.body.head.code).toEqual(ResponseCodeEnum.OK));
  });

  it('should get user by id successful', () => {
    const url = '/api/user/10';
    return setHeaders(agent, url)
      .get(url)
      .expect(200)
      .then((res) => expect(res.body.head.code).toEqual(ResponseCodeEnum.OK));
  });

  it('should delete user by id successful', () => {
    const url = '/api/user/12';
    return setHeaders(agent, url)
      .delete(url)
      .expect(200)
      .then((res) => expect(res.body.head.code).toEqual(ResponseCodeEnum.OK));
  });

  it('should get user pagination successful', () => {
    const url = '/api/user/pagination';
    return setHeaders(agent, url)
      .get(url)
      .expect(200)
      .then((res) => expect(res.body.head.code).toEqual(ResponseCodeEnum.OK));
  });

  it('should update password successful', () => {
    const url = '/api/user/password/change';
    const newPassword = 'IDecs!2020';
    const updatePasswordData: ReqPasswordChangeBodyDto = {
      oldPassword: password,
      newPassword,
      confirmPassword: newPassword,
    };
    return setHeaders(agent, url)
      .put(url)
      .send(updatePasswordData)
      .expect(200)
      .then(() => {
        return doLoginByPassword(email, newPassword);
      });
  });

  it('should update profile successful', () => {
    const url = '/api/user/profile';
    const data: ReqProfileUpdateBodyDto = {
      username: 'haha',
      profile: {
        test: 'prefect',
      },
    };
    return setHeaders(agent, url)
      .put(url)
      .send(data)
      .expect(200)
      .then((res) => expect(res.body.head.code).toEqual(ResponseCodeEnum.OK));
  });
});
