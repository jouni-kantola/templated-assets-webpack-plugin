"use strict";

class CompiledChunks {
  constructor(compilation) {
    if (!compilation)
      throw new Error("webpack compilation is required to process assets");

    if (compilation.chunks && Array.isArray(compilation.chunks)) {
      const chunks = compilation.chunks.map(chunk => {
        const filename = chunk.files[0];
        return {
          name: chunk.name,
          filename,
          source: compilation.assets[filename].source()
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

module.exports = CompiledChunks;
