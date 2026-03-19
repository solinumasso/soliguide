/* eslint-disable @typescript-eslint/require-await */
import { Injectable } from '@nestjs/common';
import { v20260309ResponseSchemaType } from './generated/contracts/2026-03-09.response.schema';

type Place20260309 = v20260309ResponseSchemaType['results'][number];

@Injectable()
export class SearchService {
  async search(): Promise<v20260309ResponseSchemaType> {
    const results: Place20260309[] = [
      {
        id: '43510',
        seoUrl: 'croix-rouge-francaise-antenne-locale-de-saint-benoit-43510',
        name: {
          originalName:
            'Croix-Rouge française - Antenne Locale de Saint Benoit',
          translatedName: 'French Red Cross - Saint Benoit Local Branch',
        },
        description:
          "<p>L'Antenne Locale est chargée de mettre en oeuvre les actions de proximite de la Croix-Rouge francaise.</p>",
        type: 'place',
        isOpenToday: true,
        languages: ['fr', 'rcf'],
      },
      {
        id: '58222',
        seoUrl: 'maraude-mobile-saint-denis-58222',
        name: {
          originalName: 'Maraude mobile Saint-Denis',
          translatedName: 'Saint-Denis Mobile Outreach',
        },
        description:
          '<p>Distribution alimentaire et orientation sociale sur differents points de passage.</p>',
        type: 'itinerary',
        isOpenToday: false,
        languages: ['fr', 'en'],
      },
    ];

    return {
      results,
      page: {
        current: 1,
        limit: 100,
        totalPages: 1,
        totalResults: results.length,
      },
      _links: {
        self: { href: '/search?page=1&limit=100' },
        next: { href: '/search?page=1&limit=100' },
        prev: { href: '/search?page=1&limit=100' },
      },
    };
  }
}
