const formatTimeSlot = (
  time: number,
  separator: string,
  prefix = ""
): string => {
  if (time === null || isNaN(time)) {
    return "";
  }
  const hour = time.toString();
  if (time === 0) {
    return `00${separator}00`;
  } else if (time < 100) {
    return `00${separator}${hour}`;
  } else if (time >= 100 && time < 1000) {
    return prefix + hour.substring(0, 1) + separator + hour.substring(1, 3);
  }
  return hour.substring(0, 2) + separator + hour.substring(2, 4);
};

export const formatStringTime = (time: string | number): number => {
  return parseInt(time.toString().replace(/:|h/, ""), 10);
};

export const formatTimeSlotForAdmin = (time: number): string => {
  return formatTimeSlot(time, ":", "0");
};

export const formatTimeSlotForPublic = (time: number): string => {
  return formatTimeSlot(time, "h");
};
