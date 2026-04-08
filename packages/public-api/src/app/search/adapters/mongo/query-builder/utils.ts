import { type Document } from 'mongodb';
import { type SearchContext } from './search.query-builder';

export function appendAndConditions(
  context: SearchContext,
  conditions: Document[],
): SearchContext {
  if (conditions.length === 0) {
    return context;
  }

  return {
    ...context,
    andConditions: [...context.andConditions, ...conditions],
  };
}

export function buildMatchStage(andConditions: Document[]): Document {
  return andConditions.length > 0 ? { $and: andConditions } : ({} as Document);
}

export function buildPlaceAndServiceCondition(
  fieldName: string,
  expectedValue: unknown,
): Document {
  return {
    $or: [
      { [fieldName]: expectedValue },
      {
        services_all: {
          $elemMatch: {
            [fieldName]: expectedValue,
          },
        },
      },
    ],
  };
}
