import { HttpStatus, INestApplication } from '@nestjs/common';
import { SuperAgentTest } from 'supertest';
import { BaseTest } from '../../common/base.test';
import { ReqAddOrUpdateBodyDto } from '../../dto/nav/req.add.or.update.body.dto';
import { ResponseCodeEnum } from '../../enum/response.code.enum';

let app: INestApplication;
let agent: SuperAgentTest;

beforeAll(async () => {
  ({ app, agent } = await BaseTest.init());
  await BaseTest.doSignupAndLogin(agent);
});

afterAll(async () => {
  await app.close();
});

describe('NavController', () => {
  it('should create nav successful', () => {
    const data: ReqAddOrUpdateBodyDto = {
      name: 'test nav',
      description: 'for test',
      parentId: 'b6252599-6bfd-4852-862c-3efa039a3014',
      page: '',
    };
    const url = '/api/nav';
    return BaseTest.setHeaders(agent, url)
      .post(url)
      .send(data)
      .expect(HttpStatus.CREATED)
      .then((res) => expect(res.body.head.code).toEqual(ResponseCodeEnum.OK));
  });

  it('should update nav successful', () => {
    const data: ReqAddOrUpdateBodyDto = {
      name: 'test nav',
      description: 'for test updated',
      parentId: 'b6252599-6bfd-4852-862c-3efa039a3014',
      page: '',
    };
    const url = '/api/nav/0d5ec8fa-486b-4085-8ff6-97acabd389ff';
    return BaseTest.setHeaders(agent, url)
      .put(url)
      .send(data)
      .expect(HttpStatus.OK)
      .then((res) => expect(res.body.head.code).toEqual(ResponseCodeEnum.OK));
  });

  it('should get nav by id successful', () => {
    const url = '/api/nav/0d5ec8fa-486b-4085-8ff6-97acabd389ff';
    return BaseTest.setHeaders(agent, url)
      .get(url)
      .expect(HttpStatus.OK)
      .then((res) => expect(res.body.head.code).toEqual(ResponseCodeEnum.OK));
  });

  it('should get nav paged successful', () => {
    const url = '/api/nav';
    return BaseTest.setHeaders(agent, url)
      .get(url)
      .expect(HttpStatus.OK)
      .then((res) => expect(res.body.head.code).toEqual(ResponseCodeEnum.OK));
  });

  it('should delete nav successful', () => {
    const url = '/api/nav/0d5ec8fa-486b-4085-8ff6-97acabd389ff';
    return BaseTest.setHeaders(agent, url)
      .delete(url)
      .expect(HttpStatus.OK)
      .then((res) => expect(res.body.head.code).toEqual(ResponseCodeEnum.OK));
  });
});
