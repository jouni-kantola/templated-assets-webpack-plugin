import test from "ava";
import Asset from "../lib/asset";
import AssetSource from "../lib/asset-source";

test("ensure value to replace", t => {
  const assetSource = new AssetSource("file.js", "a source");
  const asset = new Asset("name", assetSource, "/");
  const error = t.throws(
    () => {
      asset.template.replace = 1;
    },
    Error
  );

  t.is(
    error.message,
    "Specify value in template to replace (string || RegExp)"
  );
});

test("default replacement is updated when value is string", t => {
  const assetSource = new AssetSource("file.js", "a source");
  const asset = new Asset("name", assetSource, "/");

  const replacement = "find this";
  asset.template.replace = replacement;

  t.is(asset.template._replace, replacement);
  t.true(asset.template.replace.test(replacement));
});

test("default replacement is updated when value is RegExp", t => {
  const assetSource = new AssetSource("file.js", "a source");
  const asset = new Asset("name", assetSource, "/");

  const replacement = "find this";
  asset.template.replace = new RegExp(replacement);

  t.true(asset.template._replace.test(replacement));
  t.true(asset.template.replace.test(replacement));
});

test("default replacement", t => {
  const assetSource = new AssetSource("file.js", "a source");
  const asset = new Asset("name", assetSource, "/");

  t.true(asset.template.replace.test("##URL##"));
});

test("default async replacement", t => {
  const assetSource = new AssetSource("file.js", "a source");
  const asset = new Asset("name", assetSource, "/");

  asset.type.async = true;

  t.true(asset.template.replace.test("##URL##"));
});

test("default defer replacement", t => {
  const assetSource = new AssetSource("file.js", "a source");
  const asset = new Asset("name", assetSource, "/");

  asset.type.defer = true;

  t.true(asset.template.replace.test("##URL##"));
});

test("default inline replacement", t => {
  const assetSource = new AssetSource("file.js", "a source");
  const asset = new Asset("name", assetSource, "/");

  asset.type.inline = true;

  t.true(asset.template.replace.test("##SOURCE##"));
});
