import { HttpStatus, INestApplication } from '@nestjs/common';
import { SuperAgentTest } from 'supertest';
import { BaseTest } from '../../common/base.test';
import { ResponseCodeEnum } from '../../enum/response.code.enum';
import { ReqAddOrUpdateBodyDto } from '../../dto/project/req.add.or.update.body.dto';

let app: INestApplication;
let agent: SuperAgentTest;

beforeAll(async () => {
  ({ app, agent } = await BaseTest.init());
  await BaseTest.doSignupAndLogin(agent);
});

afterAll(async () => {
  await app.close();
});

describe('ProjectController', () => {
  it('should create project successful', () => {
    const data: ReqAddOrUpdateBodyDto = {
      name: 'test project',
      description: 'for test',
    };
    const url = '/api/project';
    return BaseTest.setHeaders(agent, url)
      .post(url)
      .send(data)
      .expect(HttpStatus.CREATED)
      .then((res) => expect(res.body.head.code).toEqual(ResponseCodeEnum.OK));
  });

  it('should update project successful', () => {
    const data: ReqAddOrUpdateBodyDto = {
      name: 'test project',
      description: 'for test updated',
    };
    const url = '/api/project/1';
    return BaseTest.setHeaders(agent, url)
      .put(url)
      .send(data)
      .expect(HttpStatus.OK)
      .then((res) => expect(res.body.head.code).toEqual(ResponseCodeEnum.OK));
  });

  it('should get project by id successful', () => {
    const url = '/api/project/1';
    return BaseTest.setHeaders(agent, url)
      .get(url)
      .expect(HttpStatus.OK)
      .then((res) => expect(res.body.head.code).toEqual(ResponseCodeEnum.OK));
  });

  it('should get project paged successful', () => {
    const url = '/api/project';
    return BaseTest.setHeaders(agent, url)
      .get(url)
      .expect(HttpStatus.OK)
      .then((res) => expect(res.body.head.code).toEqual(ResponseCodeEnum.OK));
  });

  it('should delete project successful', () => {
    const url = '/api/project/1';
    return BaseTest.setHeaders(agent, url)
      .delete(url)
      .expect(HttpStatus.OK)
      .then((res) => expect(res.body.head.code).toEqual(ResponseCodeEnum.OK));
  });
});
