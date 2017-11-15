"use strict";

const is = require("is");

exports.keep = (chunks, rules) => {
  if (!is.array(chunks)) return [];
  if (!is.array(rules)) return [];

  return chunks.filter(chunk => chunkFilter(rules, chunk));
};

exports.match = (chunk, rules) => {
  if (!is.object(chunk))
    throw new TypeError(
      `Chunk should be specified as object; currently ${JSON.stringify(chunk)}`
    );

  if (!is.array(rules))
    throw new TypeError(
      `Rules should be specified as array; currently ${JSON.stringify(rules)}`
    );

  return rules.find(rule => this.matches(rule, chunk));
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
