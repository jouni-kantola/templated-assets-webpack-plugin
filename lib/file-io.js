const fs = require("fs");

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

function write(path, content) {
  if (!path) throw new Error("No file path specified");

  return new Promise((resolve, reject) => {
    const encoding = "utf8";

    fs.writeFile(path, content, encoding, err => {
      if (err) reject(err);
      resolve(path);
    });
  });
}

module.exports = {
  read,
  write
};
