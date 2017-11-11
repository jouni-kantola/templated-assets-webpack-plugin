"use strict";

class RuleSet {
  constructor(rules) {
    if (rules && rules.length) {
      const flattenedRules = flatten(rules);
      this.rules = ensureDefaults(flattenedRules);
    } else {
      this.rules = [];
    }
  }

  inline() {
    return this.rules.filter(rule => !!rule.output.inline);
  }

  url() {
    return this.rules.filter(rule => !!rule.output.url);
  }

  sync() {
    const rules = this.url();

    return rules.filter(rule => !rule.output.async && !rule.output.defer);
  }

  async() {
    const rules = this.url();

    return rules.filter(rule => !!rule.output.async);
  }

  defer() {
    const rules = this.url();

    return rules.filter(rule => !!rule.output.defer);
  }
}

function flatten(rules) {
  return rules.reduce((flattened, rule) => {
    if (!rule || (!rule.test && !rule.name)) {
      throw new TypeError(
        `rule must be configured with either test (RegExp) or name (string|Array). Invalid rule: ${JSON.stringify(
          rule
        )}`
      );
    }

    if (rule.test) {
      if (!(rule.test instanceof RegExp)) {
        throw new TypeError(
          `test property must be regex. Invalid rule: ${JSON.stringify(rule)}`
        );
      }

      delete rule.name;
      flattened.push(rule);
    } else if (typeof rule.name === "string") {
      flattened.push(rule);
    } else if (Array.isArray(rule.name)) {
      const cloned = rule.name.map(name => {
        const clone = Object.assign({}, rule);
        clone.name = name;
        return clone;
      });
      return flattened.concat(cloned);
    }
    return flattened;
  }, []);
}

function ensureDefaults(rules) {
  return rules.map(rule => {
    if (!rule.output) {
      rule.output = {};
    }
    if (!rule.output.inline) {
      rule.output.url = true;
    }
    return rule;
  });
}

module.exports = RuleSet;
