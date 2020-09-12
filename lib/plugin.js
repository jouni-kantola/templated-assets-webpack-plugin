"use strict";

const { Compilation, version } = require("webpack");

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
    if (compiler.hooks) {
      if (version[0] === "4") {
        compiler.hooks.emit.tapAsync(
          this.pluginName,
          (compilation, callback) => {
            tap(this.pluginOptions, compilation, callback);
          }
        );
      } else {
        compiler.hooks.compilation.tap(this.pluginName, compilation => {
          compilation.hooks.processAssets.tapAsync(
            {
              name: this.pluginName,
              stage: Compilation.PROCESS_ASSETS_STAGE_DERIVED
            },
            (assets, callback) => {
              tap(this.pluginOptions, compilation, callback);
            }
          );
        });
      }
    } else {
      compiler.plugin("emit", (compilation, callback) =>
        tap(this.pluginOptions, compilation, callback)
      );
    }
  }
}

module.exports = Plugin;
