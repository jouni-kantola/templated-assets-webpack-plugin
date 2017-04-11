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
      name: "vendor",
      output: {
        inline: true
      },
      template: (source, filename, callback) => {
        const updatedSource = `// source from ${filename}
        ${source}`;
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
