import test from "ava";
import webpack from "webpack";
import { EOL } from "os";
import Plugin from "../lib/plugin";
import path from "path";

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
      entry: {
        "url-asset": path.join(__dirname, "plugin-apply-test-entry.js")
      },
      plugins: [plugin]
    },
    (err, stats) => {
      if (err) {
        return t.end(err);
      } else if (stats.hasErrors()) {
        return t.end(stats.toString());
      }

      const { compilation } = stats;

      const expected = `<script type="text/javascript" src="/${compilation.chunks[0].files[0]}"></script>${EOL}`;

      const asset = compilation.assets["url-asset.html"];
      t.is(asset.source(), expected);
      t.is(asset.size(), expected.length);

      t.end();
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
      entry: {
        "async-asset": path.join(__dirname, "plugin-apply-test-entry.js")
      },
      plugins: [plugin]
    },
    (err, stats) => {
      if (err) {
        return t.end(err);
      } else if (stats.hasErrors()) {
        return t.end(stats.toString());
      }

      const { compilation } = stats;

      const expected = `<script type="text/javascript" src="/${compilation.chunks[0].files[0]}" async="async"></script>${EOL}`;

      const asset = compilation.assets["async-asset.html"];
      t.is(asset.source(), expected);
      t.is(asset.size(), expected.length);

      t.end();
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
      entry: {
        "deferred-asset": path.join(__dirname, "plugin-apply-test-entry.js")
      },
      plugins: [plugin]
    },
    (err, stats) => {
      if (err) {
        return t.end(err);
      } else if (stats.hasErrors()) {
        return t.end(stats.toString());
      }

      const { compilation } = stats;

      const expected = `<script type="text/javascript" src="/${compilation.chunks[0].files[0]}" defer="defer"></script>${EOL}`;

      const asset = compilation.assets["deferred-asset.html"];
      t.is(asset.source(), expected);
      t.is(asset.size(), expected.length);

      t.end();
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
      entry: {
        "async-defer-asset": path.join(__dirname, "plugin-apply-test-entry.js")
      },
      plugins: [plugin]
    },
    (err, stats) => {
      if (err) {
        return t.end(err);
      } else if (stats.hasErrors()) {
        return t.end(stats.toString());
      }

      const { compilation } = stats;

      const expected = `<script type="text/javascript" src="/${compilation.chunks[0].files[0]}" async="async" defer="defer"></script>${EOL}`;

      const asset = compilation.assets["async-defer-asset.html"];
      t.is(asset.source(), expected);
      t.is(asset.size(), expected.length);

      t.end();
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

  webpack(
    {
      entry: {
        "inline-asset": path.join(__dirname, "plugin-apply-test-entry.js")
      },
      plugins: [plugin]
    },
    (err, stats) => {
      if (err) {
        return t.end(err);
      } else if (stats.hasErrors()) {
        return t.end(stats.toString());
      }

      const { compilation } = stats;

      const expected = `<script type="text/javascript">${compilation.assets[
        "inline-asset.js"
      ].source()}</script>${EOL}`;

      const asset = compilation.assets["inline-asset.html"];
      t.is(asset.source(), expected);
      t.is(asset.size(), expected.length);

      t.end();
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
      entry: {
        "url-asset": path.join(__dirname, "plugin-apply-test-entry.js")
      },
      plugins: [plugin]
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
