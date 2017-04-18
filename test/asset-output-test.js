import test from "ava";
import Asset from "../lib/asset";

test("use default", t => {
  const name = "a-name";
  const asset = new Asset(name, { content: "a source", filename: "file.js" });

  t.is(asset.output.useDefault, true);
});

test("use custom", t => {
  const name = "a-name";
  const asset = new Asset(name, { content: "a source", filename: "file.js" });

  asset.output.path = "a/path";

  t.is(asset.output.useDefault, false);
});

test("default to no custom output location", t => {
  const name = "a-name";
  const asset = new Asset(name, { content: "a source", filename: "file.js" });

  t.deepEqual(asset.output.path, []);
  t.is(asset.output.useDefault, true);
});

test("when blank input, fallback to default output location", t => {
  const name = "a-name";
  const asset = new Asset(name, { content: "a source", filename: "file.js" });

  asset.output.path = "";

  t.deepEqual(asset.output.path, []);
  t.is(asset.output.useDefault, true);
});

test("path as string or Array", t => {
  const name = "a-name";
  const asset = new Asset(name, { content: "a source", filename: "file.js" });

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
  const name = "a-name";
  const asset = new Asset(name, { content: "a source", filename: "file.js" });

  asset.output.path = "a/path";

  t.deepEqual(asset.output._path, ["a/path"]);
  t.deepEqual(asset.output.path, ["a/path"]);
});

test("overrideable multiple output paths", t => {
  const name = "a-name";
  const asset = new Asset(name, { content: "a source", filename: "file.js" });

  asset.output.path = ["a/path", "another/path"];

  t.deepEqual(asset.output._path, ["a/path", "another/path"]);
  t.deepEqual(asset.output.path, ["a/path", "another/path"]);
});

test("asset ends without slash", t => {
  const name = "a-name";
  const asset = new Asset(name, { content: "a source", filename: "file.js" });

  asset.output.path = ["a/path///", "another/path//"];

  t.deepEqual(asset.output._path, ["a/path", "another/path"]);
  t.deepEqual(asset.output.path, ["a/path", "another/path"]);
});

test("default output asset", t => {
  const name = "a-name";
  const asset = new Asset(name, { content: "a source", filename: "file.js" });

  t.is(asset.output.emitAsset, true);
});

test("fallback to emit asset", t => {
  const name = "a-name";
  const asset = new Asset(name, { content: "a source", filename: "file.js" });

  asset.output.emitAsset = 1;

  t.is(asset.output._emitAsset, true);
  t.is(asset.output.emitAsset, true);
});

test("do not emit asset", t => {
  const name = "a-name";
  const asset = new Asset(name, { content: "a source", filename: "file.js" });

  asset.output.emitAsset = false;

  t.is(asset.output._emitAsset, false);
  t.is(asset.output.emitAsset, false);
});
