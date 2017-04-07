import test from "ava";
import TemplatedChunks from "../src/templated-chunks";

test("ensure chunks", t => {
  const error = t.throws(
    () => {
      new TemplatedChunks(undefined, []);
    },
    TypeError
  );

  t.is(error.message, "Chunks must be specified to map chunks with rules.");
});

test("ensure rules", t => {
  const error = t.throws(
    () => {
      new TemplatedChunks([], undefined);
    },
    TypeError
  );

  t.is(error.message, "Rules must be specified to map rules with chunks.");
});

test("filter sync chunks", t => {
  const rules = {
    sync: () => [],
    async: () => [],
    defer: () => [],
    inline: () => []
  };

  const templatedChunks = new TemplatedChunks([], rules);

  t.pass(templatedChunks.sync, []);
});

test("filter async chunks", t => {
  const rules = {
    sync: () => [],
    async: () => [],
    defer: () => [],
    inline: () => []
  };

  const templatedChunks = new TemplatedChunks([], rules);

  t.pass(templatedChunks.async, []);
});

test("filter deferred chunks", t => {
  const rules = {
    sync: () => [],
    async: () => [],
    defer: () => [],
    inline: () => []
  };

  const templatedChunks = new TemplatedChunks([], rules);

  t.pass(templatedChunks.defer, []);
});

test("filter inline chunks", t => {
  const rules = {
    sync: () => [],
    async: () => [],
    defer: () => [],
    inline: () => []
  };

  const templatedChunks = new TemplatedChunks([], rules);

  t.pass(templatedChunks.inline, []);
});
