import test from "ava";
import RuleSet from "../lib/rule-set";

test("default to empty array", t => {
  const config = new RuleSet();

  t.deepEqual(config.rules, []);
});

test("treat name string as single chunk", t => {
  const rules = [
    {
      name: "chunk1"
    },
    {
      name: "chunk2"
    }
  ];

  const config = new RuleSet(rules);

  t.deepEqual(config.rules, rules);
});

test("flatten rules when name passed as array", t => {
  const rules = [
    {
      name: ["chunk1", "chunk2"]
    }
  ];

  const config = new RuleSet(rules);

  t.deepEqual(config.rules, [{ name: "chunk1", url: true }, { name: "chunk2", url: true }]);
});

test("throw if no name test nor name", t => {
  const error = t.throws(
    () => {
      new RuleSet([{}]);
    },
    Error
  );

  t.truthy(
    error.message.startsWith(
      "rule must be configured with either test (RegExp) or name (string|Array)."
    )
  );
});

test("throw if test not regex", t => {
  const error = t.throws(
    () => {
      new RuleSet([
        {
          test: "not instance of regex"
        }
      ]);
    },
    TypeError
  );

  t.truthy(error.message.startsWith("test property must be regex."));
});

test("should prioritize regex over name", t => {
  const rules = [
    {
      name: ["chunk1", "chunk2"],
      test: /chunk/
    }
  ];

  const config = new RuleSet(rules);

  t.deepEqual(config.rules, [{ test: /chunk/, url: true }]);
});

test("default to url rule", t => {
  const rules = [
    {
      name: ["chunk1", "chunk2"]
    }
  ];

  const config = new RuleSet(rules);

  t.deepEqual(config.rules, [{ name: "chunk1", url: true }, { name: "chunk2", url: true }]);
});
