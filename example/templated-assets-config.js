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
      template: (asset, callback) => {
        const updatedSource = `// source from ${asset.filename} to ${asset.url}
        // default templating would have resulted in ${asset.content}
        ${asset.source}`;
        callback(updatedSource);
      }
    },
    {
      name: "manifest",
      output: {
        inline: true
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
