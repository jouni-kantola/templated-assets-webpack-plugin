/**
 * Type tests for templated-assets-webpack-plugin
 * This file should compile without errors if the types are correct.
 * Run with: tsc --noEmit test-types.ts
 */

import TemplatedAssetsWebpackPlugin = require("./index");

// Test: Default constructor (no options)
const plugin1 = new TemplatedAssetsWebpackPlugin();

// Test: Empty options
const plugin2 = new TemplatedAssetsWebpackPlugin({});

// Test: Empty rules array
const plugin3 = new TemplatedAssetsWebpackPlugin({
  rules: []
});

// Test: Rule with name as string
const plugin4 = new TemplatedAssetsWebpackPlugin({
  rules: [
    {
      name: "app"
    }
  ]
});

// Test: Rule with name as array
const plugin5 = new TemplatedAssetsWebpackPlugin({
  rules: [
    {
      name: ["app", "vendor", "runtime"]
    }
  ]
});

// Test: Rule with test (RegExp)
const plugin6 = new TemplatedAssetsWebpackPlugin({
  rules: [
    {
      test: /\.js$/
    }
  ]
});

// Test: Rule with exclude
const plugin7 = new TemplatedAssetsWebpackPlugin({
  rules: [
    {
      test: /\.js$/,
      exclude: /node_modules/
    }
  ]
});

// Test: Template as string
const plugin8 = new TemplatedAssetsWebpackPlugin({
  rules: [
    {
      name: "app",
      template: "/path/to/template.tmpl"
    }
  ]
});

// Test: Template as object with path
const plugin9 = new TemplatedAssetsWebpackPlugin({
  rules: [
    {
      name: "app",
      template: {
        path: "/path/to/template.tmpl"
      }
    }
  ]
});

// Test: Template with replace as string
const plugin10 = new TemplatedAssetsWebpackPlugin({
  rules: [
    {
      name: "app",
      template: {
        replace: "##PLACEHOLDER##"
      }
    }
  ]
});

// Test: Template with replace as RegExp
const plugin11 = new TemplatedAssetsWebpackPlugin({
  rules: [
    {
      name: "app",
      template: {
        replace: /##PLACEHOLDER##/g
      }
    }
  ]
});

// Test: Template with header as string
const plugin12 = new TemplatedAssetsWebpackPlugin({
  rules: [
    {
      name: "app",
      template: {
        header: "<!-- Header -->"
      }
    }
  ]
});

// Test: Template with header as function
const plugin13 = new TemplatedAssetsWebpackPlugin({
  rules: [
    {
      name: "app",
      template: {
        header: () => "<!-- Generated Header -->"
      }
    }
  ]
});

// Test: Template with footer as string
const plugin14 = new TemplatedAssetsWebpackPlugin({
  rules: [
    {
      name: "app",
      template: {
        footer: "<!-- Footer -->"
      }
    }
  ]
});

// Test: Template with footer as function
const plugin15 = new TemplatedAssetsWebpackPlugin({
  rules: [
    {
      name: "app",
      template: {
        footer: () => "<!-- Generated Footer -->"
      }
    }
  ]
});

// Test: Template as function
const plugin16 = new TemplatedAssetsWebpackPlugin({
  rules: [
    {
      name: "app",
      template: (asset, callback) => {
        const templated = `<script src="${asset.url}"></script>`;
        callback(templated);
      }
    }
  ]
});

// Test: Template function with args
const plugin17 = new TemplatedAssetsWebpackPlugin({
  rules: [
    {
      name: "app",
      template: (asset, callback, ...args) => {
        const customArg = args[0];
        callback(`<!-- ${customArg} -->`);
      },
      args: ["custom-arg", 123, { key: "value" }]
    }
  ]
});

// Test: Output with inline
const plugin18 = new TemplatedAssetsWebpackPlugin({
  rules: [
    {
      name: "runtime",
      output: {
        inline: true
      }
    }
  ]
});

// Test: Output with async
const plugin19 = new TemplatedAssetsWebpackPlugin({
  rules: [
    {
      test: /app.*\.js$/,
      output: {
        async: true
      }
    }
  ]
});

// Test: Output with defer
const plugin20 = new TemplatedAssetsWebpackPlugin({
  rules: [
    {
      test: /app.*\.js$/,
      output: {
        defer: true
      }
    }
  ]
});

// Test: Output with module
const plugin21 = new TemplatedAssetsWebpackPlugin({
  rules: [
    {
      name: "app",
      output: {
        module: true
      }
    }
  ]
});

// Test: Output with nomodule
const plugin22 = new TemplatedAssetsWebpackPlugin({
  rules: [
    {
      name: "legacy",
      output: {
        nomodule: true
      }
    }
  ]
});

// Test: Output with name as string
const plugin23 = new TemplatedAssetsWebpackPlugin({
  rules: [
    {
      test: /\.css$/,
      output: {
        name: "styles"
      }
    }
  ]
});

// Test: Output with name as function
const plugin24 = new TemplatedAssetsWebpackPlugin({
  rules: [
    {
      test: /\.css$/,
      output: {
        name: (defaultName) => defaultName.split(".")[0]
      }
    }
  ]
});

// Test: Output with prefix
const plugin25 = new TemplatedAssetsWebpackPlugin({
  rules: [
    {
      name: "app",
      output: {
        prefix: "__"
      }
    }
  ]
});

// Test: Output with extension
const plugin26 = new TemplatedAssetsWebpackPlugin({
  rules: [
    {
      name: "app",
      output: {
        extension: "cshtml"
      }
    }
  ]
});

// Test: Output with path as string
const plugin27 = new TemplatedAssetsWebpackPlugin({
  rules: [
    {
      name: "runtime",
      output: {
        path: "custom/output/path"
      }
    }
  ]
});

// Test: Output with path as array
const plugin28 = new TemplatedAssetsWebpackPlugin({
  rules: [
    {
      name: "runtime",
      output: {
        path: ["path1", "path2", "path3"]
      }
    }
  ]
});

// Test: Output with emitAsset
const plugin29 = new TemplatedAssetsWebpackPlugin({
  rules: [
    {
      name: "runtime",
      output: {
        emitAsset: false
      }
    }
  ]
});

// Test: Rule with replace at top level
const plugin30 = new TemplatedAssetsWebpackPlugin({
  rules: [
    {
      name: "app",
      replace: "##CUSTOM##"
    }
  ]
});

// Test: Complex real-world example
const plugin31 = new TemplatedAssetsWebpackPlugin({
  rules: [
    {
      test: /app.*\.js$/,
      output: {
        defer: true
      }
    },
    {
      test: /\.css$/,
      template: {
        header: "<!-- css starts here -->",
        footer: () => "<!-- css ends here -->"
      },
      output: {
        name: (defaultName) => defaultName.split(".")[0]
      }
    },
    {
      name: ["vendors"],
      template: (asset, callback, ...args) => {
        const updatedSource = `// built with ${args.join("-")}\n${asset.source}`;
        callback(updatedSource);
      },
      args: ["webpack", "plugin"]
    },
    {
      name: "runtime",
      output: {
        inline: true,
        path: "custom/path",
        emitAsset: false
      },
      template: "/path/to/template.tmpl",
      replace: "##HULAHULA##"
    }
  ]
});

// Test: Apply method
const compiler = {} as any;
plugin1.apply(compiler);

// Test: All output options together
const plugin32 = new TemplatedAssetsWebpackPlugin({
  rules: [
    {
      name: "app",
      output: {
        name: "custom-name",
        prefix: "prefix_",
        extension: "html",
        url: true,
        async: true,
        defer: false,
        nomodule: false,
        module: false,
        inline: false,
        emitAsset: true,
        path: ["path1", "path2"]
      }
    }
  ]
});

// Test: Template with all options
const plugin33 = new TemplatedAssetsWebpackPlugin({
  rules: [
    {
      name: "app",
      template: {
        path: "/template.tmpl",
        replace: /##URL##/,
        header: "<!-- header -->",
        footer: () => "<!-- footer -->"
      }
    }
  ]
});

// Type test: AssetInfo in template function
const plugin34 = new TemplatedAssetsWebpackPlugin({
  rules: [
    {
      name: "app",
      template: (asset, callback) => {
        // These properties should all be accessible
        const filename: string = asset.filename;
        const source: string = asset.source;
        const content: string = asset.content;
        const url: string = asset.url;

        callback(`<script src="${url}"></script>`);
      }
    }
  ]
});

// Test: Multiple rules
const plugin35 = new TemplatedAssetsWebpackPlugin({
  rules: [
    { name: "app" },
    { test: /\.js$/ },
    { name: ["vendor", "runtime"] },
    {
      test: /\.css$/,
      output: { inline: true }
    }
  ]
});
