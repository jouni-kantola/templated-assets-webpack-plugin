function match(chunks, rules) {
  if (!chunks || !Array.isArray(chunks)) return [];
  if (!rules || !Array.isArray(rules)) return [];

  return chunks.filter(chunk => chunkFilter(rules, chunk));
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
  match
};
