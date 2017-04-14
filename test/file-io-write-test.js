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

test.cb("create directory if needed", t => {
  const path = "path/empty/directory";
  const filePath = `${path}/sub-folder/a-file`;

  const content = "writing lorem ipsum";
  const mockedDir = { [path]: {} };
  mock(mockedDir);

  io.write(filePath, content, () => {
    io.read(filePath).then(file => {
      t.is(file, "writing lorem ipsum");

      mock.restore();
      t.end();
    });
  });
});
