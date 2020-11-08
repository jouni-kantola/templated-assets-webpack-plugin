"use strict";

const io = require("./file-io");
const str = require("./string");
const AssetSource = require("./asset-source");

class Asset {
  constructor(name, source, url, args) {
    if (typeof name !== "string")
      throw new TypeError("Asset name must be specified");

    if (!(source instanceof AssetSource))
      throw new TypeError("Asset source must be specified");

    if (typeof url !== "string")
      throw new TypeError(`Required argument URL is missing for ${name}`);

    const _self = this;

    this.source = source;

    this.url = url;

    this.args = args;

    this.file = {
      name: name,
      _prefix: "",
      get prefix() {
        return this._prefix;
      },
      set prefix(prefix) {
        if (typeof prefix !== "string") return;
        this._prefix = prefix;
      },
      _extension: "html",
      get extension() {
        return this._extension;
      },
      set extension(ext) {
        if (typeof ext !== "string" || ext === "") return;
        this._extension = ext;
      },
      get filename() {
        return mergeFilename(this.prefix, this.name, this.extension);
      }
    };

    this.type = {
      get sync() {
        return !(
          this.async ||
          this.defer ||
          this.inline ||
          this.module ||
          this.nomodule
        );
      },
      async: false,
      defer: false,
      inline: false,
      module: false,
      nomodule: false
    };

    this.template = {
      _path: "",
      get path() {
        if (this._path) return this._path;

        const dir = __dirname + "/templates";

        if (_self.source.ext === "css") {
          if (_self.type.inline) return `${dir}/inline-style.tmpl`;
          return `${dir}/link-style.tmpl`;
        } else {
          const { module, nomodule, inline, async, defer } = _self.type;
          if (module) return `${dir}/module.tmpl`;
          if (nomodule) return `${dir}/nomodule.tmpl`;
          if (inline) return `${dir}/inline.tmpl`;
          if (async && defer) return `${dir}/async-defer.tmpl`;
          if (async) return `${dir}/async.tmpl`;
          if (defer) return `${dir}/defer.tmpl`;
        }

        return `${dir}/sync.tmpl`;
      },
      set path(path) {
        if (!!path && typeof path !== "string")
          throw new TypeError("Specify path to template (string)");

        this._path = path;
      },
      /**
       * @type {string | RegExp}
       */
      _replace: "",
      get replace() {
        if (this._replace) return new RegExp(this._replace);

        const urlReplacement = new RegExp("##URL##");

        if (_self.type.inline) return new RegExp("##SOURCE##");

        return urlReplacement;
      },
      set replace(replace) {
        if (
          !replace ||
          (typeof replace !== "string" && !(replace instanceof RegExp))
        )
          throw new Error(
            "Specify value in template to replace (string || RegExp)"
          );

        this._replace = replace;
      },
      _header: "",
      get header() {
        return typeof this._header === "function"
          ? this._header()
          : this._header;
      },
      set header(header) {
        this._header = header;
      },
      _footer: "",
      get footer() {
        return typeof this._footer === "function"
          ? this._footer()
          : this._footer;
      },
      set footer(footer) {
        this._footer = footer;
      }
    };

    this.output = {
      _path: [],
      get useDefault() {
        return this._path.length === 0;
      },
      get path() {
        return this._path;
      },
      set path(path) {
        if (!path) return;
        if (typeof path !== "string" && !Array.isArray(path))
          throw new TypeError(
            "Specify output path(s); string or Array (for multiple copies)"
          );

        if (path === "") {
          this._path = [];
        } else if (Array.isArray(path)) {
          this._path = path.map(removeTrailingSlash);
        } else {
          this._path = [removeTrailingSlash(path)];
        }
      },
      _emitAsset: true,
      get emitAsset() {
        return this._emitAsset;
      },
      set emitAsset(emitAsset) {
        if (typeof emitAsset !== "boolean") return;
        this._emitAsset = emitAsset;
      }
    };
  }

  get content() {
    return this.type.inline ? this.source.source : this.url;
  }

  process() {
    return new Promise((resolve, reject) => {
      if (this.template.process) {
        this.processExternal(resolve, reject);
      } else {
        return this.processTemplate(resolve, reject);
      }
    });
  }

  processTemplate(resolve, reject) {
    return io.read(this.template.path).then(content => {
      const replacedContent = content.replace(
        this.template.replace,
        this.content
      );

      if (content === replacedContent) {
        reject(
          `No replacement done in template. Check rule configuration.
${content}`
        );
      }

      const header =
        this.template.header && `${this.template.header}${str.EOL}`;
      const footer =
        this.template.footer && `${str.EOL}${this.template.footer}`;
      const enclosedContent = str.append(
        str.prepend(replacedContent, header),
        footer
      );

      write(this.output.path, this.file.filename, enclosedContent);

      resolve({
        emitAsset: this.output.emitAsset,
        filename: this.file.filename,
        source: enclosedContent
      });
    });
  }

  processExternal(resolve, reject) {
    const output = replacedContent => {
      write(this.output.path, this.file.filename, replacedContent);

      resolve({
        emitAsset: this.output.emitAsset,
        filename: this.file.filename,
        source: replacedContent
      });
    };

    return io.read(this.template.path).then(content => {
      const replacedContent = content.replace(
        this.template.replace,
        this.content
      );

      const args = Array.isArray(this.args) ? this.args : [];

      try {
        this.template.process.apply(
          this.template.process,
          [
            {
              filename: this.source.filename,
              source: this.source.source,
              content: replacedContent,
              url: this.url
            },
            output
          ].concat(args)
        );
      } catch (error) {
        reject(
          `Templating unsuccessful for ${this.file.filename}:
              ${JSON.stringify(this.template)}
              ${error}`
        );
      }
    });
  }
}

function write(paths, filename, content) {
  if (!paths.useDefault) {
    paths
      .map(path => `${path}/${filename}`)
      .forEach(filePath => io.write(filePath, content));
  }
}

function mergeFilename(prefix, name, extension) {
  const cleanFileExtension = str.keepSingle(`.${extension}`, ".");
  return str.merge(prefix, name, cleanFileExtension);
}

function removeTrailingSlash(path) {
  return str.trimTrailing(path, "/");
}

module.exports = Asset;
