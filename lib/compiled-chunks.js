"use strict";

class CompiledChunks {
  constructor(chunks, assets, publicPath) {
    if (!chunks || !Array.isArray(chunks)) {
      throw new TypeError("Compiled chunks required to continue process");
    }

    if (!assets || typeof assets != "object") {
      throw new TypeError("Compiled assets required to continue process");
    }

    const _chunks = chunks.map(chunk => {
      const filename = chunk.files[0];
      return {
        name: chunk.name,
        filename,
        source: assets[filename].source(),
        path: publicPath || "/",
        get url() {
          return this.path.endsWith("/")
            ? `${this.path}${this.filename}`
            : `${this.path}/${this.filename}`;
        }
      };
    });

    const _assets = Object.keys(assets)
      .filter(filename => {
        return !_chunks.some(chunk => {
          return chunk.filename === filename;
        });
      })
      .map(filename => {
        return {
          filename,
          source: assets[filename].source(),
          path: publicPath || "/",
          get url() {
            return this.path.endsWith("/")
              ? `${this.path}${this.filename}`
              : `${this.path}/${this.filename}`;
          }
        };
      });

    this.chunks = _chunks.concat(_assets).filter(chunk => !!chunk.filename);
  }
}

module.exports = CompiledChunks;
