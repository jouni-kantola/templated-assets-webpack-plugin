import test from "ava";

import publicPath from "../lib/public-path";

test("fallback public path", t => {
  t.is(publicPath(), "");
  t.is(publicPath({}), "");
  t.is(
    publicPath({
      outputOptions: undefined
    }),
    ""
  );
  t.is(
    publicPath({
      outputOptions: {}
    }),
    ""
  );
  t.is(
    publicPath({
      outputOptions: {
        publicPath: undefined
      }
    }),
    ""
  );
});

test("public path from output options", t => {
  t.is(
    publicPath({
      outputOptions: {
        publicPath: "a path"
      }
    }),
    "a path"
  );
});

test("default don't blank auto public path", t => {
  t.is(
    publicPath({
      outputOptions: {
        publicPath: "auto"
      }
    }),
    "auto"
  );
});

test("blank auto public path", t => {
  t.is(
    publicPath(
      {
        outputOptions: {
          publicPath: "auto"
        }
      },
      true
    ),
    ""
  );
});
