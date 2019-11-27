const RawSource = require("webpack-sources").RawSource;

const RuleSet = require("./rule-set");
const CompiledChunks = require("./compiled-chunks");
const publicPath = require("./public-path");
const TemplatedAssets = require("./templated-assets");
const log = require("./logger").log;

function tap(options, compilation, callback) {
  const rules = RuleSet.from(options.rules);
  const chunks = new CompiledChunks(
    compilation.chunks,
    compilation.assets,
    publicPath(compilation)
  ).chunks;

  new TemplatedAssets(chunks, rules)
    .process()
    .then(templatedAssets => {
      templatedAssets.forEach(asset => {
        if (!asset.emitAsset) return;
        try {
          compilation.assets[asset.filename] = new RawSource(asset.source);
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
