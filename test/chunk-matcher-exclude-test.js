import test from "ava";
import chunkMatcher from "../lib/chunk-matcher";

test("exclude chunks by regex", t => {
  const chunks = [
    {
      filename: "match.json"
    },
    {
      filename: "match.js"
    }
  ];

  const assets = chunkMatcher.keep(chunks, [
    {
      test: /^match/,
      exclude: /\.json$/
    }
  ]);

  t.is(assets.length, 1);
  t.is(assets[0].filename, "match.js");
});

test("exclude async chunks", t => {
  const chunks = [
    {
      name: "chunk",
      filename: "chunk.js"
    },
    {
      name: "chunk",
      filename: "0.async-chunk.js"
    }
  ];

  const assets = chunkMatcher.keep(chunks, [
    {
      name: "chunk",
      exclude: /^[0-9]+\./
    }
  ]);

  t.is(assets.length, 1);
  t.is(assets[0].filename, "chunk.js");
});

test("only exclude if matches regex", t => {
  const chunks = [
    {
      filename: "match.json"
    },
    {
      filename: "match.js"
    }
  ];

  const assets = chunkMatcher.keep(chunks, [
    {
      test: /^match/,
      exclude: /non-match/
    }
  ]);

  t.is(assets.length, 2);
  t.is(assets[0].filename, "match.json");
  t.is(assets[1].filename, "match.js");
});
