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

test("read file", async t => {
  const path = "fake-dir/read-target-file";
  const content = "reading lorem ipsum";
  const mockedFile = { [path]: content };
  mock(mockedFile);

  const file = await io.read(path);

  t.is(file, content);

  mock.restore();
});
