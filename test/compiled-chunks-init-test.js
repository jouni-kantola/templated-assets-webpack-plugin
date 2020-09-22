import test from "ava";
import CompiledChunks from "../lib/compiled-chunks";

test("throw if compiled chunks not specified", t => {
  const error = t.throws(() => {
    new CompiledChunks();
  }, TypeError);

  t.is(error.message, "Compiled chunks required to continue process");
});

test("throw if compiled assets not specified", t => {
  const error = t.throws(() => {
    new CompiledChunks([]);
  }, TypeError);

  t.is(error.message, "Compiled assets required to continue process");
});

test("fallback to empty array", t => {
  t.deepEqual(new CompiledChunks([], {}).chunks, []);
});

test("map compiled chunks", t => {
  const compilation = {
    chunks: [
      {
        name: "a",
        files: ["a.js"]
      },
      {
        name: "b",
        files: ["b.js"]
      }
    ],
    assets: {
      "a.js": {
        source: () => "contents of a.js"
      },
      "b.js": {
        source: () => "contents of b.js"
      }
    }
  };

  const compiledChunks = new CompiledChunks(
    compilation.chunks,
    compilation.assets
  );
  const chunk1 = compiledChunks.chunks[0];
  const chunk2 = compiledChunks.chunks[1];

  const expected1 = compilation.chunks[0];
  const expected2 = compilation.chunks[1];

  t.is(compiledChunks.chunks.length, 2);

  t.is(chunk1.name, expected1.name);
  t.is(chunk1.filename, expected1.files[0]);
  t.is(chunk1.source, compilation.assets[expected1.files[0]].source());
  t.is(chunk1.path, "");
  t.is(chunk1.url, `${expected1.files[0]}`);

  t.is(chunk2.name, expected2.name);
  t.is(chunk2.filename, expected2.files[0]);
  t.is(chunk2.source, compilation.assets[expected2.files[0]].source());
  t.is(chunk2.path, "");
  t.is(chunk2.url, `${expected2.files[0]}`);
});

test("include from assets", t => {
  const compilation = {
    chunks: [
      {
        name: "a",
        files: ["a.js"]
      },
      {
        name: "b",
        files: ["b.js"]
      }
    ],
    assets: {
      "a.js": {
        source: () => "contents of a.js"
      },
      "b.js": {
        source: () => "contents of b.js"
      },
      "c.js": {
        source: () => "contents of c.js"
      }
    }
  };

  const compiledChunks = new CompiledChunks(
    compilation.chunks,
    compilation.assets
  );
  const chunk = compiledChunks.chunks[2];

  t.is(compiledChunks.chunks.length, 3);
  t.is(chunk.filename, "c.js");
  t.is(chunk.path, "");
  t.is(chunk.url, "c.js");
  t.is(chunk.source, "contents of c.js");
});

test("include public path for chunks", t => {
  const compilation = {
    mainTemplate: {
      outputOptions: {
        publicPath: "a public path"
      }
    },
    chunks: [
      {
        name: "a",
        files: ["a.js"]
      }
    ],
    assets: {
      "a.js": {
        source: () => "contents of a.js"
      }
    }
  };

  const compiledChunks = new CompiledChunks(
    compilation.chunks,
    compilation.assets,
    compilation.mainTemplate.outputOptions.publicPath
  );
  const chunk = compiledChunks.chunks[0];

  t.is(compiledChunks.chunks.length, 1);
  t.is(chunk.filename, "a.js");
  t.is(chunk.source, "contents of a.js");
  t.is(chunk.path, "a public path");
  t.is(chunk.url, "a public path/a.js");
});

test("include public path for assets", t => {
  const compilation = {
    mainTemplate: {
      outputOptions: {
        publicPath: "a public path/"
      }
    },
    chunks: [],
    assets: {
      "a.css": {
        source: () => "contents of a.css"
      }
    }
  };

  const compiledChunks = new CompiledChunks(
    compilation.chunks,
    compilation.assets,
    compilation.mainTemplate.outputOptions.publicPath
  );
  const chunk = compiledChunks.chunks[0];

  t.is(compiledChunks.chunks.length, 1);
  t.is(chunk.filename, "a.css");
  t.is(chunk.source, "contents of a.css");
  t.is(chunk.path, "a public path");
  t.is(chunk.url, "a public path/a.css");
});

test("serve assets from root", t => {
  const compilation = {
    outputOptions: {
      publicPath: "/"
    },
    chunks: [],
    assets: {
      "a.css": {
        source: () => "contents of a.css"
      }
    }
  };

  const compiledChunks = new CompiledChunks(
    compilation.chunks,
    compilation.assets,
    compilation.outputOptions.publicPath
  );
  const chunk = compiledChunks.chunks[0];

  t.is(compiledChunks.chunks.length, 1);
  t.is(chunk.filename, "a.css");
  t.is(chunk.source, "contents of a.css");
  t.is(chunk.path, "/");
  t.is(chunk.url, "/a.css");
});
