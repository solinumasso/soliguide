import {
  Injectable,
  InternalServerErrorException,
  OnModuleDestroy,
} from '@nestjs/common';
import { MongoClient, type Document } from 'mongodb';

const DEFAULT_DATABASE_NAME = 'staging';
const DEFAULT_PLACES_COLLECTION_NAME = 'lieux';
const DEFAULT_LIMIT = 100;

@Injectable()
export class PlacesDatabaseService implements OnModuleDestroy {
  private mongoClient: MongoClient | null = null;
  private mongoClientPromise: Promise<MongoClient> | null = null;

  private async getClient(): Promise<MongoClient> {
    if (this.mongoClient) {
      return this.mongoClient;
    }

    if (!this.mongoClientPromise) {
      const mongoUri = process.env.MONGODB_URI;
      if (!mongoUri) {
        throw new InternalServerErrorException(
          'Missing required environment variable MONGODB_URI',
        );
      }
      const client = new MongoClient(mongoUri);
      this.mongoClientPromise = client.connect().then((connectedClient) => {
        this.mongoClient = connectedClient;
        return connectedClient;
      });
    }

    return this.mongoClientPromise;
  }

  async getFirstPlaces(limit: number = DEFAULT_LIMIT): Promise<Document[]> {
    try {
      const client = await this.getClient();
      const database = client.db(
        process.env.MONGODB_DB_NAME ?? DEFAULT_DATABASE_NAME,
      );
      const collectionName =
        process.env.MONGODB_PLACES_COLLECTION ?? DEFAULT_PLACES_COLLECTION_NAME;

      return database
        .collection<Document>(collectionName)
        .find()
        .limit(limit)
        .toArray();
    } catch (error) {
      throw new InternalServerErrorException(
        `Unable to fetch places from MongoDB collection "${process.env.MONGODB_PLACES_COLLECTION ?? DEFAULT_PLACES_COLLECTION_NAME}": ${(error as Error).message}`,
      );
    }
  }

  async aggregatePlaces<TDocument extends Document = Document>(
    pipeline: Document[],
  ): Promise<TDocument[]> {
    try {
      const client = await this.getClient();
      const database = client.db(
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
    if (this.mongoClient) {
      await this.mongoClient.close();
      this.mongoClient = null;
    }
  }
}
