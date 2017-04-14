import test from "ava";
import Asset from "../lib/asset";

import io from "../lib/file-io";

test("should replace template's content", async t => {
  io.read = () => Promise.resolve("mocked template ##URL##");

  const name = "a-name";
  const asset = new Asset(name, { content: "source", filename: "file.js" });

  const result = await asset.process();

  const expected = "mocked template source";
  t.is(result.filename, `${name}.html`);
  t.is(result.source, expected);
  t.is(result.size, expected.length);
  t.is(result.emitAsset, true);
});

test("notify no replacement in template", async t => {
  io.read = () => Promise.resolve("mocked template");

  const asset = new Asset("a-name", { content: "source", filename: "file.js" });

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

  const asset = new Asset("a-name", { content: "source", filename: "file.js" });
  asset.output.emitAsset = false;

  const result = await asset.process();

  t.is(result.emitAsset, false);
});
