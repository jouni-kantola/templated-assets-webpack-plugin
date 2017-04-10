import test from "ava";
import RuleSet from "../lib/rule-set";

test("filter inline assets", t => {
  const inlineAsset = {
    name: "chunk1",
    inline: true
  };

  const urlAsset = {
    name: "chunk2",
    url: true
  };

  const chunks = new RuleSet([inlineAsset, urlAsset]);

  t.deepEqual(chunks.inline(), [inlineAsset]);
});

test("filter url assets", t => {
  const inlineAsset = {
    name: "chunk1",
    inline: true
  };

  const urlAsset = {
    name: "chunk2",
    url: true
  };

  const chunks = new RuleSet([inlineAsset, urlAsset]);

  t.deepEqual(chunks.url(), [urlAsset]);
});

test("filter sync assets", t => {
  const asyncAsset = {
    name: "chunk1",
    url: true,
    async: true
  };

  const deferredAsset = {
    name: "chunk2",
    url: true,
    defer: true
  };

  const syncAsset = {
    name: "chunk3",
    url: true
  };

  const chunks = new RuleSet([asyncAsset, deferredAsset, syncAsset]);

  t.deepEqual(chunks.sync(), [syncAsset]);
});

test("filter async assets", t => {
  const asyncAsset = {
    name: "chunk1",
    url: true,
    async: true
  };

  const deferredAsset = {
    name: "chunk2",
    url: true,
    defer: true
  };

  const chunks = new RuleSet([asyncAsset, deferredAsset]);

  t.deepEqual(chunks.async(), [asyncAsset]);
});

test("filter deferred assets", t => {
  const asyncAsset = {
    name: "chunk1",
    url: true,
    async: true
  };

  const deferredAsset = {
    name: "chunk2",
    url: true,
    defer: true
  };

  const chunks = new RuleSet([asyncAsset, deferredAsset]);

  t.deepEqual(chunks.defer(), [deferredAsset]);
});

test("an asset can be both url and inline", t => {
  const asset1 = {
    name: "chunk1",
    url: true,
    inline: true
  };

  const asset2 = {
    name: "chunk2",
    url: true,
    inline: true
  };

  const chunks = [asset1, asset2];

  const rules = new RuleSet(chunks);

  t.deepEqual(rules.url(), chunks);
  t.deepEqual(rules.inline(), chunks);
});
