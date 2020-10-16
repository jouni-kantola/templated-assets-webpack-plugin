import test from "ava";
import webpack from "webpack";
import { EOL } from "os";
import Plugin from "../lib/plugin";
import path from "path";
import rimraf from "rimraf";
import io from "../lib/file-io";

const OUTPUT_PATH = path.join(__dirname, "dist");

test.beforeEach.cb(t => {
  rimraf(OUTPUT_PATH, t.end);
});

test.cb("emit url asset", t => {
  const plugin = new Plugin({
    rules: [
      {
        name: "url-asset"
      }
    ]
  });

  webpack(
    {
      devtool: false,
      entry: {
        "url-asset": path.join(__dirname, "plugin-apply-test-entry.js")
      },
      output: {
        path: OUTPUT_PATH
      },
      plugins: [
        new webpack.DefinePlugin({
          "process.env.NODE_ENV": JSON.stringify("development")
        }),
        plugin
      ]
    },
    (err, stats) => {
      if (err) {
        return t.end(err);
      } else if (stats.hasErrors()) {
        return t.end(stats.toString());
      }

      const { compilation } = stats;

      const [chunk] = compilation.chunks;
      const [file] = chunk.files;

      const expected = `<script type="text/javascript" src="${file}"></script>${EOL}`;
      const asset = compilation.assets["url-asset.html"];
      t.is(asset.size(), expected.length);

      io.read(path.join(OUTPUT_PATH, "url-asset.html")).then(source => {
        t.is(source, expected);

        t.end();
      });
    }
  );
});

test.cb("emit async asset", t => {
  const plugin = new Plugin({
    rules: [
      {
        name: "async-asset",
        output: {
          async: true
        }
      }
    ]
  });

  webpack(
    {
      devtool: false,
      entry: {
        "async-asset": path.join(__dirname, "plugin-apply-test-entry.js")
      },
      output: {
        path: OUTPUT_PATH
      },
      plugins: [
        new webpack.DefinePlugin({
          "process.env.NODE_ENV": JSON.stringify("development")
        }),
        plugin
      ]
    },
    (err, stats) => {
      if (err) {
        return t.end(err);
      } else if (stats.hasErrors()) {
        return t.end(stats.toString());
      }

      const { compilation } = stats;

      const [chunk] = compilation.chunks;
      const [file] = chunk.files;

      const expected = `<script type="text/javascript" src="${file}" async="async"></script>${EOL}`;

      const asset = compilation.assets["async-asset.html"];
      t.is(asset.size(), expected.length);

      io.read(path.join(OUTPUT_PATH, "async-asset.html")).then(source => {
        t.is(source, expected);

        t.end();
      });
    }
  );
});

test.cb("emit deferred asset", t => {
  const plugin = new Plugin({
    rules: [
      {
        name: "deferred-asset",
        output: {
          defer: true
        }
      }
    ]
  });

  webpack(
    {
      devtool: false,
      entry: {
        "deferred-asset": path.join(__dirname, "plugin-apply-test-entry.js")
      },
      output: {
        publicPath: "/",
        path: OUTPUT_PATH
      },
      plugins: [
        new webpack.DefinePlugin({
          "process.env.NODE_ENV": JSON.stringify("development")
        }),
        plugin
      ]
    },
    (err, stats) => {
      if (err) {
        return t.end(err);
      } else if (stats.hasErrors()) {
        return t.end(stats.toString());
      }

      const { compilation } = stats;
      const [chunk] = compilation.chunks;
      const [file] = chunk.files;

      const expected = `<script type="text/javascript" src="/${file}" defer="defer"></script>${EOL}`;

      const asset = compilation.assets["deferred-asset.html"];
      t.is(asset.size(), expected.length);

      io.read(path.join(OUTPUT_PATH, "deferred-asset.html")).then(source => {
        t.is(source, expected);

        t.end();
      });
    }
  );
});

test.cb("emit async/defer asset", t => {
  const plugin = new Plugin({
    rules: [
      {
        name: "async-defer-asset",
        output: {
          async: true,
          defer: true
        }
      }
    ]
  });

  webpack(
    {
      devtool: false,
      entry: {
        "async-defer-asset": path.join(__dirname, "plugin-apply-test-entry.js")
      },
      output: {
        publicPath: "a-public-path/",
        path: OUTPUT_PATH
      },
      plugins: [
        new webpack.DefinePlugin({
          "process.env.NODE_ENV": JSON.stringify("development")
        }),
        plugin
      ]
    },
    (err, stats) => {
      if (err) {
        return t.end(err);
      } else if (stats.hasErrors()) {
        return t.end(stats.toString());
      }

      const { compilation } = stats;
      const [chunk] = compilation.chunks;
      const [file] = chunk.files;

      const expected = `<script type="text/javascript" src="a-public-path/${file}" async="async" defer="defer"></script>${EOL}`;

      const asset = compilation.assets["async-defer-asset.html"];
      t.is(asset.size(), expected.length);

      io.read(path.join(OUTPUT_PATH, "async-defer-asset.html")).then(source => {
        t.is(source, expected);

        t.end();
      });
    }
  );
});

test.cb("emit inline asset", t => {
  const plugin = new Plugin({
    rules: [
      {
        name: "inline-asset",
        output: {
          inline: true
        }
      }
    ]
  });

  const sourceFile = path.join(__dirname, "plugin-apply-test-entry.js");
  webpack(
    {
      devtool: false,
      entry: {
        "inline-asset": sourceFile
      },
      output: {
        path: OUTPUT_PATH
      },
      plugins: [
        new webpack.DefinePlugin({
          "process.env.NODE_ENV": JSON.stringify("development")
        }),
        plugin
      ]
    },
    (err, stats) => {
      if (err) {
        return t.end(err);
      } else if (stats.hasErrors()) {
        return t.end(stats.toString());
      }

      io.read(path.join(OUTPUT_PATH, "inline-asset.html")).then(output => {
        io.read(sourceFile).then(source => {
          t.true(output.includes(source));
          t.end();
        });
      });
    }
  );
});

test.cb("do not emit assets", t => {
  const plugin = new Plugin({
    rules: [
      {
        name: "url-asset",
        output: {
          emitAsset: false
        }
      }
    ]
  });

  webpack(
    {
      devtool: false,
      entry: {
        "url-asset": path.join(__dirname, "plugin-apply-test-entry.js")
      },
      plugins: [
        new webpack.DefinePlugin({
          "process.env.NODE_ENV": JSON.stringify("development")
        }),
        plugin
      ]
    },
    (err, stats) => {
      if (err) {
        return t.end(err);
      } else if (stats.hasErrors()) {
        return t.end(stats.toString());
      }

      const { compilation } = stats;

      t.is(Object.keys(compilation.assets).length, 1);
      const asset = compilation.assets["url-asset.html"];
      t.is(asset, undefined);
      t.end();
    }
  );
});
