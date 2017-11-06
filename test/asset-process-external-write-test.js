import test from "ava";

import Asset from "../lib/asset";
import AssetSource from "../lib/asset-source";
import io from "../lib/file-io";

test.cb("should output custom processed asset", t => {
  const outputPath = "a/path";
  const name = "a-name";

  io.write = (path, content) => {
    t.is(path, `${outputPath}/${name}.html`);
    t.is(content, "source modified");
    t.end();
  };

  const assetSource = new AssetSource("file.js", "a source");
  const asset = new Asset(name, assetSource, "/");

  asset.template.process = (source, callback) => {
    callback("source modified");
  };
  asset.output.path = outputPath;

  asset.process();
});
