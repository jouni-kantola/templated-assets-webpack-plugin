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
      new Asset();
    },
    Error
  );

  t.is(error.message, "Asset name must be specified");
});
