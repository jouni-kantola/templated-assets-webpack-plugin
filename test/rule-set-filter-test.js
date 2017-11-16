import test from "ava";
import RuleSet from "../lib/rule-set";

test("filter inline assets", t => {
  const inlineAsset = {
    name: "chunk1",
    output: {
      inline: true
    }
  };

  const urlAsset = {
    name: "chunk2"
  };

  const ruleSet = RuleSet.from([inlineAsset, urlAsset]);

  t.deepEqual(ruleSet.inline().rules, [inlineAsset]);
});

test("filter url assets", t => {
  const inlineAsset = {
    name: "chunk1",
    output: {
      inline: true
    }
  };

  const urlAsset = {
    name: "chunk2",
    output: {
      url: true
    }
  };

  const ruleSet = RuleSet.from([inlineAsset, urlAsset]);

  t.deepEqual(ruleSet.url().rules, [urlAsset]);
});

test("filter sync assets", t => {
  const asyncAsset = {
    name: "chunk1",
    output: {
      url: true,
      async: true
    }
  };

  const deferredAsset = {
    name: "chunk2",
    output: {
      url: true,
      defer: true
    }
  };

  const syncAsset = {
    name: ["chunk3", "chunk4"],
    output: {
      url: true
    }
  };

  const ruleSet = RuleSet.from([asyncAsset, deferredAsset, syncAsset]);

  t.deepEqual(ruleSet.sync().rules, [
    { name: "chunk3", output: { url: true } },
    { name: "chunk4", output: { url: true } }
  ]);
});

test("filter async assets", t => {
  const asyncAsset = {
    name: "chunk1",
    output: {
      async: true
    }
  };

  const deferredAsset = {
    name: "chunk2",
    output: {
      url: true,
      defer: true
    }
  };

  const ruleSet = RuleSet.from([asyncAsset, deferredAsset]);

  t.deepEqual(ruleSet.async().rules, [asyncAsset]);
});

test("filter deferred assets", t => {
  const asyncAsset = {
    name: "chunk1",
    output: {
      url: true,
      async: true
    }
  };

  const deferredAsset = {
    name: "chunk2",
    output: {
      defer: true
    }
  };

  const ruleSet = RuleSet.from([asyncAsset, deferredAsset]);

  t.deepEqual(ruleSet.defer().rules, [deferredAsset]);
});

test("an asset can be both url and inline", t => {
  const asset1 = {
    name: "chunk1",
    output: {
      url: true,
      inline: true
    }
  };

  const asset2 = {
    name: "chunk2",
    output: {
      url: true,
      inline: true
    }
  };

  const rules = [asset1, asset2];

  const ruleSet = RuleSet.from(rules);

  t.deepEqual(ruleSet.url().rules, rules);
  t.deepEqual(ruleSet.inline().rules, rules);
});
