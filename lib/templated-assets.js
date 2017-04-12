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

  const asset = new Asset(name, {
    content: rule.output && rule.output.inline ? chunk.source : chunk.url,
    url: chunk.url,
    source: chunk.source,
    filename: chunk.filename
  });

  if (rule.output) {
    asset.file.extension = rule.output.extension;
    asset.file.prefix = rule.output.prefix;
    asset.type.async = rule.output.async;
    asset.type.defer = rule.output.defer;

    if (rule.output.inline) {
      asset.type.inline = true;
    }
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
      asset.template.path = rule.template.path;
      asset.template.replace = rule.template.replace;
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
