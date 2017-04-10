"use strict";

class CompiledChunks {
  constructor(compilation) {
    if (!compilation)
      throw new Error("webpack compilation is required to process assets");

    if (compilation.chunks && Array.isArray(compilation.chunks)) {
      const path = ensurePath(compilation);
      const chunks = compilation.chunks.map(chunk => {
        const filename = chunk.files[0];
        return {
          name: chunk.name,
          filename,
          source: compilation.assets[filename].source(),
          path: path,
          get url() {
            return this.path.endsWith("/")
              ? `${this.path}${this.filename}`
              : `${this.path}/${this.filename}`;
          }
        };
      });

      const assets = Object.keys(compilation.assets)
        .filter(filename => {
          return !chunks.some(chunk => {
            return chunk.filename === filename;
          });
        })
        .map(filename => {
          return {
            filename,
            source: compilation.assets[filename].source()
          };
        });

      this.chunks = chunks.concat(assets).filter(chunk => !!chunk.filename);
    } else {
      this.chunks = [];
    }
  }
}

function ensurePath(compilation) {
  if (
    !compilation ||
    !compilation.mainTemplate ||
    !compilation.mainTemplate.outputOptions
  )
    return "/";

  return compilation.mainTemplate.outputOptions.publicPath || "/";
}

module.exports = CompiledChunks;
