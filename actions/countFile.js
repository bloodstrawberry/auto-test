const fs = require("fs");
const path = require("path");

const countFilesInDirectory = (dir) => {
  let totalCount = 0;
  let child = [];

  const items = fs.readdirSync(dir);

  for (const item of items) {
    const itemPath = path.join(dir, item);
    const stats = fs.statSync(itemPath);

    if (stats.isDirectory()) {
      const { totalCount: subfolderCount, child: subfolders } = countFilesInDirectory(itemPath);

      child.push({
        totalCount: subfolderCount,
        name: itemPath,
        child: subfolders,
      });

      totalCount += subfolderCount;
    }
    else if (stats.isFile()) {
      totalCount++;
    }
  }

  return { totalCount, child };
};

const folderPath = "./";
const { totalCount, child } = countFilesInDirectory(folderPath);

console.log("Total files in top folder:", totalCount);
console.log("Subfolders:", child);

const printAllObjects = (obj, depth = 0) => {
  for (const key in obj) {
    if (typeof obj[key] === "object" && obj[key] !== null) {
      const indent = "  ".repeat(depth);
      console.log(indent + key + ":");

      printAllObjects(obj[key], depth + 1);
    } else {
      const indent = "  ".repeat(depth);
      console.log(indent + key + ":", obj[key]);
    }
  }
};

printAllObjects(child);

let json = JSON.stringify(child, null, 2);
console.log(json);