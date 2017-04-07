const path = require("path");

const webpack = require("webpack");
const ChunkManifestPlugin = require("chunk-manifest-webpack-plugin");

const TemplatedAssetWebpackPlugin = require("./plugins/templated-asset-webpack-plugin");

const TemplatedAssetWebpackPluginRules = [
  {
    name: "app",
    exclude: /(node_modules)/,
    url: {
      template: path.join(__dirname, "tmpl/chunk-manifest.tmpl"),
      replace: "##URL##",
      defer: true
    }
  },
  {
    name: "vendor",
    exclude: /(node_modules)/,
    inline: {
      template: path.join(__dirname, "tmpl/chunk-manifest.tmpl"),
      replace: "##SOURCE##"
    },
    url: {
      template: path.join(__dirname, "tmpl/chunk-manifest.tmpl"),
      replace: "##URL##",
      async: true,
      defer: true
    }
  },
  {
    name: "manifest",
    exclude: /(node_modules)/,
    inline: {
      template: path.join(__dirname, "tmpl/chunk-manifest.tmpl"),
      replace: "##SOURCE##"
    }
  },
  {
    test: /manifest.json$/,
    exclude: /(node_modules)/,
    inline: {
      template: path.join(__dirname, "tmpl/chunk-manifest.tmpl"),
      replace: "##SOURCE##"
    }
  }
];


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
    new ChunkManifestPlugin(),
    new TemplatedAssetWebpackPlugin({ chunks: TemplatedAssetWebpackPluginConfig })
  ]
};
