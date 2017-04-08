class Asset {
  constructor(name) {
    if (typeof name !== "string")
      throw new Error("Asset name must be specified");

    this.file = {
      name: name,
      prefix: "",
      extension: "html",
      get filename() {
        return mergeFilename(this.prefix, this.name, this.extension);
      }
    };
  }
}

function mergeFilename(prefix, name, extension) {
  return `${prefix}${name}${singleDot(extension)}`;
}

function singleDot(value) {
  return `.${value}`.replace(/(\.)(?=\.*\1)/g, "");
}

module.exports = Asset;
