const path = require("path");

module.exports = {
  rules: [
    {
      name: ["app"],
      output: {
        defer: true
      }
    },
    {
      test: /vendor.*\.js$/,
      // in supported version of Node.js use:
      // template: (asset, callback, ...args) => {
      template: function customSourceProcessor(asset, callback) {
        const args = arguments.length > 2 &&
          Array.prototype.slice.call(arguments, 2);

        const updatedSource = `// built with webpack and ${args.join("-")}
        // source from ${asset.filename} to ${asset.url}
        // default templating would have resulted in ${asset.content}
        ${asset.source}`;
        callback(updatedSource);
      },
      args: ["templated", "assets", "webpack", "plugin"]
    },
    {
      name: "manifest",
      output: {
        inline: true,
        path: path.join(__dirname, "dist/custom/"),
        emitAsset: false
      },
      template: path.join(__dirname, "tmpl/inline.tmpl"),
      replace: "##HULAHULA##"
    },
    {
      test: /manifest.json$/,
      template: path.join(__dirname, "tmpl/chunk-manifest.tmpl"),
      replace: "##MANIFEST##",
      output: {
        inline: true,
        prefix: "__",
        extension: "cshtml"
      }
    }
  ]
};
