"use strict";

const fs = require("fs");

const TemplatedChunks = require("./templated-chunks");
const CompiledChunks = require("./compiled-chunks");

/*new TemplatedAssetWebpackPlugin({
    chunks: [
      {
        name: ['app', 'vendor'] || 'app'
        test: /lala/,
        exclude: /(node_modules)/,
        inline: {
          template:  path.join(__dirname, 'tmpl/chunk-manifest.tmpl') <-- optional
          replace: '##SOURCE##'
        },
        url: {
          template:  path.join(__dirname, 'tmpl/chunk-manifest.tmpl')
          replace: '##URL##'
          async: true,
          defer: true
        }
      }
    ]
  })*/

class TemplatedAssetWebpackPlugin {
  constructor(opts) {
    const options = opts || {};
    this.chunks = new TemplatedChunks(options.chunks).chunks;

    // legacy
    this.sync = options.sync || [];
    this.async = options.async || [];
    this.inline = options.inline || [];
    this.defer = options.defer || [];
  }

  apply(compiler) {
    compiler.plugin("emit", (compilation, callback) => {
      // filter assets to handle

      const assets = new CompiledChunks(compilation).chunks;

      const syncAssets = assetPicker(assets, this.sync);
      const asyncAssets = assetPicker(assets, this.async);
      const deferredAssets = assetPicker(assets, this.defer);
      const inlineAssets = assetPicker(assets, this.inline);

      const allAssets = syncAssets
        .concat(asyncAssets, deferredAssets, inlineAssets)
        .filter(asset => !!asset);

      // process sync
      // process async
      // process inline (manifest.json has specific template)
      // process defer

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

function process(assetHandler, source) {
  return assetHandler(source);
}

function inline(source) {
  return new Promise((resolve, reject) => {
    return readTemplate(`${__dirname}/templates/inline.tmpl`).then(content => {
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

function assetPicker(assets, rules) {
  return rules.length ? assets.filter(asset => assetFilter(asset, rules)) : [];
}

function assetFilter(asset, rules) {
  // name is not enough, does not match manifest.json
  return rules.map(ruleToRegExp).some(rule => rule.test(asset.name));
}

function ruleToRegExp(rule) {
  if (typeof rule === "string") {
    return new RegExp(`${rule}$`);
  } else if (rule instanceof RegExp) {
    return rule;
  } else if (
    typeof rule === "object" && !!rule.test && rule.test instanceof RegExp
  ) {
    return rule.test;
  }

  throw `${rule} is not a valid configuration.`;
}
function defer(url) {
  return new Promise((resolve, reject) => {
    return readTemplate(`${__dirname}/templates/defer.tmpl`).then(content => {
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
    return readTemplate(`${__dirname}/templates/async.tmpl`).then(content => {
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
    return readTemplate(`${__dirname}/templates/script.tmpl`).then(content => {
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
