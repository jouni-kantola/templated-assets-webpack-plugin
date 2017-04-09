"use strict";

const chunkMatcher = require("./chunk-matcher");
const templateReader = require("./template-reader");
const Asset = require("./asset");

class TemplatedAssets {
  constructor(chunks, rules) {
    if (!Array.isArray(chunks))
      throw new TypeError("Chunks must be specified to map chunks with rules.");
    if (!(typeof rules === "object"))
      throw new TypeError("Rules must be specified to map rules with chunks.");

    this.assets = mapChunks(chunks, rules);
  }

  process(compilation, callback) {
    const allProcesses = this.assets.map(asset => {
      return asset.process().then(template => {
        return new Promise((resolve, reject) => {
          const name = asset.file.filename;
          if (!name) {
            reject(`Cannot name asset ${JSON.stringify(asset)}`);
          }

          try {
            compilation.assets[name] = template;
          } catch (e) {
            reject(
              `Failed to include asset ${JSON.stringify(asset)} to compilation.\n${e.message}`
            );
          }

          resolve();
        });
      });
    });

    Promise.all(allProcesses).then(() => callback());
  }
}

function mapChunks(chunks, rules) {
  const urlChunks = mapUrl(chunks, rules.url());
  const inlineChunks = mapInline(chunks, rules);

  const assets = urlChunks.concat(inlineChunks).filter(chunk => !!chunk);

  return assets;
}

function mapUrl(chunks, rules) {
  const urlChunks = chunkMatcher.keep(chunks, rules);
  return urlChunks.map(chunk => {
    const rule = chunkMatcher.match(chunk, rules);

    const asset = new Asset(chunk.name || chunk.filename, {
      content: chunk.filename,
      filename: chunk.filename
    });

    asset.type.async = rule.async;
    asset.type.defer = rule.defer;

    if (rule.replace) {
      asset.template.replace = rule.replace;
    }

    if (rule.template) {
      asset.template.path = rule.template;
    }

    asset.process = process.bind(
      this,
      asset.template.path,
      asset.template.replace,
      asset.source.content
    );

    return asset;
  });
}

function mapInline(chunks, rules) {
  const inlineRules = rules.inline();
  const inlineChunks = chunkMatcher.keep(chunks, inlineRules);

  return inlineChunks.map(chunk => {
    const rule = chunkMatcher.match(chunk, inlineRules);

    const asset = new Asset(chunk.name || chunk.filename, {
      content: chunk.source,
      filename: chunk.filename
    });

    asset.type.inline = rule.inline;

    if (rule.replace) {
      asset.template.replace = rule.replace;
    }

    if (rule.template) {
      asset.template.path = rule.template;
    }

    asset.process = process.bind(
      this,
      asset.template.path,
      asset.template.replace,
      asset.source.content
    );

    return asset;
  });
}

function process(template, replace, value) {
  return new Promise((resolve, reject) => {
    return templateReader.read(template).then(content => {
      const script = content.replace(replace, value);

      if (content === script) {
        reject(
          `No replacement done in template. Check rule configuration.
        ${content}`
        );
      }

      resolve({
        source: () => script,
        size: () => script.length
      });
    });
  });
}

module.exports = TemplatedAssets;
