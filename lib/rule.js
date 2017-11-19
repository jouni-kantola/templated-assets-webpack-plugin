"use strict";

class Rule {
  constructor(rule) {
    this.output = rule.output || {};
    if (!this.output.inline) {
      this.output.url = true;
    }
    Object.assign(this, rule);
  }

  match(chunk) {
    if (this.exclude && this.exclude.test(chunk.filename)) return false;

    return (
      (this.test && this.test.test(chunk.filename)) ||
      (this.name && this.name === chunk.name)
    );
  }
}

module.exports = Rule;
