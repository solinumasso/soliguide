import { type SearchContact } from '../../../search.types';
import { type MongoPlaceDocument } from '../place.mongo';

export class ContactSearchResultMapper {
  map(entity: MongoPlaceDocument['entity']): SearchContact[] {
    const contacts: SearchContact[] = [];

    if (!entity) {
      return contacts;
    }

    if (entity.mail) {
      contacts.push({
        type: 'email',
        label: 'Email',
        value: entity.mail,
      });
    }

    if (Array.isArray(entity.phones)) {
      for (const phone of entity.phones) {
        if (!phone?.phoneNumber) {
          continue;
        }

        contacts.push({
          type: 'phone',
          label: phone.label ?? 'Phone',
          value: phone.phoneNumber,
        });
      }
    }

    if (entity.fax) {
      contacts.push({
        type: 'fax',
        label: 'Fax',
        value: entity.fax,
      });
    }

    if (entity.website) {
      contacts.push({
        type: 'website',
        label: 'Website',
        value: entity.website,
      });
    }

    if (entity.facebook) {
      contacts.push({
        type: 'social',
        platform: 'facebook',
        label: 'Facebook',
        value: entity.facebook,
      });
    }

    if (entity.instagram) {
      contacts.push({
        type: 'social',
        platform: 'instagram',
        label: 'Instagram',
        value: entity.instagram,
      });
    }

    return contacts;
  }
}
