import { CommonPlaceEntity } from "@soliguide/common";
import { distance } from "fastest-levenshtein";

const diceCoefficient = (str1: string, str2: string): number => {
  if (!str1 || !str2) {
    return 0;
  }

  // Create a set of all bigrams in both strings
  const bigrams = new Set<string>();
  for (let i = 0; i < str1.length - 1; i++) {
    bigrams.add(str1.slice(i, i + 2));
  }
  for (let i = 0; i < str2.length - 1; i++) {
    bigrams.add(str2.slice(i, i + 2));
  }

  // Count the number of times each bigram appears in both strings (using min)
  let commonBigrams = 0;
  for (const bigram of bigrams) {
    commonBigrams += Math.min(
      str1.split(bigram).length - 1,
      str2.split(bigram).length - 1
    );
  }

  // Calculate the Dice Coefficient
  const totalBigrams = str1.length - 1 + str2.length - 1;
  return commonBigrams / totalBigrams;
};

const distanceSourceDuplicate = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 6371; // km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const lat1rad = (lat1 * Math.PI) / 180;

  const lat2rad = (lat2 * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLon / 2) *
      Math.sin(dLon / 2) *
      Math.cos(lat1rad) *
      Math.cos(lat2rad);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const dist = 1000 * R * c;
  return dist;
};

export const weightDistanceSourceDuplicate = (
  sourcePosition: number[],
  duplicatePosition: number[]
): number => {
  const x1 = sourcePosition[0];
  const x2 = duplicatePosition[0];
  const y1 = sourcePosition[1];
  const y2 = duplicatePosition[1];

  const distance = distanceSourceDuplicate(y1, x1, y2, x2);

  const weight = 1 - 1 / (1 + Math.E ** (-0.01 * distance + 4));

  return weight;
};

export const weightLevenshteinAddressSourceDuplicate = (
  sourceAddress: string,
  duplicateAddress: string
): number => {
  const levenshteinDistance = distance(sourceAddress, duplicateAddress);

  if (levenshteinDistance > 7) {
    return 0;
  }
  return 1;
};

export const weightNameSourceDuplicate = (
  sourceName: string,
  duplicateName: string
): number => {
  return diceCoefficient(sourceName.toLowerCase(), duplicateName.toLowerCase());
};

export const weightEntitySourceDuplicate = (
  sourceEntity: CommonPlaceEntity,
  duplicateEntity: CommonPlaceEntity
): number => {
  let weight = 0;
  if (sourceEntity.facebook && duplicateEntity.facebook) {
    if (sourceEntity.facebook === duplicateEntity.facebook) {
      weight += 0.05;
    } else {
      weight -= 0.05;
    }
  }
  if (sourceEntity.instagram && duplicateEntity.instagram) {
    if (sourceEntity.instagram === duplicateEntity.instagram) {
      weight += 0.05;
    } else {
      weight -= 0.05;
    }
  }
  if (sourceEntity.mail && duplicateEntity.mail) {
    if (sourceEntity.mail === duplicateEntity.mail) {
      weight += 0.25;
    } else {
      weight -= 0.05;
    }
  }
  if (sourceEntity.website && duplicateEntity.website) {
    if (sourceEntity.website === duplicateEntity.website) {
      weight += 0.1;
    } else {
      weight -= 0.05;
    }
  }
  sourceEntity.phones!.forEach((sourcePhone) => {
    duplicateEntity.phones!.forEach((duplicatePhone) => {
      if (sourcePhone.phoneNumber === duplicatePhone.phoneNumber) {
        weight += 0.25;
      }
    });
  });

  return weight;
};
