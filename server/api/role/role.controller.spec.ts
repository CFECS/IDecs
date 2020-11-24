import { INestApplication } from '@nestjs/common';
import { SuperAgentTest } from 'supertest';
import { BaseTest } from '../../common/base.test';

let app: INestApplication;
let agent: SuperAgentTest;

beforeAll(async () => {
  ({ app, agent } = await BaseTest.init());
  await BaseTest.doSignupAndLogin(agent);
});

afterAll(async () => {
  await app.close();
});

describe('RoleController', () => {
  it('should be defined', () => {
    expect(app).toBeDefined();
  });
});
