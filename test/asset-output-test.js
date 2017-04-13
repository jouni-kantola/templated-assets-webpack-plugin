import test from "ava";
import Asset from "../lib/asset";

test("default to no custom output location", t => {
  const name = "a-name";
  const asset = new Asset(name, { content: "a source", filename: "file.js" });

  t.is(asset.output.path, "");
});

test("overrideable output path", t => {
  const name = "a-name";
  const asset = new Asset(name, { content: "a source", filename: "file.js" });

  asset.output.path = "a/path";

  t.is(asset.output._path, "a/path");
  t.is(asset.output.path, "a/path");
});

test("default output asset", t => {
  const name = "a-name";
  const asset = new Asset(name, { content: "a source", filename: "file.js" });

  t.is(asset.output.emitAsset, true);
});

test("default output asset", t => {
  const name = "a-name";
  const asset = new Asset(name, { content: "a source", filename: "file.js" });

  asset.output.emitAsset = false;

  t.is(asset.output._emitAsset, false);
  t.is(asset.output.emitAsset, false);
});
