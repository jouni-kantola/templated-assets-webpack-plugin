class Asset {
  constructor(name) {
    const _self = this;

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

    this.type = {
      get sync() {
        return !(this.async || this.defer || this.inline);
      },
      async: false,
      defer: false,
      inline: false
    };

    this.template = {
      _path: "",
      get path() {
        if (this._path) return this._path;

        const dir = __dirname + "/templates";

        if (_self.type.sync) return `${dir}/sync.tmpl`;
        if (_self.type.inline) return `${dir}/inline.tmpl`;

        if (_self.type.async && _self.type.defer)
          return `${dir}/async-defer.tmpl`;

        if (_self.type.async) return `${dir}/async.tmpl`;
        if (_self.type.defer) return `${dir}/defer.tmpl`;

        return `${dir}/sync.tmpl`;
      },
      set path(path) {
        if (!path || typeof path !== "string")
          throw new Error("Specify path to template (as string)");

        this._path = path;
      },
      _replace: "",
      get replace() {
        if (this._replace) return this._replace;

        const urlReplacement = "##URL##";

        if (_self.type.sync || _self.type.async || _self.type.defer)
          return urlReplacement;

        if (_self.type.inline) return "##SOURCE##";

        return urlReplacement;
      },
      set replace(replace) {
        if (!replace || typeof replace !== "string")
          throw new Error("Specify value in template to replace (as string)");

        this._replace = replace;
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
