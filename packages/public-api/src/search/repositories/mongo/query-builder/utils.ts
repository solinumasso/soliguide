import { type Document } from "mongodb";

import { SearchContext } from "./search.query-builder";

export function appendAndConditions(
  context: SearchContext,
  ...conditions: Document[]
): SearchContext {
  return {
    ...context,
    andConditions: [...context.andConditions, ...conditions],
  };
}

type ServiceElemMatchCondition = {
  services_all: {
    $elemMatch: Record<string, unknown>;
  };
};

export function mergeServiceElemMatchCondition(
  context: SearchContext,
  fields: Record<string, unknown>,
  options: { createWhenMissing?: boolean } = {}
): SearchContext {
  if (
    !Object.keys(fields).length ||
    context.query.serviceFiltersEnabled === false
  ) {
    return context;
  }

  const serviceConditionIndex = context.andConditions.findIndex((condition) =>
    isServiceElemMatchCondition(condition)
  );

  if (serviceConditionIndex === -1) {
    if (!options.createWhenMissing) {
      return context;
    }

    return appendAndConditions(context, {
      services_all: {
        $elemMatch: fields,
      },
    });
  }

  const andConditions = [...context.andConditions];
  const existingCondition = andConditions[
    serviceConditionIndex
  ] as ServiceElemMatchCondition;

  andConditions[serviceConditionIndex] = {
    services_all: {
      $elemMatch: {
        ...existingCondition.services_all.$elemMatch,
        ...fields,
      },
    },
  };

  return {
    ...context,
    andConditions,
  };
}

function isServiceElemMatchCondition(
  condition: Record<string, unknown>
): condition is ServiceElemMatchCondition {
  if (!Object.prototype.hasOwnProperty.call(condition, "services_all")) {
    return false;
  }

  const servicesAll = condition.services_all;

  if (!servicesAll || typeof servicesAll !== "object") {
    return false;
  }

  return Object.prototype.hasOwnProperty.call(servicesAll, "$elemMatch");
}
