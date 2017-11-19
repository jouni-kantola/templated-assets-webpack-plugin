import test from "ava";
import { EOL } from "os";

import Asset from "../lib/asset";
import AssetSource from "../lib/asset-source";
import io from "../lib/file-io";

test("should replace template's content", async t => {
  io.read = () => Promise.resolve("mocked template ##URL##");

  const name = "a-name";
  const filename = "file.js";
  const assetSource = new AssetSource(filename, "source");
  const asset = new Asset(name, assetSource, `/${filename}`);

  const result = await asset.process();

  const expected = `mocked template /${filename}`;
  t.is(result.filename, `${name}.html`);
  t.is(result.source, expected);
  t.is(result.emitAsset, true);
});

test("notify no replacement in template", async t => {
  io.read = () => Promise.resolve("mocked template");

  const assetSource = new AssetSource("file.js", "source");
  const asset = new Asset("a-name", assetSource, "/");

  try {
    await asset.process();
  } catch (e) {
    t.true(
      e.startsWith("No replacement done in template. Check rule configuration.")
    );
  }
});

test("should notify to not emit asset", async t => {
  io.read = () => Promise.resolve("mocked template ##URL##");

  const assetSource = new AssetSource("file.js", "source");
  const asset = new Asset("a-name", assetSource, "/");
  asset.output.emitAsset = false;

  const result = await asset.process();

  t.is(result.emitAsset, false);
});

test("apply template header", async t => {
  io.read = () => Promise.resolve("mocked template ##URL##");

  const name = "a-name";
  const filename = "file.js";
  const assetSource = new AssetSource(filename, "source");
  const asset = new Asset(name, assetSource, `/${filename}`);

  const header = "a-header";
  asset.template.header = header;

  const result = await asset.process();

  const expected = `${header}${EOL}mocked template /${filename}`;
  t.is(result.source, expected);
});

test("apply template header function", async t => {
  io.read = () => Promise.resolve("mocked template ##URL##");

  const name = "a-name";
  const filename = "file.js";
  const assetSource = new AssetSource(filename, "source");
  const asset = new Asset(name, assetSource, `/${filename}`);

  const header = "a-header";
  asset.template.header = () => header;

  const result = await asset.process();

  const expected = `${header}${EOL}mocked template /${filename}`;
  t.is(result.source, expected);
});

test("apply template footer", async t => {
  io.read = () => Promise.resolve("mocked template ##URL##");

  const name = "a-name";
  const filename = "file.js";
  const assetSource = new AssetSource(filename, "source");
  const asset = new Asset(name, assetSource, `/${filename}`);

  const footer = "a-footer";
  asset.template.footer = footer;

  const result = await asset.process();

  const expected = `mocked template /${filename}${EOL}${footer}`;
  t.is(result.source, expected);
});

test("apply template footer function", async t => {
  io.read = () => Promise.resolve("mocked template ##URL##");

  const name = "a-name";
  const filename = "file.js";
  const assetSource = new AssetSource(filename, "source");
  const asset = new Asset(name, assetSource, `/${filename}`);

  const footer = "a-footer";
  asset.template.footer = () => footer;

  const result = await asset.process();

  const expected = `mocked template /${filename}${EOL}${footer}`;
  t.is(result.source, expected);
});

test("apply template header and footer", async t => {
  io.read = () => Promise.resolve("mocked template ##URL##");

  const name = "a-name";
  const filename = "file.js";
  const assetSource = new AssetSource(filename, "source");
  const asset = new Asset(name, assetSource, `/${filename}`);

  const footer = "a-footer";
  const header = "a-header";
  asset.template.header = header;
  asset.template.footer = footer;

  const result = await asset.process();

  const expected = `${header}${EOL}mocked template /${filename}${EOL}${footer}`;
  t.is(result.source, expected);
});
