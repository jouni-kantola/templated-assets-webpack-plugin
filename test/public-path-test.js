import test from "ava";

import publicPath from "../lib/public-path";

test("fallback public path", t => {
  t.is(publicPath(), "/");
  t.is(publicPath({}), "/");
  t.is(publicPath({ mainTemplate: undefined }), "/");
  t.is(
    publicPath({
      mainTemplate: {
        outputOptions: undefined
      }
    }),
    "/"
  );
  t.is(
    publicPath({
      mainTemplate: {
        outputOptions: {
          publicPath: undefined
        }
      }
    }),
    "/"
  );
});

test("public path from output options", t => {
  t.is(
    publicPath({
      mainTemplate: {
        outputOptions: {
          publicPath: "a path"
        }
      }
    }),
    "a path"
  );
});
