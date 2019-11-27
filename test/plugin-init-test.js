import test from "ava";
import Plugin from "../lib/plugin";

test("fallback to empty rule set", t => {
  const { rules } = new Plugin().pluginOptions;
  t.true(Array.isArray(rules));
  t.is(rules.length, 0);
});

test("init rules", t => {
  const { rules } = new Plugin({
    rules: [{ name: "an-entry" }]
  }).pluginOptions;

  t.true(Array.isArray(rules));
  t.is(rules.length, 1);
});
