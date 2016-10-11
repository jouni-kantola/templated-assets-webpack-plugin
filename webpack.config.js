const path = require("path");

const webpack = require("webpack");
const ChunkManifestPlugin = require("chunk-manifest-webpack-plugin");

module.exports = {
  entry: {
    vendor: ["babel-polyfill", "is-thirteen"],
    app: "./example/app.js"
  },
  resolve: {
    modules: [path.join(__dirname, "src"), "node_modules"]
  },
  output: {
    path: path.join(__dirname, "dist"),
    //publicPath: '/',
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
    new ChunkManifestPlugin()
  ]
};
