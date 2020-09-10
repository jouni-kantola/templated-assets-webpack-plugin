const path = require("path");

module.exports = {
  rules: [
    {
      test: /app.*\.js$/,
      output: {
        defer: true
      }
    },
    {
      test: /\.css$/,
      template: {
        header: "<!-- css starts here -->",
        footer: () => "<!-- css ends here -->"
      },
      output: {
        name: defaultName => defaultName.split(".")[0]
      }
    },
    {
      name: ["vendors"],
      // in supported version of Node.js use:
      // template: (asset, callback, ...args) => {
      template: function customSourceProcessor(asset, callback) {
        const args =
          arguments.length > 2 && Array.prototype.slice.call(arguments, 2);

        const updatedSource = `// built with webpack and ${args.join("-")}
        // source from ${asset.filename} to ${asset.url}
        // default templating would have resulted in ${asset.content}
        ${asset.source}`;
        callback(updatedSource);
      },
      args: ["templated", "assets", "webpack", "plugin"]
    },
    {
      name: "runtime",
      output: {
        inline: true,
        path: path.join(__dirname, "dist/custom/"),
        emitAsset: false
      },
      template: path.join(__dirname, "tmpl/inline.tmpl"),
      replace: "##HULAHULA##"
    }
  ]
};
