import test from "ava";
import { EOL } from "os";
import Plugin from "../lib/plugin";

test.cb("emit url asset", t => {
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

    const expected = `<script type="text/javascript" src="/${compilation.chunks[0].files[0]}"></script>${EOL}`;
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

  const compilation = {
    chunks: [
      {
        name: "async-asset",
        files: ["async-asset.js"]
      }
    ],
    assets: {
      "async-asset.js": {
        source: () => "contents of async-assets.js"
      }
    }
  };

  const done = () => {
    t.is(Object.keys(compilation.assets).length, 2);

    const asset = compilation.assets["async-asset.html"];

    const expected = `<script type="text/javascript" src="/${compilation.chunks[0].files[0]}" async="async"></script>${EOL}`;
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

test.cb("emit deferred asset", t => {
  const plugin = new Plugin({
    rules: [
      {
        name: "defer-asset",
        output: {
          defer: true
        }
      }
    ]
  });

  const compilation = {
    chunks: [
      {
        name: "defer-asset",
        files: ["defer-asset.js"]
      }
    ],
    assets: {
      "defer-asset.js": {
        source: () => "contents of defer-assets.js"
      }
    }
  };

  const done = () => {
    t.is(Object.keys(compilation.assets).length, 2);

    const asset = compilation.assets["defer-asset.html"];

    const expected = `<script type="text/javascript" src="/${compilation.chunks[0].files[0]}" defer="defer"></script>${EOL}`;
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

  const compilation = {
    chunks: [
      {
        name: "async-defer-asset",
        files: ["async-defer-asset.js"]
      }
    ],
    assets: {
      "async-defer-asset.js": {
        source: () => "contents of async-defer-assets.js"
      }
    }
  };

  const done = () => {
    t.is(Object.keys(compilation.assets).length, 2);

    const asset = compilation.assets["async-defer-asset.html"];

    const expected = `<script type="text/javascript" src="/${compilation.chunks[0].files[0]}" async="async" defer="defer"></script>${EOL}`;
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

  const compilation = {
    chunks: [
      {
        name: "inline-asset",
        files: ["inline-asset.js"]
      }
    ],
    assets: {
      "inline-asset.js": {
        source: () => "contents of inline-assets.js"
      }
    }
  };

  const done = () => {
    t.is(Object.keys(compilation.assets).length, 2);
    const asset = compilation.assets["inline-asset.html"];

    const expected = `<script type="text/javascript">${compilation.assets[
      "inline-asset.js"
    ].source()}</script>${EOL}`;
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
