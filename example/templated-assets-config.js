const path = require("path");

module.exports = {
  rules: [
    {
      name: ["app"],
      exclude: /(node_modules)/,
      url: true,
      defer: true
    },
    {
      name: "vendor",
      exclude: /(node_modules)/,
      url: true,
      async: true,
      defer: true
    },
    {
      name: "manifest",
      exclude: /(node_modules)/,
      inline: true,
      template: path.join(__dirname, "tmpl/inline.tmpl"),
      replace: "##HULAHULA##"
    },
    {
      test: /manifest.json$/,
      exclude: /(node_modules)/,
      inline: true,
      template: path.join(__dirname, "tmpl/chunk-manifest.tmpl"),
      replace: "##MANIFEST##",
      output: {
        prefix: "__",
        extension: "cshtml"
      }
    }
  ]
};
