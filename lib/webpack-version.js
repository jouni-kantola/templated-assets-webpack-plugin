const { version } = require("webpack");

const webpackVersion = version && +version[0];

function eq(versionNumber) {
  return webpackVersion === versionNumber;
}

function gte(versionNumber) {
  return webpackVersion >= versionNumber;
}

module.exports = {
  eq,
  gte
};
