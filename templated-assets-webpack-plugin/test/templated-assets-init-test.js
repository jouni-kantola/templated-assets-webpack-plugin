import test from "ava";
import TemplatedAssets from "../src/templated-assets";

test("ensure chunks", t => {
  const error = t.throws(
    () => {
      new TemplatedAssets(undefined, []);
    },
    TypeError
  );

  t.is(error.message, "Chunks must be specified to map chunks with rules.");
});

test("ensure rules", t => {
  const error = t.throws(
    () => {
      new TemplatedAssets([], undefined);
    },
    TypeError
  );

  t.is(error.message, "Rules must be specified to map rules with chunks.");
});

test("filter sync chunks", t => {
  const rules = {
    url: () => [],
    inline: () => []
  };

  const assets = new TemplatedAssets([], rules);

  t.pass(assets.sync, []);
});

test("filter async chunks", t => {
  const rules = {
    url: () => [],
    inline: () => []
  };

  const assets = new TemplatedAssets([], rules);

  t.pass(assets.async, []);
});

test("filter deferred chunks", t => {
  const rules = {
    url: () => [],
    inline: () => []
  };

  const assets = new TemplatedAssets([], rules);

  t.pass(assets.defer, []);
});

test("filter inline chunks", t => {
  const rules = {
    url: () => [],
    inline: () => []
  };

  const assets = new TemplatedAssets([], rules);

  t.pass(assets.inline, []);
});
