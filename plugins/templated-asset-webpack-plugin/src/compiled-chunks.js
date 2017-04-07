"use strict";

class CompiledChunks {
  constructor(compilation) {
    if (!compilation)
      throw new Error("webpack compilation is required to process assets");

    if (compilation.chunks && Array.isArray(compilation.chunks)) {
      this.chunks = compilation.chunks.map(chunk => {
        const filename = chunk.files[0];
        return {
          name: chunk.name,
          filename,
          source: compilation.assets[filename].source()
        };
      });
    } else {
      this.chunks = [];
    }
  }
}

module.exports = CompiledChunks;
