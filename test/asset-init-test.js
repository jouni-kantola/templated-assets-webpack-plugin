import test from "ava";
import Asset from "../lib/asset";
import AssetSource from "../lib/asset-source";

test("throw if missing name", t => {
  const error = t.throws(
    () => {
      new Asset(undefined);
    },
    Error
  );

  t.is(error.message, "Asset name must be specified");
});

test("throw if missing asset source", t => {
  const error = t.throws(
    () => {
      new Asset("a name", undefined);
    },
    TypeError
  );

  t.is(error.message, "Asset source must be specified");
});

test("throw if missing asset's url", t => {
  const name = "asset-name";
  const assetSource = new AssetSource("file.js", "a source");

  const error = t.throws(
    () => {
      new Asset(name, assetSource);
    },
    TypeError
  );

  t.is(error.message, `Required argument URL is missing for ${name}`);
});

test("source is set", t => {
  const assetSource = new AssetSource("file.js", "a source");
  const asset = new Asset("a name", assetSource, "/");

  t.is(asset.source.source, assetSource.source);
  t.is(asset.source.filename, assetSource.filename);
});

test("asset's content defaults to url", t => {
  const filename = "file.js";
  const assetSource = new AssetSource(filename, "a source");
  const asset = new Asset("a name", assetSource, `/${filename}`);

  t.is(asset.content, `/${filename}`);
});

test("asset's content is source when inlined", t => {
  const assetSource = new AssetSource("file.js", "a source");
  const asset = new Asset("a name", assetSource, "/");
  asset.type.inline = true;

  t.is(asset.content, assetSource.source);
});

test("args are set", t => {
  const args = { an: "argument" };
  const assetSource = new AssetSource("file.js", "a source");
  const asset = new Asset("a name", assetSource, "/", args);

  t.deepEqual(asset.args, args);
});
