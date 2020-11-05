import test from "ava";
import Asset from "../lib/asset";
import AssetSource from "../lib/asset-source";
import io from "../lib/file-io";

test.cb("should process multiple copies", t => {
  t.plan(4);

  const name = "a-name";
  const filename = "file.js";
  const url = `/${filename}`;

  io.read = () => Promise.resolve("mocked template ##URL##");

  const expectedContent = `mocked template ${url}`;
  const outputPath1 = "a/path";
  const outputPath2 = "another/path";
  const output1 = (path, content) => {
    t.is(path, `${outputPath1}/${name}.html`);
    t.is(content, expectedContent);
  };
  const output2 = (path, content) => {
    t.is(path, `${outputPath2}/${name}.html`);
    t.is(content, expectedContent);
    t.end();
  };

  io.write = (path, content) => {
    if (path.startsWith(outputPath1)) output1(path, content);
    if (path.startsWith(outputPath2)) output2(path, content);
  };

  const assetSource = new AssetSource(filename, "source");
  const asset = new Asset("a-name", assetSource, url);
  asset.output.path = [outputPath1, outputPath2];

  asset.process();
});
