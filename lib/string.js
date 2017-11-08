"use strict";

exports.trimTrailing = (source, value) => {
  const regex = new RegExp(`\\${value}+$`);
  return source.replace(regex, "");
};

exports.trimLeading = (source, value) => {
  const regex = new RegExp(`^\\${value}+`);
  return source.replace(regex, "");
};

exports.prepend = (source, value) => {
  return `${value}${source}`;
};

exports.append = (source, value) => {
  return `${source}${value}`;
};

exports.keepSingle = (source, value) => {
  const regex = new RegExp(`(\\${value})(?=\\${value}*\\1)`, "g");
  return `${source}`.replace(regex, "");
};

exports.merge = function() {
  return [].join.call(arguments, "");
};
