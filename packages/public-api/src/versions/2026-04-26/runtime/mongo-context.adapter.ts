import { Injectable } from "@nestjs/common";

import { PlaceModel } from "@soliguide/api";

import type { VersionContextInput } from "../../../versioning-engine/dsl";
import {
  V20260426Context,
  V20260426ContextProvider,
  V20260426To20260101PlaceRestoreSnapshot,
} from "./context";

@Injectable()
export class V20260426MongoContextProvider implements V20260426ContextProvider {
  public async getContext(
    input: VersionContextInput
  ): Promise<V20260426Context> {
    const ids = this.collectPlaceIds(input.payload);

    if (ids.length === 0) {
      return { legacyPlacesById: {} };
    }

    const numericIds = ids.map(Number).filter((id) => Number.isFinite(id));

    const places = await PlaceModel.find({
      $or: [{ lieu_id: { $in: numericIds } }, { _id: { $in: ids } }],
    })
      .lean()
      .exec();

    return this.indexLegacyPlaces(
      places as V20260426To20260101PlaceRestoreSnapshot[]
    );
  }

  private collectPlaceIds(payload: unknown): string[] {
    const ids = new Set<string>();

    for (const place of this.readPlaces(payload)) {
      for (const id of [place.lieu_id, place._id]) {
        if (id !== undefined && id !== null) {
          ids.add(String(id));
        }
      }
    }

    return [...ids];
  }

  private readPlaces(payload: unknown): Array<Record<string, unknown>> {
    if (!this.isRecord(payload)) {
      return [];
    }

    const places = payload.places;

    return Array.isArray(places)
      ? places.filter((item) => this.isRecord(item))
      : [];
  }

  private isRecord(value: unknown): value is Record<string, unknown> {
    return value !== null && typeof value === "object" && !Array.isArray(value);
  }

  private indexLegacyPlaces(
    places: V20260426To20260101PlaceRestoreSnapshot[]
  ): V20260426Context {
    const legacyPlacesById: V20260426Context["legacyPlacesById"] = {};

    for (const place of places) {
      for (const id of [place.lieu_id, place._id]) {
        if (id !== undefined && id !== null) {
          legacyPlacesById[String(id)] = place;
        }
      }
    }

    return { legacyPlacesById };
  }
}
