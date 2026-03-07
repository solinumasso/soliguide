export const getMinDateToday = () => {
  return {
    day: new Date().getDate(),
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
  };
};

export const MIN_DATE_GENERAL = {
  day: new Date().getDate(),
  month: new Date().getMonth() + 1,
  year: new Date().getFullYear() - 1,
};
