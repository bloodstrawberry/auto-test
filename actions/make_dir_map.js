// isHidden x

let dir = {
  id: "",
  name: "",
  isDir: true,
  modDate: "",
  childrenIds: [],
  childrenCount: 0,
  parentId: "",
};

let file = {
  id: "",
  name: "",
  size: "",
  modDate: "",
  parentId: "",
};



const fs = require("fs");
const path = require("path");

const dirPath = path.resolve("./actions/myfiles");

let pathIdMap = {};
let id_counter = 0;

const makePathIdMap = (dir) => {
  pathIdMap[dir] = `id_${id_counter++}`;
  let items = fs.readdirSync(dir);
  for (let item of items) {
    let itemPath = path.join(dir, item);
    let stats = fs.statSync(itemPath);

    if (stats.isDirectory()) {
      makePathIdMap(itemPath);
    } else if (stats.isFile()) {
      pathIdMap[itemPath] = `id_${id_counter++}`;
    }
  }
};

const getChildrenCount = (dir) => {
  let items = fs.readdirSync(dir);
  return items.length;
};

const getChildrenIds = (dir) => {
  let ret = [];
  let items = fs.readdirSync(dir);
  for (let item of items) {
    let itemPath = path.join(dir, item);
    ret.push(pathIdMap[itemPath]);
  }

  return ret;
};

let makeChonkyMap = (dir) => {
  let items = fs.readdirSync(dir);

  for (let item of items) {
    let itemPath = path.join(dir, item);
    let stats = fs.statSync(itemPath);

    // 현재 폴더에 있는 폴더와 파일을 먼저 처리
    if (stats.isDirectory()) {
      let obj = {
        id: pathIdMap[itemPath],
        name: item,
        isDir: true,
        modDate: fs.statSync(itemPath).mtime,
        childrenIds: getChildrenIds(itemPath),
        childrenCount: getChildrenCount(itemPath),
        parentId: pathIdMap[dir],
      };

      fileMap[pathIdMap[itemPath]] = obj;
      makeChonkyMap(itemPath);
    } else if (stats.isFile()) {
      let obj = {
        id: pathIdMap[itemPath],
        name: item,
        size: fs.statSync(itemPath).size,
        modDate: fs.statSync(itemPath).mtime,
        parentId: pathIdMap[dir],
      };

      fileMap[pathIdMap[itemPath]] = obj;
    }
  }
};

makePathIdMap(dirPath);

let rootFolderId = `id_0`;
let initCount = getChildrenCount(dirPath);
let initChildrenIds = getChildrenIds(dirPath);

let fileMap = {
  id_0: {
    id: rootFolderId,
    name: "myfiles",
    isDir: true,
    childrenIds: initChildrenIds,
    childrenCount: initCount,
  },
};

makeChonkyMap(dirPath);

let json = JSON.stringify({ rootFolderId, fileMap }, null, 4);
console.log(json);
// fs.writeFileSync("dir_map.json", json, "utf-8");
