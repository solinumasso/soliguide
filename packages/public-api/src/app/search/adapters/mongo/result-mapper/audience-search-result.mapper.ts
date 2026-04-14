import { type SearchAudience } from '../../../search.types';
import { type MongoPublics } from '../place.mongo';
import {
  AUDIENCE_OTHER_STATUS_MAP,
  firstMatchingValue,
} from './result-mapper.shared';

export class AudienceSearchResultMapper {
  map(publics?: MongoPublics): SearchAudience {
    const accueil = publics?.accueil ?? 0;
    const administrativeStatuses = firstMatchingValue(
      publics?.administrative,
      ['regular', 'asylum', 'refugee', 'undocumented'],
      'regular',
    );
    const familyStatuses = firstMatchingValue(
      publics?.familialle,
      ['isolated', 'family', 'couple', 'pregnant'],
      'isolated',
    );
    const otherStatuses = firstMatchingValue(
      (publics?.other ?? []).map((value) => AUDIENCE_OTHER_STATUS_MAP[value]),
      [
        'violence',
        'addiction',
        'disability',
        'lgbt+',
        'hiv',
        'prostitution',
        'prison',
        'student',
      ],
      'violence',
    );
    const genders = firstMatchingValue(
      publics?.gender,
      ['men', 'women'],
      'men',
    );

    return {
      admissionPolicy: accueil === 0 ? 'open' : 'restricted',
      isTargeted: accueil !== 0,
      description: publics?.description ?? '',
      ageRange:
        publics?.age?.min !== undefined || publics?.age?.max !== undefined
          ? {
              min: publics?.age?.min ?? 0,
              max: publics?.age?.max ?? 99,
            }
          : null,
      administrativeStatuses,
      familyStatuses,
      otherStatuses,
      genders,
      specialSupportContexts: [],
    };
  }
}
