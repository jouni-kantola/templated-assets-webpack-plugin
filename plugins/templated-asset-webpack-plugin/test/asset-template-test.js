import test from "ava";
import Asset from "../src/asset";

test("default template", t => {
  const asset = new Asset("name");

  t.true(asset.template.path.endsWith("/templates/sync.tmpl"));
});

test("throw when template path not specified as string", t => {
  const asset = new Asset("name");

  const error = t.throws(
    () => {
      asset.template.path = 1;
    },
    Error
  );

  t.is(error.message, "Specify path to template (as string)");
});

test("default template is replaced", t => {
  const asset = new Asset("name");
  asset.template.path = "a/path";

  t.is(asset.template._path, "a/path");
  t.is(asset.template.path, "a/path");
});

test("default sync template", t => {
  const asset = new Asset("name");

  t.true(asset.type.sync);
  t.true(asset.template.path.endsWith("/templates/sync.tmpl"));
});

test("default async/defer template", t => {
  const asset = new Asset("name");
  asset.type.async = true;
  asset.type.defer = true;

  t.true(asset.template.path.endsWith("/templates/async-defer.tmpl"));
});

test("default async template", t => {
  const asset = new Asset("name");
  asset.type.async = true;

  t.true(asset.template.path.endsWith("/templates/async.tmpl"));
});

test("default defer template", t => {
  const asset = new Asset("name");
  asset.type.defer = true;

  t.true(asset.template.path.endsWith("/templates/defer.tmpl"));
});

test("default inline template", t => {
  const asset = new Asset("name");
  asset.type.defer = true;

  t.true(asset.template.path.endsWith("/templates/defer.tmpl"));
});

test("ensure value to replace", t => {
  const asset = new Asset("name");
  const error = t.throws(
    () => {
      asset.template.replace = 1;
    },
    Error
  );

  t.is(
    error.message,
    "Specify value in template to replace (string || RegExp)"
  );
});

test("default replacement is updated when value is string", t => {
  const asset = new Asset("name");
  const replacement = "find this";
  asset.template.replace = replacement;

  t.is(asset.template._replace, replacement);
  t.true(asset.template.replace.test(replacement));
});

test("default replacement is updated when value is RegExp", t => {
  const asset = new Asset("name");
  const replacement = "find this";
  asset.template.replace = new RegExp(replacement);

  t.true(asset.template._replace.test(replacement));
  t.true(asset.template.replace.test(replacement));
});

test("default replacement", t => {
  const asset = new Asset("name");

  t.true(asset.template.replace.test("##URL##"));
});

test("default async replacement", t => {
  const asset = new Asset("name");
  asset.type.async = true;

  t.true(asset.template.replace.test("##URL##"));
});

test("default defer replacement", t => {
  const asset = new Asset("name");
  asset.type.defer = true;

  t.true(asset.template.replace.test("##URL##"));
});

test("default inline replacement", t => {
  const asset = new Asset("name");
  asset.type.inline = true;

  t.true(asset.template.replace.test("##SOURCE##"));
});
