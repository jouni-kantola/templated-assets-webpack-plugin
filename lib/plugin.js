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
        .process()
        .then(templatedAssets => {
          templatedAssets.forEach(asset => {
            if (!asset.emitAsset) return;
            try {
              compilation.assets[asset.filename] = {
                source: () => asset.source,
                size: () => asset.size
              };
            } catch (e) {
              throw new Error(
                `Failed to include asset ${JSON.stringify(asset)} to compilation.
            ${e.message}`
              );
            }
          });

          callback();
        })
        .catch(log);
    });
  }
}

module.exports = TemplatedAssetWebpackPlugin;
