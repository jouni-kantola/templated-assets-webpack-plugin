"use strict";

const str = require("./string");

class CompiledChunk {
  constructor(name, filename, source, path) {
    this.name = name;
    this.filename = filename;
    this.source = source;
    this.path = path || "/";
  }

  get url() {
    return `${str.trimTrailing(this.path, "/")}/${this.filename}`;
  }

  get keep() {
    return !!this.filename;
  }
}

module.exports = CompiledChunk;
