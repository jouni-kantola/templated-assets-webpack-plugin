import test from "ava";
import Asset from "../lib/asset";
import io from "../lib/file-io";

test.cb("should output custom processed asset", t => {
  const outputPath = "a/path";
  const name = "a-name";

  io.write = (path, content) => {
    t.is(path, `${outputPath}/${name}.html`);
    t.is(content, "source modified");
    t.end();
  };

  const asset = new Asset(name, { content: "source", filename: "file.js" });
  asset.template.process = (source, callback) => {
    callback("source modified");
  };
  asset.output.path = outputPath;

  asset.process();
});
