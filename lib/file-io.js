const fs = require("fs");

function read(path) {
  if (!path) throw new Error("No file path specified");

  return new Promise((resolve, reject) => {
    fs.readFile(path, (err, content) => {
      if (err) reject(err);
      resolve(content.toString());
    });
  });
}

module.exports = {
  read
};
