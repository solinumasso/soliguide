import {
  CommonPlacePosition,
  CountryCodes,
  slugLocation,
} from "@soliguide/common";
import locationApiService from "../../search/services/location-api.service";

class IntegrationController {
  /**
   * @description recovers information on the address of a structure to integrate in the soliguide
   * - If it is an address, the missing information is recovered
   * - If it is a position (latitude/longitude), we return the full address
   * @return CommonPlacePosition
   */
  public formatAddress = async (positionPayload: {
    address?: string;
    city?: string;
    postal_code?: string;
    latitude?: number;
    longitude?: number;
  }): Promise<CommonPlacePosition> => {
    let position = null;

    if (positionPayload?.latitude && positionPayload?.longitude) {
      const { latitude, longitude } = positionPayload;
      position = await locationApiService.reverse(latitude, longitude);
    } else if (
      positionPayload.address &&
      positionPayload.city &&
      positionPayload.postal_code
    ) {
      const completeAddress = slugLocation(
        `${positionPayload.address}, ${positionPayload.postal_code} ${positionPayload.city}`
      );
      const positions = await locationApiService.getAddress({
        country: CountryCodes.FR,
        geoValue: completeAddress,
        throwIfNoAddress: true,
      });
      if (positions) {
        position = positions[0];
      }
    }

    if (position) {
      return new CommonPlacePosition({
        ...position,
        address: position.label,
        location: { coordinates: position.coordinates, type: "Point" },
      });
    }

    throw new Error("INCOMPLETE_DATA_TO_FORMAT_THE_ADDRESS");
  };
}

export default new IntegrationController();
