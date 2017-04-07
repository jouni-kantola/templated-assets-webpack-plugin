"use strict";

const chunkMatcher = require("./chunk-matcher");
const templateReader = require("./template-reader");

class TemplatedChunks {
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
          compilation.assets[asset.name + ".partial"] = template;
          resolve();
        });
      });
    });

    Promise.all(allProcesses).then(_ => callback());
  }
}

function mapChunks(chunks, rules) {
  const syncChunks = mapSync(chunks, rules);
  const asyncChunks = mapAsync(chunks, rules);
  const deferredChunks = mapDeferred(chunks, rules);
  const inlineChunks = mapInline(chunks, rules);

  const assets = syncChunks
    .concat(asyncChunks, deferredChunks, inlineChunks)
    .filter(chunk => !!chunk);

  return assets;
}

function mapUrl(chunks, rules, template) {
  /* 
    const templatedChunk = {
          name,
          filename,
          source,
          process,
          template,
          inline
          async,
          sync,
          defer,
        };
*/
  const syncChunks = chunkMatcher.keep(chunks, rules);
  return syncChunks.map(chunk => {
    //chunk.sync = true; chunk.async = true; chunk.defer = true; // not needed?
    const rule = chunkMatcher.match(chunk, rules);
    // if (rule && rule.template) {
    //   chunk.template = rule.template;
    // } else {
    chunk.template = __dirname + "/templates/sync.tmpl";
    //}

    chunk.process = _url.bind(this, chunk.template, chunk.filename);

    return chunk;
  });
}

function mapSync(chunks, rules) {
  return mapUrl(chunks, rules.sync(), __dirname + "/templates/sync.tmpl");
}

function mapAsync(chunks, rules) {
  return mapUrl(chunks, rules.async(), __dirname + "/templates/async.tmpl");
}

function mapDeferred(chunks, rules) {
  return mapUrl(chunks, rules.defer(), __dirname + "/templates/defer.tmpl");
}

function mapInline(chunks, rules) {
  const inlineRules = rules.inline();
  const inlineChunks = chunkMatcher.keep(chunks, inlineRules);

  return inlineChunks.map(chunk => {
    chunk.inline = true; // not needed?
    const rule = chunkMatcher.match(chunk, inlineRules);

    // if (rule && rule.template) {
    //   chunk.template = rule.template;
    // } else {
    chunk.template = __dirname + "/templates/inline.tmpl";
    //}

    chunk.process = _inline.bind(this, chunk.template, chunk.source);

    return chunk;
  });
}

function _url(template, url) {
  return new Promise((resolve, reject) => {
    return templateReader.read(template).then(content => {
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

function _inline(template, source) {
  return new Promise((resolve, reject) => {
    return templateReader.read(template).then(content => {
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

module.exports = TemplatedChunks;
