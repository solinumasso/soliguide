import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { SearchModule } from '../src/app/search.module';

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [SearchModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/search (POST)', () => {
    return request(app.getHttpServer())
      .post('/search')
      .send({
        locationMode: 'country',
        country: 'FR',
      })
      .expect(200)
      .expect((response) => {
        expect(response.body).toHaveProperty('_links');
      });
  });
});
