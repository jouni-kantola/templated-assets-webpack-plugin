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

    this.source = {
      chunks,
      assets
    };

    this.publicPath = publicPath;
  }

  get chunks() {
    const compiledChunks = this._toChunkMap(
      this.source.chunks
        .map(chunk => ({ name: chunk.name, filename: chunk.files[0] }))
        .map(chunk => this._createChunk(chunk.filename, chunk.name))
    );

    Object.assign(
      compiledChunks,
      this._toChunkMap(
        Object.keys(this.source.assets)
          .filter(filename => !compiledChunks[filename])
          .map(filename => this._createChunk(filename))
      )
    );

    return Object.keys(compiledChunks)
      .map(filename => compiledChunks[filename])
      .filter(compiledChunk => compiledChunk.keep);
  }

  _toChunkMap(chunks) {
    return chunks.reduce((chunkMap, compiledChunk) => {
      chunkMap[compiledChunk.filename] = compiledChunk;

      return chunkMap;
    }, {});
  }

  _createChunk(filename, name) {
    const source = this._getSource(filename);
    const publicPath = this.publicPath;
    return new CompiledChunk(name, filename, source, publicPath);
  }

  _getSource(filename) {
    return this.source.assets[filename].source();
  }
}

module.exports = CompiledChunks;
