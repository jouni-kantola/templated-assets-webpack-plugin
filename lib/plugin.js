"use strict";

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
    compiler.hooks.emit.tapAsync(this.pluginName, (compilation, callback) =>
      tap(this.pluginOptions, compilation, callback)
    );
  }
}

module.exports = Plugin;
