import { isWithinInterval } from "date-fns";

export const computeTempIsActive = (tempInfo: {
  actif?: boolean;
  dateDebut?: Date;
  dateFin?: Date | null;
}): boolean => {
  if (!tempInfo?.actif || !tempInfo?.dateDebut) {
    return false;
  }

  const start = new Date(tempInfo.dateDebut);
  const end = new Date(tempInfo?.dateFin ?? "2100-01-01");

  return isWithinInterval(new Date(), { start, end });
};
