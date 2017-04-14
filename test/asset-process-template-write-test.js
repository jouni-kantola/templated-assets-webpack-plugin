import test from "ava";
import Asset from "../lib/asset";
import io from "../lib/file-io";

test.cb("should output asset", t => {
  const outputPath = "a/path";
  const name = "a-name";

  io.read = () => Promise.resolve("mocked template ##URL##");

  io.write = (path, content) => {
    t.is(path, `${outputPath}/${name}.html`);
    t.is(content, "mocked template source");
    t.end();
  };

  const asset = new Asset(name, { content: "source", filename: "file.js" });
  asset.output.path = outputPath;

  asset.process();
});
