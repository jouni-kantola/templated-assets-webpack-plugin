"use strict";

const fs = require("fs");

const log = require("./logger").log;
const RuleSet = require("./rule-set");
const CompiledChunks = require("./compiled-chunks");
const chunkMatcher = require("./chunk-matcher");

class TemplatedAssetWebpackPlugin {
  constructor(opts) {
    const options = opts || {};
    if(!options.rules) {
      log("No rules specified. No templated chunks will be outputted.");
      log(options);
    }
    this.rules = new RuleSet(options.rules);
    this.sync = this.rules.sync();
    this.async = this.rules.async();
    this.inline = this.rules.inline();
    this.defer = this.rules.defer();
  }

  apply(compiler) {
    compiler.plugin("emit", (compilation, callback) => {
      const assets = new CompiledChunks(compilation).chunks;

      const syncAssets = chunkMatcher.match(assets, this.sync);
      const asyncAssets = chunkMatcher.match(assets, this.async);
      const deferredAssets = chunkMatcher.match(assets, this.defer);
      const inlineAssets = chunkMatcher.match(assets, this.inline);

      const allAssets = syncAssets
        .concat(asyncAssets, deferredAssets, inlineAssets)
        .filter(asset => !!asset);

      const allProcesses = allAssets.map(asset => {
        return asset.process(inline, asset.source).then(template => {
          return new Promise((resolve, reject) => {
            compilation.assets[asset.name + ".partial"] = template;
            resolve();
          });
        });
      });

      Promise.all(allProcesses).then(_ => callback());
    });
  }
}

function inline(source) {
  return new Promise((resolve, reject) => {
    return readTemplate(
      `${__dirname}/../templates/inline.tmpl`
    ).then(content => {
      const script = content.replace(/##SOURCE##/, source);
      resolve({
        source: function() {
          return script;
        },
        size: function() {
          return script.length;
        }
      });
    });
  });
}

function defer(url) {
  return new Promise((resolve, reject) => {
    return readTemplate(
      `../${__dirname}/../templates/defer.tmpl`
    ).then(content => {
      const script = content.replace(/##URL##/, url);
      resolve({
        source: function() {
          return script;
        },
        size: function() {
          return script.length;
        }
      });
    });
  });
}

function async(url) {
  return new Promise((resolve, reject) => {
    return readTemplate(
      `../${__dirname}/../templates/async.tmpl`
    ).then(content => {
      const script = content.replace(/##URL##/, url);
      resolve({
        source: function() {
          return script;
        },
        size: function() {
          return script.length;
        }
      });
    });
  });
}

function script(url) {
  return new Promise((resolve, reject) => {
    return readTemplate(
      `../${__dirname}/../templates/script.tmpl`
    ).then(content => {
      const script = content.replace(/##URL##/, url);
      resolve({
        source: function() {
          return script;
        },
        size: function() {
          return script.length;
        }
      });
    });
  });
}

function readTemplate(path) {
  return new Promise((resolve, reject) => {
    fs.readFile(path, (err, content) => {
      if (err) reject(err);
      resolve(content.toString());
    });
  });
}

module.exports = TemplatedAssetWebpackPlugin;
