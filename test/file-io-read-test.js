import test from "ava";
import mock from "mock-fs";

import io from "../lib/file-io";

test("ensure path", t => {
  const error = t.throws(
    () => {
      io.read();
    },
    Error
  );

  t.is(error.message, "No file path specified");
});

test.serial("read file", async t => {
  const path = "fake-dir/read-file";
  const content = "reading lorem ipsum 1";
  const mockedFile = { [path]: content };
  mock(mockedFile);

  t.is(await io.read(path), content);

  mock.restore();
});

test.serial("reject when file not found", async t => {
  const path = "fake-dir/read-target-file";
  const mockedFile = { "fake-dir": {} };
  mock(mockedFile);

  try {
    await io.read(path);
  } catch (e) {
    t.is(e, `File not found: ${path}`);
  }

  mock.restore();
});
