import {
  Injectable,
  InternalServerErrorException,
  OnModuleInit,
  OnModuleDestroy,
} from '@nestjs/common';
import { MongoClient, type Document } from 'mongodb';

const DEFAULT_DATABASE_NAME = 'staging';
const DEFAULT_PLACES_COLLECTION_NAME = 'lieux';

@Injectable()
export class PlacesDatabaseService implements OnModuleInit, OnModuleDestroy {
  private client: MongoClient | undefined;

  async onModuleInit(): Promise<void> {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      throw new InternalServerErrorException(
        'Missing required environment variable MONGODB_URI',
      );
    }
    this.client = new MongoClient(mongoUri);
    await this.client.connect();
  }

  async aggregatePlaces<TDocument extends Document = Document>(
    pipeline: Document[],
  ): Promise<TDocument[]> {
    if (!this.client) {
      throw new Error('No mongo client');
    }

    try {
      const database = this.client.db(
        process.env.MONGODB_DB_NAME ?? DEFAULT_DATABASE_NAME,
      );
      const collectionName =
        process.env.MONGODB_PLACES_COLLECTION ?? DEFAULT_PLACES_COLLECTION_NAME;

      return database
        .collection<TDocument>(collectionName)
        .aggregate<TDocument>(pipeline)
        .toArray();
    } catch (error) {
      throw new InternalServerErrorException(
        `Unable to aggregate places from MongoDB collection "${process.env.MONGODB_PLACES_COLLECTION ?? DEFAULT_PLACES_COLLECTION_NAME}": ${(error as Error).message}`,
      );
    }
  }

  async onModuleDestroy(): Promise<void> {
    if (this.client) {
      await this.client.close();
      this.client = undefined;
    }
  }
}
