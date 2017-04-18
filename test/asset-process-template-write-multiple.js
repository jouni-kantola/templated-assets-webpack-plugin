import test from "ava";
import Asset from "../lib/asset";
import io from "../lib/file-io";

test.cb("should process multiple copies", t => {
  t.plan(4);

  io.read = () => Promise.resolve("mocked template ##URL##");

  const output1 = (path, content) => {
    t.is(path, "a/path/a-name.html");
    t.is(content, "mocked template source");
  };

  const output2 = (path, content) => {
    t.is(path, "another/path/a-name.html");
    t.is(content, "mocked template source");
    t.end();
  };

  io.write = (path, content) => {
    if (path.startsWith("a/path")) output1(path, content);
    if (path.startsWith("another/path")) output2(path, content);
  };

  const asset = new Asset("a-name", { content: "source", filename: "file.js" });
  asset.output.path = ["a/path", "another/path"];

  asset.process();
});
