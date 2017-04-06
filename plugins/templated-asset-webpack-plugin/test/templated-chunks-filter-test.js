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

test("filter inline assets", t => {
  const inlineAsset = {
    name: "chunk1",
    inline: {}
  };

  const urlAsset = {
    name: "chunk2",
    url: {}
  };

  const chunks = new TemplatedChunks([inlineAsset, urlAsset]);

  t.deepEqual(chunks.inline(), [inlineAsset]);
});

test("filter url assets", t => {
  const inlineAsset = {
    name: "chunk1",
    inline: {}
  };

  const urlAsset = {
    name: "chunk2",
    url: {}
  };

  const chunks = new TemplatedChunks([inlineAsset, urlAsset]);

  t.deepEqual(chunks.url(), [urlAsset]);
});

test("filter async assets", t => {
  const asyncAsset = {
    name: "chunk1",
    url: {
        async: true
    }
  };

  const deferredAsset = {
    name: "chunk2",
    url: {
        defer: true
    }
  };

  const chunks = new TemplatedChunks([asyncAsset, deferredAsset]);

  t.deepEqual(chunks.async(), [asyncAsset]);
});

test("filter deferred assets", t => {
  const asyncAsset = {
    name: "chunk1",
    url: {
        async: true
    }
  };

  const deferredAsset = {
    name: "chunk2",
    url: {
        defer: true
    }
  };

  const chunks = new TemplatedChunks([asyncAsset, deferredAsset]);

  t.deepEqual(chunks.defer(), [deferredAsset]);
});

test("an asset can be both url and inline", t => {
  const asset1 = {
    name: "chunk1",
    url: {},
    inline: {}
  };

  const asset2 = {
    name: "chunk2",
    url: {},
    inline: {}
  };

  const chunks = [asset1, asset2];

  const templatedChunks = new TemplatedChunks(chunks);

  t.deepEqual(templatedChunks.url(), chunks);
  t.deepEqual(templatedChunks.inline(), chunks);
});
