"use strict";

const { Compilation } = require("webpack");

const tap = require("./tap");
const { eq } = require("./webpack-version");

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
      if (eq(4)) {
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
              stage: Compilation.PROCESS_ASSETS_STAGE_ANALYSE
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
