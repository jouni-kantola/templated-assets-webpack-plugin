import test from "ava";
import RuleSet from "../lib/rule-set";
import Rule from "../lib/rule";

test("default to empty array", t => {
  t.deepEqual(RuleSet.from().rules, []);
});

test("treat name string as single chunk", t => {
  const rules = [{ name: "chunk1" }, { name: "chunk2" }];

  const ruleSet = RuleSet.from(rules);

  t.deepEqual(ruleSet.rules, [
    new Rule({
      name: "chunk1",
      output: {
        url: true
      }
    }),
    new Rule({
      name: "chunk2",
      output: {
        url: true
      }
    })
  ]);
});

test("flatten rules when name passed as array", t => {
  const rules = [
    {
      name: ["chunk1", "chunk2"]
    }
  ];

  const ruleSet = RuleSet.from(rules);

  t.deepEqual(ruleSet.rules, [
    new Rule({ name: "chunk1", output: { url: true } }),
    new Rule({ name: "chunk2", output: { url: true } })
  ]);
});

test("throw if rule undefined", t => {
  const error = t.throws(() => {
    RuleSet.from([undefined]);
  }, TypeError);

  t.truthy(
    error.message.startsWith(
      "rule must be configured with either test (RegExp) or name (string|Array)."
    )
  );
});

test("throw if no name test nor name", t => {
  const error = t.throws(() => {
    RuleSet.from([{}]);
  }, TypeError);

  t.truthy(
    error.message.startsWith(
      "rule must be configured with either test (RegExp) or name (string|Array)."
    )
  );
});

test("throw if test not regex", t => {
  const error = t.throws(() => {
    RuleSet.from([
      {
        test: "not instance of regex"
      }
    ]);
  }, TypeError);

  t.truthy(error.message.startsWith("test property must be regex."));
});

test("should prioritize regex over name", t => {
  const rules = [
    {
      name: ["chunk1", "chunk2"],
      test: /chunk/
    }
  ];

  t.deepEqual(RuleSet.from(rules).rules, [
    new Rule({ test: /chunk/, output: { url: true } })
  ]);
});

test("default to url rule if no output configured", t => {
  const rules = [
    {
      name: ["chunk1", "chunk2"]
    }
  ];

  const actual = RuleSet.from(rules).rules;

  t.deepEqual(actual, [
    new Rule({ name: "chunk1", output: { url: true } }),
    new Rule({ name: "chunk2", output: { url: true } })
  ]);
});

test("default to url rule if not inline", t => {
  const rules = [
    {
      name: ["chunk1", "chunk2"]
    }
  ];

  t.deepEqual(RuleSet.from(rules).rules, [
    new Rule({ name: "chunk1", output: { url: true } }),
    new Rule({ name: "chunk2", output: { url: true } })
  ]);
});

test("is also url when defer", t => {
  const rules = [
    {
      name: "chunk1",
      output: {
        defer: true
      }
    }
  ];

  t.deepEqual(RuleSet.from(rules).rules, [
    new Rule({ name: "chunk1", output: { url: true, defer: true } })
  ]);
});

test("is also url when async", t => {
  const rules = [
    {
      name: "chunk1",
      output: {
        async: true
      }
    }
  ];

  t.deepEqual(RuleSet.from(rules).rules, [
    new Rule({ name: "chunk1", output: { url: true, async: true } })
  ]);
});
