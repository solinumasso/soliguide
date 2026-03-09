import { postalCodeDto } from "./position.dto";

import { stringDto } from "../../_utils/dto";

export const checkDuplicatesByAddressAndPlaceIdDto = [
  stringDto("address"),
  postalCodeDto("postalCode"),
];
