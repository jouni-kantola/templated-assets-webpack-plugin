import path from "path";
import test from "ava";
import chunkMatcher from "../lib/chunk-matcher";

test("default to empty array when no chunks", t => {
  const assets = chunkMatcher.keep(undefined, rules);

  t.truthy(Array.isArray(assets));
  t.is(assets.length, 0);
});

test("default to empty array when no templated chunks", t => {
  const assets = chunkMatcher.keep([], undefined);

  t.truthy(Array.isArray(assets));
  t.is(assets.length, 0);
});

test("keep matching named chunks", t => {
  const chunks = [
    {
      name: "app"
    },
    {
      name: "vendor"
    },
    {
      name: "not-match"
    }
  ];

  const assets = chunkMatcher.keep(chunks, rules);

  t.is(assets.length, 2);
  t.is(assets[0].name, "app");
  t.is(assets[1].name, "vendor");
});

test("keep matching chunk filenames by regex", t => {
  const chunks = [
    {
      filename: "not-match1.js"
    },
    {
      filename: "manifest.json"
    }
  ];

  const assets = chunkMatcher.keep(chunks, rules);

  t.is(assets.length, 1);
  t.is(assets[0].filename, "manifest.json");
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
