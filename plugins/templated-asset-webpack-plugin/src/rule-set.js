"use strict";

class RuleSet {
  constructor(rules) {
    if (rules && rules.length) {
      this.rules = flatten(rules);
    } else {
      this.rules = [];
    }
  }

  inline() {
    return this.rules.filter(rule => !!rule.inline);
  }

  url() {
    return this.rules.filter(rule => !!rule.url);
  }

  sync() {
    const rules = this.url();

    return rules.filter(rule => !rule.url.async && !rule.url.defer);
  }

  async() {
    const rules = this.url();

    return rules.filter(rule => !!rule.url.async);
  }

  defer() {
    const rules = this.url();

    return rules.filter(rule => !!rule.url.defer);
  }
}

function flatten(rules) {
  return rules.reduce(
    (flattened, rule) => {
      if (!rule.test && !rule.name) {
        throw new Error(
          `rule must be configured with either test (RegExp) or name (string|Array). Invalid configuration ${JSON.stringify(rule)}`
        );
      }

      if (rule.test) {
        if (!(rule.test instanceof RegExp)) {
          throw new TypeError(
            `test property must be regex. Invalid configuration ${JSON.stringify(rule)}`
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
    },
    []
  );
}

module.exports = RuleSet;
