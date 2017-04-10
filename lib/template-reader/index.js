const fs = require("fs");

function read(path) {
  if (!path) throw new Error("Specify template path");

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
