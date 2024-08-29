"use strict";

const { Compilation } = require("webpack");

const tap = require("./tap");

class Plugin {
  constructor(opts) {
    const options = opts || {
      rules: [
        {
          test: /\.(css|js)$/
        }
      ]
    };

    this.pluginName = "TemplatedAssetsWebpackPlugin";
    this.pluginOptions = options;
  }

  apply(compiler) {
    compiler.hooks.compilation.tap(this.pluginName, compilation => {
      compilation.hooks.processAssets.tapAsync(
        {
          name: this.pluginName,
          stage: Compilation.PROCESS_ASSETS_STAGE_ANALYSE
        },
        (assets, callback) => {
          tap(this.pluginOptions, compilation, callback);
        }
      );
    });
  }
}

module.exports = Plugin;
