# Templated Assets Webpack Plugin

[templated-assets-webpack-plugin](https://www.npmjs.com/package/templated-assets-webpack-plugin) is a plugin for using webpack generated assets with server rendered web frameworks.

![Build Status](https://github.com/jouni-kantola/templated-assets-webpack-plugin/workflows/Node.js%20CI/badge.svg)

## Versions and compatibility

* v4 for Rspack and webpack 5+
* v3 for webpack v2-5

## TL;DR

If you need to reference webpack generated assets server-side, then `templated-assets-webpack-plugin` aim to make that process easier. Here's a configuration based on [webpack's caching docs](https://webpack.js.org/guides/caching/):

```javascript
const path = require("path");
const TemplatedAssetsWebpackPlugin = require("templated-assets-webpack-plugin");

module.exports = {
  entry: {
    app: path.join(__dirname, "index.js")
  },
  output: {
    filename: "[name].[contenthash].js"
  },
  plugins: [
    new TemplatedAssetsWebpackPlugin({
      rules: [
        {
          name: ["app", "vendors"]
        },
        {
          name: "runtime",
          output: {
            inline: true
          }
        }
      ]
    })
  ],
  optimization: {
    runtimeChunk: "single",
    splitChunks: {
      cacheGroups: {
        defaultVendors: {
          test: /[\\/]node_modules[\\/]/,
          name: "vendors",
          chunks: "all"
        }
      }
    }
  }
};
```

## Use cases

The plugin aims to be unopinionated and cover a broad range of use cases, but specifically the following:

- When hashing webpack's assets, generate partial views for server rendered web frameworks (like ASP.NET or Express), with webpack's hashes intact. This is achieved by using predefined templates (built-in or custom) to wrap webpack's output.
- Wrap webpack built assets in HTML tags. Generate assets with CSS inlined for critical path rendering, or include webpack's runtime (AKA manifest) server-side.
- Generate extended assets by applying the source to predefined or custom templates, or a template engine.

## Installation

- `npm install templated-assets-webpack-plugin --save-dev`
- `yarn add templated-assets-webpack-plugin --dev`

## Configuration

`templated-assets-webpack-plugin` takes a set of rules for defining how to wrap assets. Out of the box, comes templates for inlining or referencing scripts and styles.

### Rules

Processing webpack's assets is enabled by specifying `rules` for mapping asset(s) to a template. Rules are given as arguments when initializing `templated-assets-webpack-plugin`. Each rule can _match and template multiple assets_. Next section describes rule options.

### Match assets

Use `name` or `test` to match assets to be templated by name or filename. One of them is required to be specified. If both are used, `test` takes precedence. Use `exclude` if you want to filter out webpack built assets from being processed.

| Property  | Type         | Default value | Description             |
| --------- | ------------ | ------------- | ----------------------- |
| `name`    | string/Array | N/A           | Match asset by name     |
| `test`    | RegExp       | N/A           | Match asset by filename |
| `exclude` | RegExp       | none          | Filter out assets       |

```javascript
// match asset name (string|Array)
name: "match-this-chunk-name",
name: ["chunk-name", "other-chunk-name"],
// or match asset filename (regex)
test: /match-filename\.js$/,
// exclude (regex) assets from being templated; tests filename
exclude: /^[0-9]+\./
```

### Define templates

The plugin's shipped with built-in templates for linking or inlining scripts and styles. Therefor, the `template` property isn't required, but enables customization. If the template property is specified as function, you're given full control of how to process assets. `template` can also be defined as an object, which adds functionality for adding header and/or footer.

| Property   | Type                   | Default value          | Description                      |
| ---------- | ---------------------- | ---------------------- | -------------------------------- |
| `template` | string/object/function | script/link tag        | Template for wrapping asset      |
| `replace`  | string/RegExp          | `##URL##`/`##SOURCE##` | Placeholder for asset url/source |
| `args`     | Array                  | []                     | Extra args to template function  |

```javascript
// path to custom template (string)
// not required, defaults to built-in templates
template: path.join(__dirname, "template-path/my-custom-template.tmpl"),
// or granually define template specifics
template: {
  // path to custom template (string)
  // not required, defaults to built-in templates
  path: path.join(__dirname, "template-path/my-custom-template.tmpl"),
  // find placeholder/content in template for subsitution with asset url/source (regex|string)
  // not required, defaults to ##URL## or ##SOURCE##
  replace: "***REPLACE-THIS***",
  // if specified, prepends header to templated asset (string|function)
  header: "<!-- PREPEND THIS -->",
  // if specified, appends footer to templated asset (string|function)
  footer: () => "<!-- APPEND THIS -->"
},
// or full control of templating asset (function)
template: (asset, callback, ...args) => {
  const {
    // source asset filename
    filename,
    // asset source
    source,
    // built-in processor's result
    content,
    // url: url to asset, including publicPath (or "/")
    url
  } = asset;

  // rule specific args
  const ruleArgs = args;

  // example asset templating
  const templatedAsset = processCustom();

  // notify done with templated asset (string)
  callback(templatedAsset);
},
// if specified, arguments to custom templating function
args: [],
// find placeholder/content in template for subsitution with asset url/source (regex|string)
// not required, defaults to ##URL## or ##SOURCE##
// note: if `template.replace` specified, template object's `replace` takes precedence
replace: "***REPLACE-THIS***"
```

### Templated asset output

When templated assets are created its contents can either contain the source of a webpack compiled asset or an URL to the asset. Which used is defined in the `output` property. To align with frameworks for server rendering, the generated templated asset's filename can be updated with `name`, `prefix` and `extension`. If needed, custom output locations can be set.

| Property | Type   | Default value                         | Description                |
| -------- | ------ | ------------------------------------- | -------------------------- |
| `output` | object | Partial HTML files with URL reference | Asset type and file output |

```javascript
// configure templated asset output
// not required, default included in webpack's output with assets referenced by URL
output: {
  // assign name to templated asset (default: chunk name/filename)
  // useful when chunk name has not been assigned in webpack
  name: "a-templated-asset",
  name: (defaultName) => defaultName.split(".")[0],
  // prefix templated asset's filename (default: no prefix)
  prefix: "__",
  // templated asset's file extension (default: html)
  extension: "cshtml",
  // URL referencing a webpack asset (including `publicPath`)
  url: true,
  // include async attribute (default: false)
  async: false,
  // include defer attribute (default: false)
  defer: false,
  // link asset with nomodule attribute (default: false)
  nomodule: false,
  // link module asset (default: false)
  module: false,
  // inline asset's source (default: false)
  // takes precedence over reference by URL
  inline: false,
  // include templated asset in webpack's default output (default: true)
  emitAsset: false,
  // output folder(s) for templated assets
  // duplicate asset created if `emitAsset` is true
  path: "a/directory",
   // output to multiple folders
  path: ["first/output/directory", "create/copy/here"]
}
```

## Plugin examples

To get up to speed quicker with plugin configuration, take a look at an [example build](https://github.com/jouni-kantola/templated-assets-webpack-plugin/blob/master/example/webpack.config.js) where various [rules](https://github.com/jouni-kantola/templated-assets-webpack-plugin/blob/master/example/templated-assets-config.js) are used.

Try the build by executing `npm run example`. Included are rules for e.g. inlining webpack's runtime and custom templating for webpack's chunk manifest.

## Feedback

- For feedback, bugs or change requests, please use [Issues](https://github.com/jouni-kantola/templated-assets-webpack-plugin/issues).
