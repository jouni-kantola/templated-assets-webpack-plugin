"use strict";

const str = require("./string");

class CompiledChunk {
  constructor(name, filename, source, path = "") {
    this.name = name;
    this.filename = filename;
    this.source = source;
    this.path = path === "/" ? path : str.trimTrailing(path, "/");
  }

  get url() {
    return this.path
      ? `${str.trimTrailing(this.path, "/")}/${this.filename}`
      : this.filename;
  }

  get keep() {
    return !!this.filename;
  }
}

module.exports = CompiledChunk;
