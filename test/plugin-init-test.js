import test from "ava";
import Plugin from "../lib/plugin";

test("fallback to rule set for all JavaScript and CSS files", t => {
  const { rules } = new Plugin().pluginOptions;
  t.true(Array.isArray(rules));
  t.is(rules.length, 1);
  const rule = rules.pop();

  t.true(rule.test.test("a-javascript-file.abc1234.js"));
  t.true(rule.test.test("a-css-file.abc1234.css"));
  t.false(rule.test.test("an-svg-file.abc1234.svg"));
});

test("init rules", t => {
  const { rules } = new Plugin({
    rules: [{ name: "an-entry" }]
  }).pluginOptions;

  t.true(Array.isArray(rules));
  t.is(rules.length, 1);
});
