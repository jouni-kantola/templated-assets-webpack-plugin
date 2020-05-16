"use strict";

const is = require("is");

const Rule = require("./rule");

class RuleSet {
  constructor(rules) {
    this.rules = rules;
  }

  nomodule() {
    return new RuleSet(this.rules.filter(rule => !!rule.output.nomodule));
  }

  inline() {
    return new RuleSet(this.rules.filter(rule => !!rule.output.inline));
  }

  url() {
    return new RuleSet(this.rules.filter(rule => !!rule.output.url));
  }

  sync() {
    return new RuleSet(
      this.url().rules.filter(rule => !rule.output.async && !rule.output.defer)
    );
  }

  async() {
    return new RuleSet(this.url().rules.filter(rule => !!rule.output.async));
  }

  defer() {
    return new RuleSet(this.url().rules.filter(rule => !!rule.output.defer));
  }

  findBy(chunk) {
    if (!is.object(chunk))
      throw new TypeError(
        `Chunk should be specified as object; currently ${JSON.stringify(
          chunk
        )}`
      );

    return this.rules.find(rule => rule.match(chunk));
  }
}

const isValid = rules => {
  if (!is.array(rules)) return false;

  rules.forEach(rule => {
    if (!rule || (!rule.test && !rule.name)) {
      throw new TypeError(
        `rule must be configured with either test (RegExp) or name (string|Array). Invalid rule: ${JSON.stringify(
          rule
        )}`
      );
    }

    if (rule.test && !is.regexp(rule.test)) {
      throw new TypeError(
        `test property must be regex. Invalid rule: ${JSON.stringify(rule)}`
      );
    }
  });

  return true;
};

const flatten = rules => {
  return rules.reduce((flattened, rule) => {
    if (rule.test) {
      delete rule.name;
      flattened.push(rule);
    } else if (is.string(rule.name)) {
      flattened.push(rule);
    } else if (is.array(rule.name)) {
      const cloned = rule.name.map(name => {
        const clone = Object.assign({}, rule);
        clone.name = name;
        return clone;
      });
      return flattened.concat(cloned);
    }
    return flattened;
  }, []);
};

exports.from = rules => {
  return new RuleSet(
    isValid(rules) ? flatten(rules).map(rule => new Rule(rule)) : []
  );
};
