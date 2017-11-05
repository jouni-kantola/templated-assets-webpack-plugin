import test from "ava";

import Asset from "../lib/asset";
import AssetSource from "../lib/asset-source";

test("default type", t => {
  const assetSource = new AssetSource("file.js", "a source");
  const asset = new Asset("name", assetSource, "/");

  t.true(asset.type.sync);
});
