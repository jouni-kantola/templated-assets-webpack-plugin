"use strict";

const RawSource = require("webpack-sources").RawSource;

const log = require("./logger").log;
const RuleSet = require("./rule-set");
const CompiledChunks = require("./compiled-chunks");
const publicPath = require("./public-path");
const TemplatedAssets = require("./templated-assets");

class Plugin {
  constructor(opts) {
    const options = opts || {};
    if (!options.rules) {
      log("No rules specified. No templated chunks will be outputted.");
      log(options);
    }

    this.rules = RuleSet.from(options.rules);
  }

  apply(compiler) {
    compiler.plugin("emit", (compilation, callback) => {
      const chunks = new CompiledChunks(
        compilation.chunks,
        compilation.assets,
        publicPath(compilation)
      ).chunks;

      new TemplatedAssets(chunks, this.rules)
        .process()
        .then(templatedAssets => {
          templatedAssets.forEach(asset => {
            if (!asset.emitAsset) return;
            try {
              compilation.assets[asset.filename] = new RawSource(asset.source);
            } catch (e) {
              throw new Error(
                `Failed to include asset ${JSON.stringify(
                  asset
                )} to compilation.
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

module.exports = Plugin;
