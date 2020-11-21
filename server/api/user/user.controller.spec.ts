import { INestApplication } from '@nestjs/common';
import { SuperAgentTest } from 'supertest';
import { ReqSignupBodyDto } from '../../dto/user/req.signup.body.dto';
import { ResponseCodeEnum } from '../../enum/response.code.enum';
import { ReqPasswordChangeBodyDto } from '../../dto/user/req.password.change.body.dto';
import { ReqProfileUpdateBodyDto } from '../../dto/user/req.profile.update.body.dto';
import { config } from '../../../config';
import { BaseTest } from '../../common/base.test';

let app: INestApplication;
let agent: SuperAgentTest;

beforeAll(async () => {
  ({ app, agent } = await BaseTest.init());
});

afterAll(async () => {
  await app.close();
});

describe('Signup and login', () => {
  it('should create user by email successful', () => {
    const data: ReqSignupBodyDto = {
      email: `${Date.now()}.test@idecs.com`,
      code: config.api.otp.code,
      password: BaseTest.password,
      confirmPassword: BaseTest.password,
      profile: { username: 'IDecs_tester' },
    };
    const url = '/api/user/signup';
    return BaseTest.setHeaders(agent, url)
      .post(url)
      .send(data)
      .expect(201)
      .then((res) => expect(res.body.head.code).toEqual(ResponseCodeEnum.OK));
  });

  it('should create user by phone successful', () => {
    const data: ReqSignupBodyDto = {
      phone: `+861${Date.now().toString().slice(3, 13)}`,
      code: config.api.otp.code,
      password: BaseTest.password,
      confirmPassword: BaseTest.password,
      profile: { username: 'IDecs_tester' },
    };
    const url = '/api/user/signup';
    return BaseTest.setHeaders(agent, url)
      .post(url)
      .send(data)
      .expect(201)
      .then((res) => expect(res.body.head.code).toEqual(ResponseCodeEnum.OK));
  });

  it('should create user by email and login successful', () => {
    return BaseTest.doSignupAndLogin(agent);
  });
});

describe('UserController', () => {
  let email: string;
  beforeAll(async () => {
    const data = await BaseTest.doSignupAndLogin(agent);
    email = data.email;
    agent.set('Cookie', [`token=${data.token}`]);
  });

  it('should get self successful', () => {
    const url = '/api/user';
    return BaseTest.setHeaders(agent, url)
      .get(url)
      .expect(200)
      .then((res) => expect(res.body.head.code).toEqual(ResponseCodeEnum.OK));
  });

  it('should get user by id successful', () => {
    const url = '/api/user/10';
    return BaseTest.setHeaders(agent, url)
      .get(url)
      .expect(200)
      .then((res) => expect(res.body.head.code).toEqual(ResponseCodeEnum.OK));
  });

  it('should delete user by id successful', () => {
    const url = '/api/user/12';
    return BaseTest.setHeaders(agent, url)
      .delete(url)
      .expect(200)
      .then((res) => expect(res.body.head.code).toEqual(ResponseCodeEnum.OK));
  });

  it('should get user pagination successful', () => {
    const url = '/api/user/pagination';
    return BaseTest.setHeaders(agent, url)
      .get(url)
      .expect(200)
      .then((res) => expect(res.body.head.code).toEqual(ResponseCodeEnum.OK));
  });

  it('should update password successful', () => {
    const url = '/api/user/password/change';
    const newPassword = 'IDecs!2020';
    const updatePasswordData: ReqPasswordChangeBodyDto = {
      oldPassword: BaseTest.password,
      newPassword,
      confirmPassword: newPassword,
    };
    return BaseTest.setHeaders(agent, url)
      .put(url)
      .send(updatePasswordData)
      .expect(200)
      .then(() => {
        return BaseTest.doLoginByPassword(agent, email, newPassword);
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
    return BaseTest.setHeaders(agent, url)
      .put(url)
      .send(data)
      .expect(200)
      .then((res) => expect(res.body.head.code).toEqual(ResponseCodeEnum.OK));
  });
});
