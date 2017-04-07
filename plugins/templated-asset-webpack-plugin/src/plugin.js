"use strict";

const fs = require("fs");

const log = require("./logger").log;
const RuleSet = require("./rule-set");
const CompiledChunks = require("./compiled-chunks");
const chunkMatcher = require("./chunk-matcher");
const TemplatedChunks = require("./templated-chunks");

class TemplatedAssetWebpackPlugin {
  constructor(opts) {
    const options = opts || {};
    if(!options.rules) {
      log("No rules specified. No templated chunks will be outputted.");
      log(options);
    }
    
    this.rules = new RuleSet(options.rules);
  }

  apply(compiler) {
    compiler.plugin("emit", (compilation, callback) => {
      const chunks = new CompiledChunks(compilation).chunks;

      const templatedChunks = new TemplatedChunks(chunks, this.rules);

      templatedChunks.process(compilation, callback);
    });
  }
}

module.exports = TemplatedAssetWebpackPlugin;
