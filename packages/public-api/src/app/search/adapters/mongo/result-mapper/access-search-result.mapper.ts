import { type SearchAccess } from '../../../search.types';
import { type MongoModalities } from '../place.mongo';

export class AccessSearchResultMapper {
  map(modalities?: MongoModalities): SearchAccess {
    return {
      isUnconditional: modalities?.inconditionnel ?? false,
      allowPets: modalities?.animal?.checked ?? false,
      isWheelchairAccessible: modalities?.pmr?.checked ?? false,
      appointmentRequirement: {
        isRequired: modalities?.appointment?.checked ?? false,
        details: modalities?.appointment?.precisions ?? null,
      },
      registrationRequirement: {
        isRequired: modalities?.inscription?.checked ?? false,
        details: modalities?.inscription?.precisions ?? null,
      },
      orientationRequirement: {
        isRequired: modalities?.orientation?.checked ?? false,
        details: modalities?.orientation?.precisions ?? null,
      },
      pricing: {
        isPaid: modalities?.price?.checked ?? false,
        details: modalities?.price?.precisions ?? null,
      },
      otherDetails: modalities?.other ?? null,
    };
  }
}
