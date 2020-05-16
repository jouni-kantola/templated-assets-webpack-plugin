"use strict";

const is = require("is");

const chunkMatcher = require("./chunk-matcher");
const AssetSource = require("./asset-source");
const Asset = require("./asset");

class TemplatedAssets {
  constructor(chunks, ruleSet) {
    if (!is.array(chunks))
      throw new TypeError("Chunks must be specified to map chunks with rules.");
    if (!is.object(ruleSet))
      throw new TypeError("Rules must be specified to map rules with chunks.");

    this.assets = mapChunks(chunks, ruleSet);
  }

  process() {
    const processes = this.assets.map(asset => asset.process());

    return Promise.all(processes);
  }
}

function mapChunks(chunks, ruleSet) {
  const urlRules = ruleSet.url();
  const matchingUrlChunks = chunkMatcher.keep(chunks, urlRules.rules);
  const urlChunks = chunksToAssets(matchingUrlChunks, urlRules);

  const inlineRules = ruleSet.inline();
  const matchingInlineChunks = chunkMatcher.keep(chunks, inlineRules.rules);
  const inlineChunks = chunksToAssets(matchingInlineChunks, inlineRules);

  return urlChunks.concat(inlineChunks).filter(chunk => !!chunk);
}

function chunksToAssets(chunks, ruleSet) {
  return chunks.map(chunk => {
    const rule = ruleSet.findBy(chunk);
    return chunkToAsset(chunk, rule);
  });
}

function chunkToAsset(chunk, rule) {
  const assetSource = new AssetSource(chunk.filename, chunk.source);

  const name = nameAsset(chunk, rule);
  const asset = new Asset(name, assetSource, chunk.url, rule.args);

  if (rule.output) {
    asset.file.extension = rule.output.extension;
    asset.file.prefix = rule.output.prefix;
    asset.type.async = rule.output.async;
    asset.type.defer = rule.output.defer;
    asset.type.nomodule = rule.output.nomodule;
    asset.type.inline = rule.output.inline;
    asset.output.emitAsset = rule.output.emitAsset;
    asset.output.path = rule.output.path;
  }

  if (rule.replace) {
    asset.template.replace = rule.replace;
  }

  if (rule.template) {
    if (is.function(rule.template)) {
      asset.template.process = rule.template;
    } else if (is.string(rule.template)) {
      asset.template.path = rule.template;
    } else if (is.object(rule.template)) {
      asset.template.path = rule.template.path;
      asset.template.header = rule.template.header;
      asset.template.footer = rule.template.footer;
      if (rule.template.replace) {
        asset.template.replace = rule.template.replace;
      }
    } else {
      throw new TypeError(
        `Template ${JSON.stringify(
          rule.template
        )} not supported. Must be either of:
      - path: string
      - template definition: { path, replace }
      - template compiler: function(source: string, filename: string, callback: function(updatedSource: string))`
      );
    }
  }

  return asset;
}

function nameAsset(chunk, rule) {
  const defaultName = chunk.name || chunk.filename;

  if (rule.output) {
    if (is.string(rule.output.name)) return rule.output.name;

    if (is.function(rule.output.name)) {
      const name = rule.output.name(defaultName);
      if (!is.string(name))
        throw new TypeError(
          "Rule's asset naming function must return name (string)"
        );

      return name;
    }
  }

  return defaultName;
}

module.exports = TemplatedAssets;
