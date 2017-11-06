import test from "ava";
import TemplatedAssets from "../lib/templated-assets";
import RuleSet from "../lib/rule-set";

test("ensure chunks", t => {
  const error = t.throws(
    () => {
      new TemplatedAssets(undefined, []);
    },
    TypeError
  );

  t.is(error.message, "Chunks must be specified to map chunks with rules.");
});

test("ensure rules", t => {
  const error = t.throws(
    () => {
      new TemplatedAssets([], undefined);
    },
    TypeError
  );

  t.is(error.message, "Rules must be specified to map rules with chunks.");
});

test("process all", async t => {
  const rules = new RuleSet([
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
  const rules = new RuleSet([
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
      name: "named-asset",
      replace: "##NAME##",
      template: {
        path: "named-asset-path"
      },
      args: [1, 2, 3]
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
      name: "named-asset",
      filename: "na.js",
      url: "/na.js",
      source: "named-asset-source"
    }
  ];

  const templatedAssets = new TemplatedAssets(chunks, rules);

  t.is(templatedAssets.assets.length, 3);

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
  t.deepEqual(asset2.args, [1, 2, 3]);

  const asset3 = templatedAssets.assets[2];
  t.is(asset3.file.extension, "txt");
  t.is(asset3.file.prefix, "__");
  t.is(asset3.type.inline, true);
  t.is(asset3.output.emitAsset, false);
  t.deepEqual(asset3.output.path, ["output/path"]);
});
