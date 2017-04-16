import test from "ava";
import Plugin from "../lib/plugin";
import RuleSet from "../lib/rule-set";

test("fallback to empty rule set", t => {
  const ruleSet = new Plugin().rules;
  const rules = ruleSet.rules;

  t.true(ruleSet instanceof RuleSet);
  t.true(Array.isArray(rules));
  t.is(rules.length, 0);
});

test("init rules", t => {
  const ruleSet = new Plugin({
    rules: [{ name: "an-entry" }]
  }).rules;
  const rules = ruleSet.rules;

  t.true(ruleSet instanceof RuleSet);
  t.true(Array.isArray(rules));
  t.is(rules.length, 1);
});
