import test from "ava";
import Asset from "../lib/asset";

test("default template for scripts", t => {
  const asset = new Asset("name", { content: "a source", filename: "file.js" });

  t.true(asset.template.path.endsWith("/templates/sync.tmpl"));
});

test("default template for styles", t => {
  const asset = new Asset("name", {
    content: "a source",
    filename: "styles.css"
  });

  t.true(asset.template.path.endsWith("/templates/link-style.tmpl"));
});

test("inline style template", t => {
  const asset = new Asset("name", {
    content: "a source",
    filename: "styles.css"
  });
  asset.type.inline = true;

  t.true(asset.template.path.endsWith("/templates/inline-style.tmpl"));
});

test("throw when template path not specified as string", t => {
  const asset = new Asset("name", { content: "a source", filename: "file.js" });

  const error = t.throws(
    () => {
      asset.template.path = 1;
    },
    Error
  );

  t.is(error.message, "Specify path to template (as string)");
});

test("default template is replaced", t => {
  const asset = new Asset("name", { content: "a source", filename: "file.js" });
  asset.template.path = "a/path";

  t.is(asset.template._path, "a/path");
  t.is(asset.template.path, "a/path");
});

test("default sync template", t => {
  const asset = new Asset("name", { content: "a source", filename: "file.js" });

  t.true(asset.type.sync);
  t.true(asset.template.path.endsWith("/templates/sync.tmpl"));
});

test("default async/defer template", t => {
  const asset = new Asset("name", { content: "a source", filename: "file.js" });
  asset.type.async = true;
  asset.type.defer = true;

  t.true(asset.template.path.endsWith("/templates/async-defer.tmpl"));
});

test("default async template", t => {
  const asset = new Asset("name", { content: "a source", filename: "file.js" });
  asset.type.async = true;

  t.true(asset.template.path.endsWith("/templates/async.tmpl"));
});

test("default defer template", t => {
  const asset = new Asset("name", { content: "a source", filename: "file.js" });
  asset.type.defer = true;

  t.true(asset.template.path.endsWith("/templates/defer.tmpl"));
});

test("default inline template", t => {
  const asset = new Asset("name", { content: "a source", filename: "file.js" });
  asset.type.inline = true;

  t.true(asset.template.path.endsWith("/templates/inline.tmpl"));
});
