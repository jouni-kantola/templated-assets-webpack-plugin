import test from "ava";
import AssetSource from "../lib/asset-source";

test("source filename is required", t => {
  const error = t.throws(
    () => {
      new AssetSource();
    },
    TypeError
  );

  t.is(error.message, "Source filename must be specified");
});

test("filename is set", t => {
  const filename = "file.123.js";
  const source = new AssetSource(filename, "content");

  t.is(source.filename, filename);
});

test("extension is text after last dot in filename", t => {
  const filename = "file.123.js";
  const source = new AssetSource(filename, "content");

  t.is(source.ext, "js");
});

test("source defaults to empty", t => {
  const source = new AssetSource("filename.js", undefined, "an-url");

  t.is(source.source, "");
});
