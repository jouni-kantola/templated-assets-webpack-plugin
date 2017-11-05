import test from "ava";
import Asset from "../lib/asset";
import AssetSource from "../lib/asset-source";

test("use default", t => {
  const assetSource = new AssetSource("file.js", "a source");
  const asset = new Asset("name", assetSource, "/");

  t.is(asset.output.useDefault, true);
});

test("use custom", t => {
  const assetSource = new AssetSource("file.js", "a source");
  const asset = new Asset("name", assetSource, "/");

  asset.output.path = "a/path";

  t.is(asset.output.useDefault, false);
});

test("default to no custom output location", t => {
  const assetSource = new AssetSource("file.js", "a source");
  const asset = new Asset("name", assetSource, "/");

  t.deepEqual(asset.output.path, []);
  t.is(asset.output.useDefault, true);
});

test("when blank input, fallback to default output location", t => {
  const assetSource = new AssetSource("file.js", "a source");
  const asset = new Asset("name", assetSource, "/");

  asset.output.path = "";

  t.deepEqual(asset.output.path, []);
  t.is(asset.output.useDefault, true);
});

test("path as string or Array", t => {
  const assetSource = new AssetSource("file.js", "a source");
  const asset = new Asset("name", assetSource, "/");

  const error = t.throws(
    () => {
      asset.output.path = 1;
    },
    TypeError
  );

  t.is(
    error.message,
    "Specify output path(s); string or Array (for multiple copies)"
  );
});

test("overrideable single output path", t => {
  const assetSource = new AssetSource("file.js", "a source");
  const asset = new Asset("name", assetSource, "/");

  asset.output.path = "a/path";

  t.deepEqual(asset.output._path, ["a/path"]);
  t.deepEqual(asset.output.path, ["a/path"]);
});

test("overrideable multiple output paths", t => {
  const assetSource = new AssetSource("file.js", "a source");
  const asset = new Asset("name", assetSource, "/");

  asset.output.path = ["a/path", "another/path"];

  t.deepEqual(asset.output._path, ["a/path", "another/path"]);
  t.deepEqual(asset.output.path, ["a/path", "another/path"]);
});

test("asset ends without slash", t => {
  const assetSource = new AssetSource("file.js", "a source");
  const asset = new Asset("name", assetSource, "/");

  asset.output.path = ["a/path///", "another/path//"];

  t.deepEqual(asset.output._path, ["a/path", "another/path"]);
  t.deepEqual(asset.output.path, ["a/path", "another/path"]);
});

test("default output asset", t => {
  const assetSource = new AssetSource("file.js", "a source");
  const asset = new Asset("name", assetSource, "/");

  t.is(asset.output.emitAsset, true);
});

test("fallback to emit asset", t => {
  const assetSource = new AssetSource("file.js", "a source");
  const asset = new Asset("name", assetSource, "/");

  asset.output.emitAsset = 1;

  t.is(asset.output._emitAsset, true);
  t.is(asset.output.emitAsset, true);
});

test("do not emit asset", t => {
  const assetSource = new AssetSource("file.js", "a source");
  const asset = new Asset("name", assetSource, "/");

  asset.output.emitAsset = false;

  t.is(asset.output._emitAsset, false);
  t.is(asset.output.emitAsset, false);
});
