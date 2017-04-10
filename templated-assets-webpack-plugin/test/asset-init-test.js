import test from "ava";
import Asset from "../src/asset";

// const a = {
//   process,
//   type: {
//     sync,
//     async,
//     defer,
//     inline
//   },
//   file: {
//     prefix,+
//     extension,+
//     name,+
//     filename,+
//     content
//   },
//   template: {
//     path,
//     content
//   }
// };

test("throw if missing name", t => {
  const error = t.throws(
    () => {
      new Asset(undefined, { content: "a source", filename: "file.js" });
    },
    Error
  );

  t.is(error.message, "Asset name must be specified");
});

test("throw if missing source", t => {
  const error = t.throws(
    () => {
      new Asset("a name", undefined);
    },
    Error
  );

  t.true(error.message.startsWith("Asset source must be specified"));
});

test("source is set", t => {
  const source = { content: "a source", filename: "file.js" };

  const asset = new Asset("a name", source);

  t.is(asset.source.content, "a source");
  t.is(asset.source.filename, "file.js");
});
