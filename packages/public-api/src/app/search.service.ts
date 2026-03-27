/* eslint-disable @typescript-eslint/require-await */
import { Injectable } from '@nestjs/common';

@Injectable()
export class SearchService {
  async search(): Promise<any> {
    throw new Error('not implemented');
  }
}
