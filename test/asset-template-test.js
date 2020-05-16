import test from "ava";

import Asset from "../lib/asset";
import AssetSource from "../lib/asset-source";

test("default template for scripts", t => {
  const assetSource = new AssetSource("file.js", "a source");
  const asset = new Asset("a name", assetSource, "/");

  t.true(asset.template.path.endsWith("/templates/sync.tmpl"));
});

test("default template for styles", t => {
  const assetSource = new AssetSource("styles.css", "a source");
  const asset = new Asset("a name", assetSource, "/");

  t.true(asset.template.path.endsWith("/templates/link-style.tmpl"));
});

test("inline style template", t => {
  const assetSource = new AssetSource("styles.css", "a source");
  const asset = new Asset("a name", assetSource, "/");
  asset.type.inline = true;

  t.true(asset.template.path.endsWith("/templates/inline-style.tmpl"));
});

test("throw when template path not specified as string", t => {
  const assetSource = new AssetSource("file.js", "a source");
  const asset = new Asset("a name", assetSource, "/");

  const error = t.throws(() => {
    asset.template.path = 1;
  }, Error);

  t.is(error.message, "Specify path to template (string)");
});

test("default template is replaced", t => {
  const assetSource = new AssetSource("file.js", "a source");
  const asset = new Asset("a name", assetSource, "/");

  asset.template.path = "a/path";

  t.is(asset.template._path, "a/path");
  t.is(asset.template.path, "a/path");
});

test("default sync template", t => {
  const assetSource = new AssetSource("file.js", "a source");
  const asset = new Asset("a name", assetSource, "/");

  t.true(asset.type.sync);
  t.true(asset.template.path.endsWith("/templates/sync.tmpl"));
});

test("default async/defer template", t => {
  const assetSource = new AssetSource("file.js", "a source");
  const asset = new Asset("a name", assetSource, "/");

  asset.type.async = true;
  asset.type.defer = true;

  t.true(asset.template.path.endsWith("/templates/async-defer.tmpl"));
});

test("default async template", t => {
  const assetSource = new AssetSource("file.js", "a source");
  const asset = new Asset("a name", assetSource, "/");

  asset.type.async = true;

  t.true(asset.template.path.endsWith("/templates/async.tmpl"));
});

test("default defer template", t => {
  const assetSource = new AssetSource("file.js", "a source");
  const asset = new Asset("a name", assetSource, "/");

  asset.type.defer = true;

  t.true(asset.template.path.endsWith("/templates/defer.tmpl"));
});

test("default inline template", t => {
  const assetSource = new AssetSource("file.js", "a source");
  const asset = new Asset("a name", assetSource, "/");

  asset.type.inline = true;

  t.true(asset.template.path.endsWith("/templates/inline.tmpl"));
});

test("default module template", t => {
  const assetSource = new AssetSource("file.js", "a source");
  const asset = new Asset("a name", assetSource, "/");

  asset.type.module = true;

  t.true(asset.template.path.endsWith("/templates/module.tmpl"));
});

test("default nomodule template", t => {
  const assetSource = new AssetSource("file.js", "a source");
  const asset = new Asset("a name", assetSource, "/");

  asset.type.nomodule = true;

  t.true(asset.template.path.endsWith("/templates/nomodule.tmpl"));
});
