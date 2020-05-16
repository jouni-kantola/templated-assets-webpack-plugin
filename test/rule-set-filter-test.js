import test from "ava";

import RuleSet from "../lib/rule-set";
import Rule from "../lib/rule";

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

  t.deepEqual(ruleSet.inline().rules, [new Rule(inlineAsset)]);
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

  t.deepEqual(ruleSet.url().rules, [new Rule(urlAsset)]);
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
    new Rule({ name: "chunk3", output: { url: true } }),
    new Rule({ name: "chunk4", output: { url: true } })
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

  t.deepEqual(ruleSet.async().rules, [new Rule(asyncAsset)]);
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

  t.deepEqual(ruleSet.defer().rules, [new Rule(deferredAsset)]);
});

test("an asset can be both url and inline", t => {
  const rules = [
    {
      name: "chunk1",
      output: {
        url: true,
        inline: true
      }
    },
    {
      name: "chunk2",
      output: {
        url: true,
        inline: true
      }
    }
  ];

  const ruleSet = RuleSet.from(rules);

  t.deepEqual(ruleSet.url().rules, rules.map(rule => new Rule(rule)));
  t.deepEqual(ruleSet.inline().rules, rules.map(rule => new Rule(rule)));
});

test("an asset can be nomodule", t => {
  const rules = [
    {
      name: "chunk1",
      output: {
        nomodule: true
      }
    }
  ];

  const ruleSet = RuleSet.from(rules);

  t.deepEqual(ruleSet.nomodule().rules, rules.map(rule => new Rule(rule)));
});
