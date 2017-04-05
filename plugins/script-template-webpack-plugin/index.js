const fs = require("fs");
/*
{
    name: 'vendor',
    type: 'script/defer/async/inline',
    template: ''
}*/

class ScriptTemplateWebpackPlugin {
  constructor(definitions) {
    this.definitions = definitions;
  }

  apply(compiler) {
    compiler.plugin("emit", (compilation, callback) => {
      const assets = compilation.chunks.map(chunk => {
        const filename = chunk.files[0];
        return {
          name: chunk.name,
          filename,
          source: compilation.assets[filename].source(),
          process
        };
      });

      const allProcesses = assets.map(asset => {
        return asset.process(inline, asset.source).then(template => {
            return new Promise((resolve, reject) => {
                compilation.assets[asset.name + ".tmpl"] = template;
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

function readTemplate(path) {
  return new Promise((resolve, reject) => {
    fs.readFile(path, (err, content) => {
      if (err) reject(err);
      resolve(content.toString());
    });
  });
}

module.exports = ScriptTemplateWebpackPlugin;
