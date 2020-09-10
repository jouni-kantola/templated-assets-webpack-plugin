const path = require("path");

const webpack = require("webpack");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const TemplatedAssetWebpackPlugin = require("../");
const templatedAssetsConfig = require("./templated-assets-config.js");

const publicPath = "https://test-cdn.com/assets";

module.exports = {
  entry: {
    vendor: ["is-thirteen"],
    app: path.join(__dirname, "app.js")
  },
  resolve: {
    modules: ["node_modules"]
  },
  output: {
    path: path.join(__dirname, "dist"),
    publicPath: publicPath,
    filename: "[name].[contenthash].js"
  },
  optimization: {
    moduleIds: "deterministic",
    runtimeChunk: "single",
    splitChunks: {
      cacheGroups: {
        common: {
          test: /[\\/]node_modules[\\/]/,
          name: "my-vendors",
          chunks: "all"
        },
        styles: {
          name: "my-styles",
          test: /\.css$/,
          chunks: "all",
          enforce: true
        }
      }
    }
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: {
          loader: "babel-loader"
        }
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader
          },
          "css-loader"
        ]
      }
    ]
  },
  plugins: [
    new webpack.SourceMapDevToolPlugin({
      filename: "[file].map",
      exclude: ["manifest"],
      append: `\n//# sourceMappingURL=${publicPath}/[url]\n`
    }),
    new MiniCssExtractPlugin({
      filename: "[name].css",
      ignoreOrder: false
    }),
    new TemplatedAssetWebpackPlugin(templatedAssetsConfig)
  ]
};
