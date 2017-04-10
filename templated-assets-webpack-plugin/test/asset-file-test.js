import test from "ava";
import Asset from "../src/asset";

test("give name", t => {
  const name = "a-name";
  const asset = new Asset(name, { content: "a source", filename: "file.js" });

  t.is(asset.file.name, name);
});

test("default prefix", t => {
  const asset = new Asset("name", { content: "a source", filename: "file.js" });

  t.is(asset.file.prefix, "");
});

test("default extension", t => {
  const asset = new Asset("name", { content: "a source", filename: "file.js" });

  t.is(asset.file.extension, "html");
});

test("concat filename", t => {
  const asset = new Asset("name", { content: "a source", filename: "file.js" });
  asset.file.prefix = "_";

  t.is(asset.file.filename, "_name.html");
});

test("ensure delimited name and extension", t => {
  const asset = new Asset("name", { content: "a source", filename: "file.js" });
  asset.file.extension = "..23...ext";

  t.is(asset.file.filename, "name.23.ext");
});
