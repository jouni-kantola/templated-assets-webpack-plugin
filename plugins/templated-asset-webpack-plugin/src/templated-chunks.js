class TemplatedChunks {
  constructor(chunks) {
    if (chunks && chunks.length) {
      this.chunks = flatten(chunks);
    } else {
      this.chunks = [];
    }
  }
}

function flatten(chunks) {
  const flattenedChunks = chunks.reduce(
    (flattened, chunk) => {
      if (!chunk.test && !chunk.name) {
        throw new Error(
          `chunk must be configured with either test (RegExp) or name (string|Array). Invalid configuration ${JSON.stringify(chunk)}`
        );
      }

      if (chunk.test) {
        if (!(chunk.test instanceof RegExp)) {
          throw new TypeError(
            `test property must be regex. Invalid configuration ${JSON.stringify(chunk)}`
          );
        }

        delete chunk.name;
        flattened.push(chunk);
      } else if (typeof chunk.name === "string") {
        flattened.push(chunk);
      } else if (Array.isArray(chunk.name)) {
        const cloned = chunk.name.map(name => {
          const clone = Object.assign({}, chunk);
          clone.name = name;
          return clone;
        });
        return flattened.concat(cloned);
      }
      return flattened;
    },
    []
  );

  return flattenedChunks;
}

module.exports = TemplatedChunks;
