import test from "ava";

import Asset from "../lib/asset";
import AssetSource from "../lib/asset-source";

import io from "../lib/file-io";

test("can access process external handler", t => {
  const assetSource = new AssetSource("file.js", "a source");
  const asset = new Asset("a-name", assetSource, "/");

  t.is(typeof asset.processExternal, "function");
});

test("should pass args to custom source processor", async t => {
  const name = "a-name";
  const assetSource = new AssetSource("file.js", "a source");
  const ruleArgs = ["a", "b", "c"];

  const asset = new Asset(name, assetSource, "/", ruleArgs);

  asset.template.process = (source, callback, ...args) => {
    callback(args.join("-"));
  };

  const result = await asset.process();

  const expected = "a-b-c";
  t.is(result.filename, `${name}.html`);
  t.is(result.source, expected);
  t.is(result.emitAsset, true);
});

test("should notify to not emit asset", async t => {
  const name = "a-name";
  const assetSource = new AssetSource("file.js", "a source");
  const asset = new Asset(name, assetSource, "/");

  asset.output.emitAsset = false;
  asset.template.process = (source, callback) => {
    callback("source modified");
  };

  const result = await asset.process();

  const expected = "source modified";
  t.is(result.filename, `${name}.html`);
  t.is(result.source, expected);
  t.is(result.emitAsset, false);
});

test("should reject if custom source processor fails", async t => {
  io.read = () => Promise.resolve("mocked template ##URL##");

  const name = "a-name";
  const assetSource = new AssetSource("file.js", "a source");
  const asset = new Asset(name, assetSource, "/");

  asset.output.emitAsset = false;
  asset.template.process = () => {
    throw new Error("custom source processor failed");
  };

  try {
    await asset.process();
  } catch (error) {
    const regex = new RegExp(`Templating unsuccessful for ${name}.html`);
    t.regex(error, regex);
    t.regex(error, /Error: custom source processor failed/);
  }
});

test("ensure contract with external process handler", async t => {
  io.read = () => Promise.resolve("mocked template ##URL##");

  const _name = "a-name";
  const _filename = "file.js";
  const _source = "a source";
  const _url = `/${_filename}`;
  const _args = ["a", "b", "c"];

  const assetSource = new AssetSource(_filename, _source);
  const asset = new Asset(_name, assetSource, _url, _args);

  asset.template.process = (asset, callback, ...args) => {
    const expectedContent = `mocked template ${_url}`;
    const { filename, source, content, url } = asset;

    t.is(filename, _filename);
    t.is(source, _source);
    t.is(content, expectedContent);
    t.is(url, _url);
    t.deepEqual(args, _args);

    callback(args.join("-"));
  };

  const result = await asset.process();

  const expected = "a-b-c";
  t.is(result.filename, `${_name}.html`);
  t.is(result.source, expected);
  t.is(result.emitAsset, true);
});
