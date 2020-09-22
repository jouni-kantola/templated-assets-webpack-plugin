const { version } = require("webpack");
const { RawSource } = require("webpack-sources");

const RuleSet = require("./rule-set");
const CompiledChunks = require("./compiled-chunks");
const publicPath = require("./public-path");
const TemplatedAssets = require("./templated-assets");
const { log } = require("./logger");

function tap(options, compilation, callback) {
  const rules = RuleSet.from(options.rules);
  const { chunks } = new CompiledChunks(
    compilation.chunks,
    compilation.assets,
    publicPath(compilation, +version[0] >= 5)
  );

  new TemplatedAssets(chunks, rules)
    .process()
    .then(templatedAssets => {
      templatedAssets
        .filter(asset => asset.emitAsset)
        .forEach(asset => {
          try {
            if (typeof compilation.emitAsset === "function") {
              compilation.emitAsset(
                asset.filename,
                new RawSource(asset.source)
              );
            } else {
              compilation.assets[asset.filename] = new RawSource(asset.source);
            }
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
}

module.exports = tap;
