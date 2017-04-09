"use strict";

const log = require("./logger").log;
const RuleSet = require("./rule-set");
const CompiledChunks = require("./compiled-chunks");
const TemplatedAssets = require("./templated-assets");

class TemplatedAssetWebpackPlugin {
  constructor(opts) {
    const options = opts || {};
    if (!options.rules) {
      log("No rules specified. No templated chunks will be outputted.");
      log(options);
    }

    this.rules = new RuleSet(options.rules);
  }

  apply(compiler) {
    compiler.plugin("emit", (compilation, callback) => {
      const chunks = new CompiledChunks(compilation).chunks;

      new TemplatedAssets(chunks, this.rules)
        .process(compilation, callback)
        .then(() => callback())
        .catch(log);
    });
  }
}

module.exports = TemplatedAssetWebpackPlugin;
