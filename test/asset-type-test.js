import test from "ava";
import Asset from "../lib/asset";

test("default type", t => {
  const asset = new Asset("name", { content: "a source", filename: "file.js" });

  t.true(asset.type.sync);
});
