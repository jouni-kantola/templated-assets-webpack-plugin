import test from "ava";
import TemplatedChunks from "../src/templated-chunks";

/*
const config = {
  chunks: [
    {
      name: ['app', 'vendor'] || 'app'
      test: /lala/,
      exclude: /(node_modules)/,
      inline: {
        template:  path.join(__dirname, 'tmpl/chunk-manifest.tmpl') <-- optional
        replace: '##SOURCE##'
      },
      url: {
        template:  path.join(__dirname, 'tmpl/chunk-manifest.tmpl')
        replace: '##URL##'
        async: true,
        defer: true
      }
    }
  ]
}
*/

test("default to empty array", t => {
  const config = new TemplatedChunks();

  t.deepEqual(config.chunks, []);
});

test("treat name string as single chunk", t => {
  const chunks = [
    {
      name: "chunk1"
    },
    {
      name: "chunk2"
    }
  ];

  const config = new TemplatedChunks(chunks);

  t.deepEqual(config.chunks, chunks);
});

test("flatten chunks when name passed as array", t => {
  const chunks = [
    {
      name: ["chunk1", "chunk2"]
    }
  ];

  const config = new TemplatedChunks(chunks);

  t.deepEqual(config.chunks, [{ name: "chunk1" }, { name: "chunk2" }]);
});

test("throw if no name test nor name", t => {
  const error = t.throws(
    () => {
      new TemplatedChunks([{}]);
    },
    Error
  );

  t.truthy(
    error.message.startsWith(
      "chunk must be configured with either test (RegExp) or name (string|Array)."
    )
  );
});

test("throw if test not regex", t => {
  const error = t.throws(
    () => {
      new TemplatedChunks([
        {
          test: "not instance of regex"
        }
      ]);
    },
    TypeError
  );

  t.truthy(error.message.startsWith("test property must be regex."));
});

test("should prioritize regex over name", t => {
  const chunks = [
    {
      name: ["chunk1", "chunk2"],
      test: /chunk/
    }
  ];

  const config = new TemplatedChunks(chunks);

  t.deepEqual(config.chunks, [{ test: /chunk/ }]);
});
