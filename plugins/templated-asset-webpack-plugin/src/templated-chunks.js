"use strict";

const chunkMatcher = require("./chunk-matcher");
const templateReader = require("./template-reader");

// const templatedChunk = {
//           name: chunk.name,
//           filename,
//           source: compilation.assets[filename].source(),
//           process,
//           template,
//           inline
//           async,
//           sync,
//           defer,
//         };

function mapSync(chunks, rules) {
  const syncRules = rules.sync();
  const syncChunks = chunkMatcher.keep(chunks, syncRules);
  return syncChunks.map(chunk => {
    chunk.sync = true; // not needed?
    const rule = chunkMatcher.match(chunk, syncRules);
    // if (rule && rule.template) {
    //   chunk.template = rule.template;
    // } else {
      chunk.template = __dirname + "/templates/sync.tmpl";
    //}

    chunk.process = _sync.bind(this, chunk.template, chunk.filename);

    return chunk;
  });
}

function mapInline(chunks, rules) {
  const inlineRules = rules.inline();
  //console.log("inline rules: ", inlineRules);
  const inlineChunks = chunkMatcher.keep(chunks, inlineRules);
  //   console.log("inline chunks before map", inlineChunks);
  return inlineChunks.map(chunk => {
    chunk.inline = true; // not needed?
    const rule = chunkMatcher.match(chunk, inlineRules);
    //console.log(rule);
    // if (rule && rule.template) {
    //   chunk.template = rule.template;
    // } else {
      chunk.template = __dirname + "/templates/inline.tmpl";
    //}

    chunk.process = _inline.bind(this, chunk.template, chunk.source);

    return chunk;
  });
}

function _sync(template, url) {
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

class TemplatedChunks {
  constructor(chunks, rules) {
    if (!Array.isArray(chunks))
      throw new TypeError("Chunks must be specified to map chunks with rules.");
    if (!(typeof rules === "object"))
      throw new TypeError("Rules must be specified to map rules with chunks.");

    const syncChunks = mapSync(chunks, rules);
    const inlineChunks = mapInline(chunks, rules);

    // this.sync = chunkMatcher.match(assets, this.rules.sync());
    // this.async = chunkMatcher.match(assets, this.rules.async());
    // this.defer = chunkMatcher.match(assets, this.rules.defer());
    // this.inline = chunkMatcher.match(assets, this.rules.inline());

    const assets = syncChunks.concat(inlineChunks).filter(chunk => !!chunk); // deferredChunks, asyncChunks)

    this.assets = assets;
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

function process(assetHandler, content) {
  return assetHandler(content);
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

function sync(url) {
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

module.exports = TemplatedChunks;
