export const parseOpenToday = (
  openToday: boolean,
  nosqlQuery: any,
  inService = false
): void => {
  if (openToday) {
    if (inService) {
      nosqlQuery["services_all"]["$elemMatch"]["isOpenToday"] = true;
    } else {
      nosqlQuery["$or"][0]["services_all"]["$elemMatch"]["isOpenToday"] = true;
      nosqlQuery["$or"][1]["$and"].push({
        ["isOpenToday"]: true,
      });
    }
  }
};
