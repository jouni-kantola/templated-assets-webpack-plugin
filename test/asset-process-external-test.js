import test from "ava";
import Asset from "../lib/asset";

test("can access process external handler", t => {
  const name = "a-name";
  const asset = new Asset(name, { content: "a source", filename: "file.js" });

  t.is(typeof asset.processExternal, "function");
});
