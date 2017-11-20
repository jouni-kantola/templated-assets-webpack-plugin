import test from "ava";
import TemplatedAssets from "../lib/templated-assets";
import RuleSet from "../lib/rule-set";

test("ensure chunks", t => {
  const error = t.throws(() => {
    new TemplatedAssets(undefined, []);
  }, TypeError);

  t.is(error.message, "Chunks must be specified to map chunks with rules.");
});

test("ensure rules", t => {
  const error = t.throws(() => {
    new TemplatedAssets([], undefined);
  }, TypeError);

  t.is(error.message, "Rules must be specified to map rules with chunks.");
});

test("process all", async t => {
  const rules = RuleSet.from([
    {
      test: /url-asset/
    },
    {
      name: "inline-asset",
      output: {
        inline: true
      }
    }
  ]);

  const chunks = [
    {
      filename: "url-asset-1.js",
      url: "/url-asset-1.js",
      source: "url-asset-1-source"
    },
    {
      name: "inline-asset",
      filename: "inline-asset-1.js",
      url: "/inline-asset-1.js",
      source: "inline-asset-1-source"
    }
  ];

  const templatedAssets = new TemplatedAssets(chunks, rules);

  t.is(templatedAssets.assets.length, 2);
  const assets = await templatedAssets.process();
  t.regex(assets[0].source, /src="\/url-asset-1.js"/);
  t.regex(assets[1].source, />inline-asset-1-source</);
});

test("map chunks", t => {
  const rules = RuleSet.from([
    {
      test: /url-asset/,
      output: {
        async: true,
        defer: true
      }
    },
    {
      test: /inline-asset/,
      output: {
        inline: true,
        prefix: "__",
        extension: "txt",
        emitAsset: false,
        path: "output/path/"
      }
    },
    {
      name: "chunk-name",
      replace: "##NAME##",
      template: {
        path: "chunk-name-path",
        header: "a-header",
        footer: "a-footer"
      },
      args: [1, 2, 3]
    },
    {
      name: "chunk-name-to-override",
      output: {
        name: "overriden-chunk-name"
      }
    },
    {
      name: "another-chunk-name-to-override",
      output: {
        name: defaultName => defaultName.split("-")[0]
      }
    }
  ]);

  const chunks = [
    {
      filename: "url-asset-1.js",
      url: "/url-asset-1.js",
      source: "url-asset-1-source"
    },
    {
      filename: "inline-asset-1.js",
      content: "inline-asset-1.js",
      url: "/inline-asset-1.js",
      source: "inline-asset-1-source"
    },
    {
      filename: "non-match.js",
      content: "/non-match.js",
      source: "non-match-source"
    },
    {
      name: "chunk-name",
      filename: "na.js",
      url: "/na.js",
      source: "chunk-name-source"
    },
    {
      name: "chunk-name-to-override",
      url: "/na.js",
      filename: "na.js"
    },
    {
      name: "another-chunk-name-to-override",
      url: "/na.js",
      filename: "na.js"
    }
  ];

  const templatedAssets = new TemplatedAssets(chunks, rules);

  t.is(templatedAssets.assets.length, 5);

  const asset1 = templatedAssets.assets[0];
  t.is(asset1.file.extension, "html");
  t.is(asset1.file.prefix, "");
  t.is(asset1.type.sync, false);
  t.is(asset1.type.async, true);
  t.is(asset1.type.defer, true);
  t.is(asset1.output.emitAsset, true);

  const asset2 = templatedAssets.assets[1];
  t.is(asset2.type.sync, true);
  t.is(asset2.template.replace.test("##NAME##"), true);
  t.is(asset2.template.header, "a-header");
  t.is(asset2.template.footer, "a-footer");
  t.is(asset2.template.replace.test("##NAME##"), true);
  t.is(asset2.file.filename, "chunk-name.html");
  t.deepEqual(asset2.args, [1, 2, 3]);

  const asset3 = templatedAssets.assets[2];
  t.is(asset3.file.filename, "overriden-chunk-name.html");

  const asset4 = templatedAssets.assets[3];
  t.is(asset4.file.filename, "another.html");

  const asset5 = templatedAssets.assets[4];
  t.is(asset5.file.extension, "txt");
  t.is(asset5.file.prefix, "__");
  t.is(asset5.type.inline, true);
  t.is(asset5.output.emitAsset, false);
  t.deepEqual(asset5.output.path, ["output/path"]);
});
