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
  if (rule.name) {
    if (rule.name === chunk.name) return true;
  } else if (rule.test) {
    if (rule.test.test(chunk.filename)) return true;
  }

  return false;
}

module.exports = {
  keep,
  match
};
