"use strict";

const is = require("is");

exports.keep = (chunks, rules) => {
  if (!is.array(chunks)) return [];
  if (!is.array(rules)) return [];

  return chunks.filter(chunk => chunkFilter(rules, chunk));
};

const chunkFilter = (rules, chunk) =>
  rules.some(rule => this.matches(rule, chunk));

exports.matches = (rule, chunk) => {
  if (rule.exclude && rule.exclude.test(chunk.filename)) return false;

  return (
    (rule.test && rule.test.test(chunk.filename)) ||
    (rule.name && rule.name === chunk.name)
  );
};
