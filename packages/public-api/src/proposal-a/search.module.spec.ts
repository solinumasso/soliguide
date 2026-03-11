import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { SearchModule } from './search.module';

describe('SearchModule', () => {
  let app: INestApplication | undefined;

  afterEach(async () => {
    if (app) {
      await app.close();
      app = undefined;
    }
  });

  it('starts when all downgrade mappers are registered', async () => {
    const testingModule = await Test.createTestingModule({
      imports: [SearchModule],
    }).compile();

    app = testingModule.createNestApplication();

    await expect(app.init()).resolves.toBe(app);
  });
});
