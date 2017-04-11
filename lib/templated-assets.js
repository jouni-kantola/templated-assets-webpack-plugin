"use strict";

const chunkMatcher = require("./chunk-matcher");
const Asset = require("./asset");

class TemplatedAssets {
  constructor(chunks, rules) {
    if (!Array.isArray(chunks))
      throw new TypeError("Chunks must be specified to map chunks with rules.");
    if (!(typeof rules === "object"))
      throw new TypeError("Rules must be specified to map rules with chunks.");

    this.assets = mapChunks(chunks, rules);
  }

  process(compilation) {
    const allProcesses = this.assets.map(asset => {
      return asset.process().then(templatedAsset => {
        try {
          compilation.assets[templatedAsset.filename] = {
            source: () => templatedAsset.source,
            size: () => templatedAsset.size
          };
        } catch (e) {
          throw new Error(
            `Failed to include asset ${JSON.stringify(asset)} to compilation.
            ${e.message}`
          );
        }

        return Promise.resolve();
      });
    });

    return Promise.all(allProcesses);
  }
}

function mapChunks(chunks, rules) {
  const urlRules = rules.url();
  const matchingUrlChunks = chunkMatcher.keep(chunks, urlRules);
  const urlChunks = chunksToAssets(matchingUrlChunks, urlRules);

  const inlineRules = rules.inline();
  const matchingInlineChunks = chunkMatcher.keep(chunks, inlineRules);
  const inlineChunks = chunksToAssets(matchingInlineChunks, inlineRules);

  return urlChunks.concat(inlineChunks).filter(chunk => !!chunk);
}

function chunksToAssets(chunks, rules) {
  return chunks.map(chunk => {
    const rule = chunkMatcher.match(chunk, rules);
    return chunkToAsset(chunk, rule);
  });
}

function chunkToAsset(chunk, rule) {
  const name = chunk.name || chunk.filename;

  let asset;

  if (rule.output && rule.output.inline) {
    asset = new Asset(name, {
      content: chunk.source,
      filename: chunk.filename
    });
    asset.type.inline = true;
  } else {
    asset = new Asset(name, {
      content: chunk.url,
      filename: chunk.filename
    });

    if (rule.output) {
      asset.type.async = rule.output.async;
      asset.type.defer = rule.output.defer;
    }
  }

  if (rule.replace) {
    asset.template.replace = rule.replace;
  }

  if (rule.template) {
    asset.template.path = rule.template;
  }

  if (rule.output) {
    asset.file.extension = rule.output.extension || "html";
    asset.file.prefix = rule.output.prefix || "";
  }

  return asset;
}

module.exports = TemplatedAssets;
