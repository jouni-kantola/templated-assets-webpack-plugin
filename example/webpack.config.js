const path = require("path");

const webpack = require("webpack");
const ChunkManifestPlugin = require("chunk-manifest-webpack-plugin");

const TemplatedAssetWebpackPlugin = require("../");
const templatedAssetsConfig = require("./templated-assets-config.js");

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
    //publicPath: "https://test-cdn.com/assets",
    filename: "[name].[chunkhash].js"
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [["env", { modules: false }]],
            plugins: ["syntax-dynamic-import"]
          }
        }
      }
    ]
  },
  devtool: "source-map",
  plugins: [
    new webpack.optimize.CommonsChunkPlugin({
      name: ["vendor", "manifest"],
      minChunks: Infinity
    }),
    new webpack.HashedModuleIdsPlugin(),
    new ChunkManifestPlugin(),
    new TemplatedAssetWebpackPlugin(templatedAssetsConfig)
  ]
};
