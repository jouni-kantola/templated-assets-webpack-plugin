"use strict";

const chunkMatcher = require("./chunk-matcher");
const AssetSource = require("./asset-source");
const Asset = require("./asset");

class TemplatedAssets {
  constructor(chunks, rules) {
    if (!Array.isArray(chunks))
      throw new TypeError("Chunks must be specified to map chunks with rules.");
    if (!(typeof rules === "object"))
      throw new TypeError("Rules must be specified to map rules with chunks.");

    this.assets = mapChunks(chunks, rules);
  }

  process() {
    const processes = this.assets.map(asset => asset.process());

    return Promise.all(processes);
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
  const assetSource = new AssetSource(chunk.filename, chunk.source);

  const asset = new Asset(name, assetSource, chunk.url, rule.args);

  if (rule.output) {
    const {
      extension,
      prefix,
      async,
      defer,
      inline,
      emitAsset,
      path
    } = rule.output;

    asset.file.extension = extension;
    asset.file.prefix = prefix;
    asset.type.async = async;
    asset.type.defer = defer;
    asset.type.inline = inline;
    asset.output.emitAsset = emitAsset;
    asset.output.path = path;
  }

  if (rule.replace) {
    asset.template.replace = rule.replace;
  }

  if (rule.template) {
    if (typeof rule.template === "function") {
      asset.template.process = rule.template;
    } else if (typeof rule.template === "string") {
      asset.template.path = rule.template;
    } else if (typeof rule.template === "object") {
      const { path, header, footer } = rule.template;
      asset.template.path = path;
      asset.template.header = header;
      asset.template.footer = footer;
      if (rule.template.replace) {
        asset.template.replace = rule.template.replace;
      }
    } else {
      throw new TypeError(
        `Template ${JSON.stringify(rule.template)} not supported. Must be either of:
      - path: string
      - template definition: { path, replace }
      - template compiler: function(source: string, filename: string, callback: function(updatedSource: string))`
      );
    }
  }

  return asset;
}

module.exports = TemplatedAssets;
