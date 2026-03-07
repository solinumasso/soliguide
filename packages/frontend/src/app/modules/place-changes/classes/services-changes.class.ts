import deepEqual from "deep-equal";

import type { Service } from "../../../models";

export class ServicesChanges {
  public added: Service[] = [];
  public edited: Service[] = [];
  public deleted: Service[] = [];
  public unchanged: Service[] = [];
  public oldServicesEdited: { [key: string]: Service } = {};

  constructor(oldServices: Service[], newServices: Service[]) {
    for (const service of newServices) {
      const newService = this.cleanServiceBeforeDiff(service);

      let matchingOldService = oldServices.find(
        (oldService) =>
          oldService.serviceObjectId === newService.serviceObjectId
      );

      if (matchingOldService) {
        matchingOldService = this.cleanServiceBeforeDiff(matchingOldService);

        if (deepEqual(matchingOldService, newService, { strict: false })) {
          this.unchanged.push(newService);
        } else {
          this.oldServicesEdited[matchingOldService.serviceObjectId] =
            matchingOldService;
          this.edited.push(newService);
        }
      } else {
        this.added.push(newService);
      }
    }

    for (const oldService of oldServices) {
      const matchingNewService = newServices.find(
        (newService) =>
          newService.serviceObjectId === oldService.serviceObjectId
      );
      if (!matchingNewService) {
        this.deleted.push(oldService);
      }
    }
  }

  public cleanServiceBeforeDiff(service: Service): Service {
    // isOpenToday is changing everyday, so we don't need to compare it
    // Maybe we have others values to exclude from diff
    if (typeof service?.isOpenToday !== "undefined") {
      delete service.isOpenToday;
    }
    if (typeof service?.close?.isCampaign !== "undefined") {
      delete service.close.isCampaign;
    }
    if (typeof service?.publics?.showAge !== "undefined") {
      delete service.publics.showAge;
    }
    // Convert description to HTML because some old content was only a text
    if (service?.description) {
      service.description = this.decodeHtml(service.description);
    }
    return service;
  }

  public decodeHtml(encodedHtml: string): string {
    const txt = document.createElement("textarea");
    txt.innerHTML = encodedHtml;
    return txt.value;
  }
}
