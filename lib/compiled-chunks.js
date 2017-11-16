"use strict";

const is = require("is");
const CompiledChunk = require("./compiled-chunk");

class CompiledChunks {
  constructor(chunks, assets, publicPath) {
    if (!is.array(chunks)) {
      throw new TypeError("Compiled chunks required to continue process");
    }

    if (!is.object(assets)) {
      throw new TypeError("Compiled assets required to continue process");
    }

    const _chunks = chunks.map(chunk => {
      const filename = chunk.files[0];
      return new CompiledChunk(
        chunk.name,
        filename,
        assets[filename].source(),
        publicPath
      );
    });

    const _assets = Object.keys(assets)
      .filter(filename => {
        return !_chunks.some(chunk => {
          return chunk.filename === filename;
        });
      })
      .map(
        filename =>
          new CompiledChunk(
            undefined,
            filename,
            assets[filename].source(),
            publicPath
          )
      );

    this.chunks = _chunks.concat(_assets).filter(chunk => chunk.keep);
  }
}

module.exports = CompiledChunks;
