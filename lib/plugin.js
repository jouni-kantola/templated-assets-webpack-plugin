"use strict";

const log = require("./logger").log;
const tap = require("./tap");

class Plugin {
  constructor(opts) {
    let options = opts || {};
    if (!options.rules) {
      log("No rules specified. No templated chunks will be outputted.");
      log(options);
      options.rules = [];
    }
    this.pluginName = "TemplatedAssetsWebpackPlugin";
    this.pluginOptions = options;
  }

  apply(compiler) {
    if (!!compiler.hooks) {
      compiler.hooks.emit.tapAsync(this.pluginName, (compilation, callback) =>
        tap(this.pluginOptions, compilation, callback)
      );
    } else {
      compiler.plugin("emit", (compilation, callback) =>
        tap(this.pluginOptions, compilation, callback)
      );
    }
  }
}

module.exports = Plugin;
