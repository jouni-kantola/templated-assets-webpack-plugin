import path from "path";
import test from "ava";

import RulesSet from "../lib/rule-set";

const rules = [
  {
    name: "app",
    exclude: /(node_modules)/,
    url: {
      template: path.join(__dirname, "tmpl/chunk-manifest.tmpl"),
      replace: "##URL##",
      defer: true
    }
  },
  {
    name: "vendor",
    exclude: /(node_modules)/,
    inline: {
      template: path.join(__dirname, "tmpl/chunk-manifest.tmpl"),
      replace: "##SOURCE##"
    },
    url: {
      template: path.join(__dirname, "tmpl/chunk-manifest.tmpl"),
      replace: "##URL##",
      async: true,
      defer: true
    }
  },
  {
    name: "manifest",
    exclude: /(node_modules)/,
    inline: {
      template: path.join(__dirname, "tmpl/chunk-manifest.tmpl"),
      replace: "##SOURCE##"
    }
  },
  {
    test: /manifest.json$/,
    exclude: /(node_modules)/,
    inline: {
      template: path.join(__dirname, "tmpl/chunk-manifest.tmpl"),
      replace: "##SOURCE##"
    }
  }
];

const ruleSet = new RulesSet(rules);

test("ensure chunk", t => {
  const error = t.throws(() => {
    ruleSet.findBy();
  }, Error);

  t.truthy(error.message.startsWith("Chunk should be specified as object"));
});

test("do not match chunk", t => {
  const chunk = {
    name: "not-match",
    filename: "not-match.js"
  };

  const rule = ruleSet.findBy(chunk);

  t.is(rule, undefined);
});

test("match rule with chunk's name", t => {
  const chunk = {
    name: "app"
  };

  const rule = ruleSet.findBy(chunk);

  t.is(rule.name, "app");
});

test("match rule with chunk's filename", t => {
  const chunk = {
    filename: "manifest.json"
  };

  const rule = ruleSet.findBy(chunk);
  const regex = rule.test;

  t.truthy(regex.test(chunk.filename));
});
