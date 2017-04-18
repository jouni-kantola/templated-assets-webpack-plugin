const path = require("path");

const webpack = require("webpack");
const ChunkManifestPlugin = require("chunk-manifest-webpack-plugin");

const TemplatedAssetWebpackPlugin = require("../");
const templatedAssetsConfig = require("./templated-assets-config.js");

const publicPath = "https://test-cdn.com/assets";

module.exports = {
  entry: {
    vendor: ["babel-polyfill", "is-thirteen"],
    app: path.join(__dirname, "app.js")
  },
  resolve: {
    modules: ["node_modules"]
  },
  output: {
    path: path.join(__dirname, "dist"),
    publicPath: publicPath,
    filename: "[name].[chunkhash].js"
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: {
          loader: "babel-loader"
        }
      }
    ]
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin({
      name: ["vendor", "manifest"],
      minChunks: Infinity
    }),
    new webpack.HashedModuleIdsPlugin(),
    new ChunkManifestPlugin(),
    new webpack.SourceMapDevToolPlugin({
      filename: "[file].map",
      exclude: ["manifest"],
      append: `\n//# sourceMappingURL=${publicPath}/[url]\n`
    }),
    new TemplatedAssetWebpackPlugin(templatedAssetsConfig)
  ]
};
