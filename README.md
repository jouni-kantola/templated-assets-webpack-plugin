# Templated Assets Webpack Plugin

[templated-assets-webpack-plugin](https://www.npmjs.com/package/templated-assets-webpack-plugin) is a webpack plugin for augmenting webpack generated assets. This is achieved by using built-in or custom templates to extend webpack's output. The plugin also supports running custom source processors (i.e. using a template engine).

## Use cases
- Generate partial views, for server-side rendering assets outputted by webpack (like referencing scripts and/or inlining assets)
- Enhancing webpack's compiled assets, i.e. inlining webpack's manifest and/or chunk manifest (`manifest.json`)
- Use template literals or template engine to augment webpack's assets 

[![Build Status](https://travis-ci.org/jouni-kantola/templated-assets-webpack-plugin.svg?branch=master)](https://travis-ci.org/jouni-kantola/templated-assets-webpack-plugin)

## Usage
`templated-assets-webpack-plugin` takes a set of rules for defining how to template assets. Out of the box, comes templates for script tags. The default templates are for inlining scripts or referencing with URL (including async/defer).

## Installation
- `npm install templated-assets-webpack-plugin --save-dev`
- `yarn add templated-assets-webpack-plugin --dev`

## Configuration
webpack's assets can either be targeted by name or filename. Below is an example for inlining webpack's runtime (commonly called 'manifest').

### webpack.config.js
```javascript
const TemplatedAssetsWebpackPlugin = require("templated-assets-webpack-plugin");

const templatedAssetsConfig = {
    rules: [
        {
            // output webpack's runtime inlined in script tag
            name: "manifest",
            output: {
                inline: true
            }
        }
    ]
}

module.exports = {
  /* webpack config values */
  plugins: [
    // templated-assets-webpack-plugin match chunk name
    new webpack.optimize.CommonsChunkPlugin({
      name: ["manifest"],
      minChunks: Infinity
    }),
    new TemplatedAssetsWebpackPlugin(templatedAssetsConfig)
  ]
};
```

### Rules
To create templated assets, a *range of rules* can be defined (at least one must be configured). Every rule is a separate object, but can be *used to match and template multiple assets*. Below follow descriptions for the properties that can be specified for the plugin's rules.

```javascript
// set either name (string || [string, string, ...]) OR test (/regex/)
name: "match-this-chunk-name",
name: ["chunk-name", "other-chunk-name"],
// if regex used for rule, asset filenames will be matched instead of names
test: /match-filename\.js$/,
// filenames matching exclude pattern will be excluded from being templated
exclude: /^[0-9]+\./ // example: exclude async chunks

// augment matching assets
// the template property is used to specify path to a custom template
template: path.join(__dirname, "template-path/my-custom-template.tmpl"),
// or template can be defined as object
template: {
    path, // path to template
    replace, // replace value in template with asset's content (see replace property for default values)
    header, // prepend header to templated asset (string|function)
    footer // append footer to templated asset (string|function)
},
// or for full control of processing, you can process asset's source by specifying a function 
template: (asset, callback, ...args) => {
    // argument `asset` includes:
    // filename: source asset filename
    // source: chunk's source
    // content: plugin's built-in processor's result
    // url: publicPath (or '/') with filename
    const { filename, source, content, url } = asset;

    // custom rule specific args 
    const arguments = args;

    // example LoC for processing the asset
    const updatedSource = myCustomSourceProcessor();

    // when done, pass updated asset back to be included in webpack's output
    callback(updatedSource);
}

// pass custom arguments (accessible in custom source processor)
args: []

// when custom template specified, configure what to search and replace
// * default for assets referenced by URL is `##URL`
// * default for inlined assets is `##SOURCE`
replace: "***IMPORTANT-STUFF***"

// configure how to output the augmented asset
// sync/async/defer/async+defer are included with the plugin
output: {
    // output type URL is default, if other not configured
    url: true, // asset's filename combined with webpack's `publicPath`
    async: false, // like url, including async attribute
    defer: false, // like url, including defer attribute
    // inline asset's source, instead of referencing asset by URL
    inline: false,
    // configure if assets should be included in webpack's default output
    emitAsset: false, // default: true
    // prefix output templated asset's filename
    prefix: "__",  // default: no prefix
    // control templated asset's file extension (i.e. for server-side template engine)
    extension: "cshtml", // default: html
    // specify output folder(s) for generated assets
    // duplicate assets created if `emitAsset` is true
    path: "a/directory", // default: webpack's output directory
    path: ["first/output/directory", "create/copy/here"] // duplicate output
}
```

## Example configuration
Included in the repo is an [example build](https://github.com/jouni-kantola/templated-assets-webpack-plugin/blob/master/example/webpack.config.js) where various [configuration options](https://github.com/jouni-kantola/templated-assets-webpack-plugin/blob/master/example/templated-assets-config.js) are used.

The example build is triggered by executing `npm run example`. The build will i.e. output the file `__manifest.json.cshtml`, which is a templated asset for `chunk-manifest-webpack-plugin`'s resulting `manifest.json`.

```html
<script type="text/javascript">window.webpackManifest={"0":"0.04df1ad6b72d121fd6ab.js","1":"1.652fb163ed4c79d993d0.js","2":"2.3a556c55f764acccb23a.js"}</script>
```

Custom template used:
```html
<script type="text/javascript">window.webpackManifest=##MANIFEST##</script>
```

## Feedback and/or updates
* For feedback, bugs or change requests, please use [Issues](https://github.com/jouni-kantola/templated-assets-webpack-plugin/issues).
* For direct contact, tweet [@jouni_kantola](https://twitter.com/jouni_kantola).
