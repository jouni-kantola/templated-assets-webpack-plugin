const fs = require("fs");
const { mkdirp } = require("mkdirp");
const dirname = require("path").dirname;

function read(path) {
  if (!path) throw new Error("No file path specified");

  return new Promise((resolve, reject) => {
    fs.readFile(path, (err, content) => {
      if (content) {
        resolve(content.toString());
      } else {
        reject(`File not found: ${path}`);
      }

      if (err) reject(err);
    });
  });
}

function write(path, content, callback) {
  if (!path) throw new Error("No file path specified");

  const dir = dirname(path);

  mkdirp(dir).then(() => {
    fs.writeFile(path, content, err => {
      if (err) throw err;
      callback && callback();
    });
  });
}

module.exports = {
  read,
  write
};
