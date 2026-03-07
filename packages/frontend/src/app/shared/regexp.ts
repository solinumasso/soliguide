
export const regexp = {
  date: /^([0-2][0-9]|(3)[0-1])(\/)(((0)[0-9])|((1)[0-2]))(\/)\d{4}$/,
  facebook:
    "(https?://)?([\\da-z.-]+\\.)?(facebook)\\.([a-z.]{2,6})[/\\w%@ %?#=&.-]*/?",

  htmlTag: /(<([^>]+)>)|(&nbsp;)/gi,
  instagram:
    "(https?://)?([\\da-z.-]+\\.)?(instagram)\\.([a-z.]{2,6})[/\\w %?#=&.-]*/?",

  postcode: /^[0-9][0-9AB][0-9]{3}$/,
};
