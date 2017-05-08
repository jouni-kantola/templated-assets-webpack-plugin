"use strict";

function keep(chunks, rules) {
  if (!chunks || !Array.isArray(chunks)) return [];
  if (!rules || !Array.isArray(rules)) return [];

  return chunks.filter(chunk => chunkFilter(rules, chunk));
}

function match(chunk, rules) {
  if (!(typeof chunk === "object"))
    throw new TypeError(
      `Chunk should be specified as object; currently ${JSON.stringify(chunk)}`
    );

  if (!Array.isArray(rules))
    throw new TypeError(
      `Rules should be specified as array; currently ${JSON.stringify(rules)}`
    );

  const matchingRules = rules.filter(rule => matches(rule, chunk));
  return matchingRules.length ? matchingRules[0] : undefined;
}

function chunkFilter(rules, chunk) {
  if (rules.some(rule => matches(rule, chunk))) return true;
  return false;
}

function matches(rule, chunk) {
  let match = false;

  if (rule.name && rule.name === chunk.name) {
    match = true;
  } else if (rule.test && rule.test.test(chunk.filename)) {
    match = true;
  }

  if (rule.exclude && rule.exclude.test(chunk.filename)) {
    match = false;
  }

  return match;
}

module.exports = {
  keep,
  match
};
