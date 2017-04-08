import test from "ava";
import Asset from "../src/asset";

test("default type", t => {
  const asset = new Asset("name");

  t.true(asset.type.sync);
});
