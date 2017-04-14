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

  fs.writeFile(path, content, err => {
    if (err) throw err;
  });
}

module.exports = {
  read,
  write
};
