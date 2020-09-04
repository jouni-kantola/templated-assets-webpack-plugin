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
