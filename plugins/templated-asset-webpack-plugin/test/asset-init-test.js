import test from "ava";
import Asset from "../src/asset";

// const a = {
//   type: {
//     sync,
//     async,
//     defer,
//     inline
//   },
//   file: {
//     prefix,+
//     extension,+
//     name,
//     filename,
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
      new Asset();
    },
    Error
  );

  t.is(error.message, "Asset name must be specified");
});

test("give name", t => {
  const name = "a-name";
  const asset = new Asset(name);

  t.is(asset.file.name, name);
});

test("default prefix", t => {
  const asset = new Asset("name");

  t.is(asset.file.prefix, "");
});

test("default extension", t => {
  const asset = new Asset("name");

  t.is(asset.file.extension, "html");
});

test("concat filename", t => {
  const asset = new Asset("name");
  asset.file.prefix = "_";

  t.is(asset.file.filename, "_name.html");
});

test("ensure delimited name and extension", t => {
  const asset = new Asset("name");
  asset.file.extension = "..23...ext";

  t.is(asset.file.filename, "name.23.ext");
});
