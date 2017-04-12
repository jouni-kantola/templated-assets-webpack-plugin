"use strict";

const templateReader = require("./template-reader");

class Asset {
  constructor(name, source) {
    if (typeof name !== "string")
      throw new Error("Asset name must be specified");

    if (!source || !source.content || !source.filename)
      throw new Error(
        `Asset source must be specified, including content and filename. Specified source:
        ${JSON.stringify(source)}`
      );

    const _self = this;

    this.source = source;

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
        if (this._replace) return new RegExp(this._replace);

        const urlReplacement = new RegExp("##URL##");

        if (_self.type.sync || _self.type.async || _self.type.defer)
          return urlReplacement;

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
      }
    };
  }

  process() {
    return new Promise((resolve, reject) => {
      if (this.template.process) {
        try {
          this.template.process(
            this.source,
            replacedContent => {
              resolve({
                filename: this.file.filename,
                source: replacedContent,
                size: replacedContent.length
              });
            }
          );
        } catch (e) {
          reject(
            `Templating unsuccessful for:
          ${JSON.stringify(this.template)}
          Error:
          ${e}`
          );
        }
      } else {
        return templateReader.read(this.template.path).then(content => {
          const replacedContent = content.replace(
            this.template.replace,
            this.source.content
          );

          if (content === replacedContent) {
            reject(
              `No replacement done in template. Check rule configuration.\n${content}`
            );
          }

          resolve({
            filename: this.file.filename,
            source: replacedContent,
            size: replacedContent.length
          });
        });
      }
    });
  }
}

function mergeFilename(prefix, name, extension) {
  return `${prefix}${name}${singleDot(extension)}`;
}

function singleDot(value) {
  return `.${value}`.replace(/(\.)(?=\.*\1)/g, "");
}

module.exports = Asset;
