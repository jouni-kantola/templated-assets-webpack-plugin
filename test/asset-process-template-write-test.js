import test from "ava";

import Asset from "../lib/asset";
import AssetSource from "../lib/asset-source";
import io from "../lib/file-io";

test.cb("should output asset", t => {
  const outputPath = "a/path";
  const name = "a-name";
  const filename = "file.js";
  const url = `/${filename}`;

  io.read = () => Promise.resolve("mocked template ##URL##");

  io.write = (path, content) => {
    t.is(path, `${outputPath}/${name}.html`);
    t.is(content, `mocked template ${url}`);
    t.end();
  };

  const assetSource = new AssetSource("file.js", "a source");
  const asset = new Asset(name, assetSource, url);

  asset.output.path = outputPath;

  asset.process();
});
