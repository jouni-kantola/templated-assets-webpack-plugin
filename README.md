# Templated Assets Webpack Plugin

[templated-assets-webpack-plugin](https://www.npmjs.com/package/templated-assets-webpack-plugin) is a webpack plugin for creating templated assets. I myself use it, first and foremost, for automating creation of partial views, when server-side rendering assets outputted by webpack (like referencing scripts and/or inlining assets). The plugin is applicable for enhancing webpack compiled assets, i.e. inlining webpack's manifest or chunk manifest (`manifest.json`).

[![Build Status](https://travis-ci.org/jouni-kantola/templated-assets-webpack-plugin.svg?branch=master)](https://travis-ci.org/jouni-kantola/templated-assets-webpack-plugin)

## Usage
The plugin takes a set of rules for defining how to template assets. Out of the box comes templates for script tags. The default templates included are for referencing scripts via URL (including support for async/defer) or inlining script's content.

### Install via npm/yarn
- `npm install templated-assets-webpack-plugin --save-dev`
- `yarn add templated-assets-webpack-plugin --dev`

### webpack.config.js
```javascript
const TemplatedAssetsWebpackPlugin = require("templated-assets-webpack-plugin");

const templatedAssetsConfig = {
    rules: [
        {
            // output webpack's runtime
            // inlined in script tag
            name: "manifest",
            output: {
                inline: true
            }
        }, //more rules go here
    ]
}

module.exports = {
  // your webpack config values here
  plugins: [
    // templated-assets-webpack-plugin matches chunk name
    new webpack.optimize.CommonsChunkPlugin({
      name: ["manifest"],
      minChunks: Infinity
    }),
    new TemplatedAssetsWebpackPlugin(templatedAssetsConfig)
  ]
};
```

### Rules
To create templated assets, a range of rules can be defined (at least one must be configured). Every rule is a separate object, but can be used to template multiple matching assets.

```javascript
// description of rule properties
// set either name (string || [string, string, ...]) OR test (/regex/)
name: "match-this-chunk-name",
name: ["chunk-name", "other-chunk-name"],
// if regex used for rule, filenames for assets will be matched instead of chunk names
test: /match-filename\.js$/,
// if exclude pattern given, matching filenames will be excluded from being templated
exclude: /^[0-9]+\./ // exclude async chunks

// template is the path to template or function to process source
// used for enhancing matching asset(s)
template: path.join(__dirname, "template-path/my-custom-template.tmpl"),
// custom source processor can be set for full control of processing source
template: (asset, callback, ...args) => {
    // filename: webpack's source file's asset filename
    // source: chunk's source
    // content: what the default processor would have turned the asset's content into
    // url: publicPath (or '/') + filename
    const { filename, source, content, url } = asset;

    // access rule specific args 
    const arguments = args;

    // process
    const updatedSource = myCustomSourceProcessor();

    // notify templated-assets-webpack-plugin when done
    // pass updated source back to output as asset
    callback(updatedSource);
},
// template can also be defined as object, with path and value to look for and replace
template: {
    path, // path to template
    replace // replace value in template with content from asset (see replace property for default values)
}

// when custom template used, what to lookup and replace in template can be configured
// if replace not defined
// * default for assets referenced by URL is `##URL`
// * default for inlined assets is `##SOURCE`
replace: "***IMPORTANT-STUFF***"

// pass custom arguments, accessible in custom source processor
args: []

// configure how to enhance the asset with `output`
output: {
    // asset filename name combined with webpack's `publicPath`
    url: true, // url asset is default, if other not configured
    // sync/async/defer/async+defer are included default with the plugin
    async: false,
    defer: false,
    // inline asset's source
    inline: false,
    // prefix output asset's filename
    prefix: "__",  // default: no prefix
    // if server-side templating engine's used, the asset's file extension can be controlled 
    extension: "txt", // default: html
    // specify folder(s) as output path for assets matching rule
    path: "a/directory", // default: no custom output directory
    path: ["first/output/directory", "create/copy/here"], // for duplicate output
    // configure if assets matching rule should be included in webpack's output
    // if `output.path` used, duplicate assets are created if emitAsset is true
    emitAsset: false // default: true
}
```

### Example build/config
Included in the repo is an [example build](https://github.com/jouni-kantola/templated-assets-webpack-plugin/blob/master/example/webpack.config.js) where various [configuration options](https://github.com/jouni-kantola/templated-assets-webpack-plugin/blob/master/example/templated-assets-config.js) are being used. Have a look and see if anything matches your needs.

The example build can be triggered when cloning the repo with `npm run example`. The build will i.e. output the file `__manifest.json.cshtml`. The file is a templated asset of `chunk-manifest-webpack-plugin`'s resulting `manifest.json`.

```html
<script type="text/javascript">window.webpackManifest={"0":"0.04df1ad6b72d121fd6ab.js","1":"1.652fb163ed4c79d993d0.js","2":"2.3a556c55f764acccb23a.js"}</script>
```

Template used looks like this:
```html
<script type="text/javascript">window.webpackManifest=##MANIFEST##</script>
```

## Feedback and/or updates
* For feedback, probably swiftest way to get in touch with me is with a tweet [@jouni_kantola](https://twitter.com/jouni_kantola). Please let me know what you think about the plugin and if you do any crazy cool stuff with it.
* For bugs and/or change requests, please use [Issues](https://github.com/jouni-kantola/templated-assets-webpack-plugin/issues).
