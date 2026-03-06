import { DocsModel } from "../models/document.model";
import { getMongoId } from "../../_utils/functions/mongo/getMongoId";
import { PlaceModel } from "../models/place.model";
import { ApiPlace, CommonPlaceDocument } from "@soliguide/common";
import mongoose, { FilterQuery } from "mongoose";

export class DocumentService {
  public async createDocument(
    data: CommonPlaceDocument
  ): Promise<CommonPlaceDocument> {
    delete data._id;
    return await DocsModel.create(data);
  }

  public updatePlaceByPlaceIdAfterDocUpload(
    lieu_id: number,
    _id: string | mongoose.Types.ObjectId,
    action: "$pull" | "$addToSet",
    serviceId: number | null
  ) {
    const docMongoId = getMongoId(_id);
    const update: FilterQuery<ApiPlace> = {
      [action]: {
        "modalities.docs": docMongoId,
      },
    };

    if (serviceId !== null) {
      update[action] = {
        [`services_all.${serviceId}.modalities.docs`]: docMongoId,
      };
    }

    return PlaceModel.findOneAndUpdate({ lieu_id }, update, { new: true })
      .populate([
        {
          model: "Docs",
          path:
            serviceId !== null
              ? `services_all.${serviceId}.modalities.docs`
              : "modalities.docs",
        },
      ])
      .select(`lieu_id ${serviceId !== null ? "services_all" : "modalities"}`)
      .lean()
      .exec();
  }

  public deleteDocument(
    _id: string | mongoose.Types.ObjectId
  ): Promise<CommonPlaceDocument | null> {
    return DocsModel.findOneAndDelete({
      _id: getMongoId(_id),
    })
      .lean<CommonPlaceDocument>()
      .exec();
  }
}

export default new DocumentService();
