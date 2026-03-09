import { CommonPlacePosition } from "@soliguide/common";

export const parseAddress = (position: CommonPlacePosition): string => {
  if (!position) {
    return "";
  }
  let address = position.address.split(",")[0].trim();

  if (position.additionalInformation && position.additionalInformation !== "") {
    address = `${address} (${position.additionalInformation.trim()})`;
  }
  return `${address}, ${position.postalCode} ${position.city}`.replace(
    /\//g,
    "-"
  );
};
