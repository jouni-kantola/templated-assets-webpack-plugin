import test from "ava";

import Asset from "../lib/asset";
import AssetSource from "../lib/asset-source";
import io from "../lib/file-io";

test.cb("should output custom processed asset", t => {
  t.plan(4);

  const output1 = (path, content) => {
    t.is(path, "a/path/a-name.html");
    t.is(content, "source modified");
  };

  const output2 = (path, content) => {
    t.is(path, "another/path/a-name.html");
    t.is(content, "source modified");
    t.end();
  };

  io.write = (path, content) => {
    if (path.startsWith("a/path")) output1(path, content);
    if (path.startsWith("another/path")) output2(path, content);
  };

  const assetSource = new AssetSource("file.js", "a source");
  const asset = new Asset("a-name", assetSource, "/");
  asset.template.process = (source, callback) => {
    callback("source modified");
  };
  asset.output.path = ["a/path", "another/path"];

  asset.process();
});
