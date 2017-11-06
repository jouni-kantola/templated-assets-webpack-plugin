"use strict";

class AssetSource {
  constructor(filename, source) {
    if (typeof filename !== "string")
      throw new TypeError("Source filename must be specified");

    this.filename = filename;
    this.ext = filename.split(".").pop();
    this.source = source || "";
  }
}

module.exports = AssetSource;
