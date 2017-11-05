import test from "ava";
import Asset from "../lib/asset";

test("can access process external handler", t => {
  const name = "a-name";
  const asset = new Asset(name, { content: "a source", filename: "file.js" });

  t.is(typeof asset.processExternal, "function");
});

test("should pass args to custom source processor", async t => {
  const name = "a-name";
  const asset = new Asset(name, { content: "source", filename: "file.js" });
  const ruleArgs = ["a", "b", "c"];

  asset.source.args = ruleArgs;

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
  const asset = new Asset(name, { content: "source", filename: "file.js" });

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
  const name = "a-name";
  const asset = new Asset(name, { content: "source", filename: "file.js" });

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
