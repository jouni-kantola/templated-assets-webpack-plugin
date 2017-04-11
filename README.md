# Templated Assets Webpack Plugin

[templated-assets-webpack-plugin](https://www.npmjs.com/package/templated-assets-webpack-plugin) is a webpack plugin for creating templated assets. I myself use it first and foremost for creating partial views when server-side rendering assets outputted by webpack, like referencing scripts and/or inlining assets. The plugin is applicable for enhancing extracted assets from the webpack compilation, i.e. webpack's manifest or chunk manifest (`manifest.json`).

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
  // your config values here
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
To create templated assets, a range of rules can be defined (at least one must be configured), where every rule is a separate object, but can be used to template multiple matching assets.

```javascript
// description of rule properties
// set either name (string || [string, string, ...]) or test (/regex/)
name: "match-this-chunk-name",
name: ["chunk-name", "other-chunk-name"],
// if regex used for rule, filenames for assets will be matched instead of chunk names
test: /match-filename\.js$/ 

// template is the path to template or function to process source, to be used for enhancing matching asset(s)
template: path.join(__dirname, "template-path/my-custom-template.tmpl"),
template: (source, filename, callback) => {
    const updatedSource = myCustomSourceProcessor();
    callback(updatedSource);
},
// template can also be defined as object, with path and value to look for and replace
template: {
    path, // path to template
    replace // replace this in template with content from asset (see replace property for default values)
}

// when own template used, what to replace in template can also be configured
 // if replace not defined
 // - default for assets referenced by URL is `##URL`
 // - default for inlined assets is `##SOURCE`
replace: "***IMPORTANT-STUFF***`

// configure how to enhance the asset with `output` (or combine with own source processor)
output: {
    url: true, // url asset is default if not configured. takes the file name and combines with webpack's config `publicPath`
     // async/defer/async+defer (and sync, as well) are included default with the plugin
    async: false,
    defer: false,
    inline: false, // inline asset source
    prefix: "__", // prefix asset's filename (default is no prefix)
    extension: "txt" // if a server-side templating engine is used, this property can be used to control the enhanced assets file extension
}
```

### Example build/config
Included in the repo is an [example build](https://github.com/jouni-kantola/templated-assets-webpack-plugin/blob/master/example/webpack.config.js) where various [configuration options](https://github.com/jouni-kantola/templated-assets-webpack-plugin/blob/master/example/templated-assets-config.js) are used. Have a look and see if anything matches your needs.

The example build can be triggered when cloning the repo with `npm run example`. The build will i.e. output the file `__manifest.json.cshtml`. The file is a templated asset for `chunk-manifest-webpack-plugin`'s resulting `manifest.json`.
```html
<script type="text/javascript">window.webpackManifest={"0":"0.04df1ad6b72d121fd6ab.js","1":"1.652fb163ed4c79d993d0.js","2":"2.3a556c55f764acccb23a.js"}</script>
```

Template used looks like this:
```html
<script type="text/javascript">window.webpackManifest=##MANIFEST##</s`ript>
```

## Feedback and/or updates
* For feedback, probably fastest way to get in touch with me is with a tweet [@jouni_kantola](https://twitter.com/jouni_kantola). Please let me know what you think about the plugin and if you do any crazy cool stuff with it.
* For bugs and/or change requests, please use [Issues](https://github.com/jouni-kantola/templated-assets-webpack-plugin/issues).
