"use strict";

const { Compilation } = require("webpack");

const log = require("./logger").log;
const tap = require("./tap");

class Plugin {
  constructor(opts) {
    const options = opts || {
      rules: []
    };
    if (!options.rules || !options.rules.length) {
      log("No rules specified. No templated chunks will be outputted.");
      log(options);
    }
    this.pluginName = "TemplatedAssetsWebpackPlugin";
    this.pluginOptions = options;
  }

  apply(compiler) {
    compiler.hooks.compilation.tap(this.pluginName, compilation => {
      compilation.hooks.processAssets.tap(
        {
          name: this.pluginName,
          stage: Compilation.PROCESS_ASSETS_STAGE_DERIVED
        },
        assets => {
          tap(this.pluginOptions, compilation);
        }
      );
    });
  }
}

module.exports = Plugin;
