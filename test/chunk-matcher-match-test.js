import path from "path";
import test from "ava";
import chunkMatcher from "../lib/chunk-matcher";

test("ensure chunk", t => {
  const error = t.throws(
    () => {
      chunkMatcher.match(undefined, rules);
    },
    Error
  );

  t.truthy(error.message.startsWith("Chunk should be specified as object"));
});

test("ensure rules", t => {
  const error = t.throws(
    () => {
      chunkMatcher.match({}, undefined);
    },
    Error
  );

  t.truthy(error.message.startsWith("Rules should be specified as array"));
});

test("do not match chunk", t => {
  const chunks = [
    {
      name: "not-match",
      filename: "not-match.js"
    }
  ];

  const rule = chunkMatcher.match(chunks, rules);

  t.is(rule, undefined);
});

test("match rule with chunk's name", t => {
  const chunk = {
    name: "app"
  };

  const rule = chunkMatcher.match(chunk, rules);

  t.is(rule.name, "app");
});

test("match rule with chunk's filename", t => {
  const chunk = {
    filename: "manifest.json"
  };

  const rule = chunkMatcher.match(chunk, rules);
  const regex = rule.test;

  t.truthy(regex.test(chunk.filename));
});

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
