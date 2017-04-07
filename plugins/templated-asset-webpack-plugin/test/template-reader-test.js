import test from "ava";
import mock from "mock-fs";

import templateReader from "../src/template-reader";

test("ensure path", t => {
  const error = t.throws(
    () => {
      templateReader.read();
    },
    Error
  );

  t.is(error.message, "Specify template path");
});

test("read template", async t => {
    const path = "fake-dir/read-target-file";
    const content = "reading lorem ipsum";
    const mockedFile = { [path]: content }; 
    mock(mockedFile);

    const template = await templateReader.read(path);

    t.is(template, content);
    
    mock.restore();
});
