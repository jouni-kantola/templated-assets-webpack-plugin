const path = require("path");

const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const TemplatedAssetsWebpackPlugin = require("../");
const templatedAssetsConfig = require("./templated-assets-config.js");

module.exports = {
  entry: {
    app: path.join(__dirname, "app.js")
  },
  output: {
    path: path.join(__dirname, "dist"),
    publicPath: "https://test-cdn.com/assets",
    filename: "[name].[contenthash].js"
  },
  optimization: {
    runtimeChunk: "single",
    splitChunks: {
      cacheGroups: {
        defaultVendors: {
          test: /[\\/]node_modules[\\/]/,
          name: "vendors",
          chunks: "all"
        },
        defaultStyles: {
          name: "styles",
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
        use: "babel-loader"
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
    new MiniCssExtractPlugin({
      filename: "[name].css",
      ignoreOrder: false
    }),
    new TemplatedAssetsWebpackPlugin(templatedAssetsConfig)
  ]
};
