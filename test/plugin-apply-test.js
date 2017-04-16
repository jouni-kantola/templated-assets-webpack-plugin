import test from "ava";
import Plugin from "../lib/plugin";

test.cb("emit assets", t => {
  const plugin = new Plugin({
    rules: [
      {
        name: "url-asset"
      }
    ]
  });

  const compilation = {
    chunks: [
      {
        name: "url-asset",
        files: ["url-asset.js"]
      }
    ],
    assets: {
      "url-asset.js": {
        source: () => "contents of url-assets.js"
      }
    }
  };

  const done = () => {
    t.is(Object.keys(compilation.assets).length, 2);

    const asset = compilation.assets["url-asset.html"];

    const expected = `<script type="text/javascript" src="/${compilation.chunks[0].files[0]}"></script>`;
    t.is(asset.source(), expected);
    t.is(asset.size(), expected.length);
    t.end();
  };

  const compiler = {
    plugin: (event, doPluginWork) => {
      t.is(event, "emit");
      doPluginWork(compilation, done);
    }
  };

  plugin.apply(compiler);
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

  const compilation = {
    chunks: [
      {
        name: "url-asset",
        files: ["url-asset.js"]
      }
    ],
    assets: {
      "url-asset.js": {
        source: () => "contents of url-assets.js"
      }
    }
  };

  const done = () => {
    t.is(Object.keys(compilation.assets).length, 1);
    const asset = compilation.assets["url-asset.html"];
    t.is(asset, undefined);
    t.end();
  };

  const compiler = {
    plugin: (event, doPluginWork) => {
      t.is(event, "emit");
      doPluginWork(compilation, done);
    }
  };

  plugin.apply(compiler);
});
