import test from "ava";
import mock from "mock-fs";

import io from "../lib/file-io";

test("ensure path", t => {
  const error = t.throws(
    () => {
      io.write();
    },
    Error
  );

  t.is(error.message, "No file path specified");
});

test("should write content to file", async t => {
  const path = "path/empty/directory";
  const filePath = `${path}/a-file`;

  const content = "writing lorem ipsum";
  const mockedDir = { [path]: {} };
  mock(mockedDir);

  await io.write(filePath, content);
  t.is(await io.read(filePath), content);

  mock.restore();
});
