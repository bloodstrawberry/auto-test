const fs = require("fs");
const path = require("path");
const fetch = require("node-fetch");

const { Octokit } = require("@octokit/core");

const octokit = new Octokit({
  auth: process.env.GH_TOKEN,
  request: {
    fetch: fetch,
  },
});

const dirPath = path.resolve("./actions/myfiles");
console.log({ dirPath });

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

const getSHA = async (path) => {
  try {
    const result = await octokit.request(
      `GET /repos/bloodstrawberry/auto-test/contents/${path}`,
      {
        owner: "bloodstrawberry",
        repo: "auto-test",
        path,
      }
    );

    return result.data.sha;
  } catch (e) {
    console.log("error : ", e);
    return undefined;
  }
};

const fileWrite = async (path, contents) => {
  const currentSHA = await getSHA(path);
  const result = await octokit.request(
    `PUT /repos/bloodstrawberry/auto-test/contents/${path}`,
    {
      owner: "bloodstrawberry",
      repo: "auto-test",
      path,
      message: `Update ${path}`,
      sha: currentSHA,
      committer: {
        name: "bloodstrawberry",
        email: "bloodstrawberry@github.com",
      },
      content: `${Buffer.from(contents).toString("base64")}`, // or `${btoa(contents)}`
      headers: {
        "X-GitHub-Api-Version": "2022-11-28",
      },
    }
  );

  return result.status;
};

const updateChonkyMap = async (json) => {
  const filePath = "actions/config/chonky_map.json";
  try {
    let response = await fileWrite(filePath, json);    
    console.log(response);
  } catch (err) {
    console.error("error : ", err);
    process.exit(1);
  }
};

let json = JSON.stringify({ rootFolderId, fileMap }, null, 4);
// fs.writeFileSync("dir_map.json", json, "utf-8");

console.log(json);

updateChonkyMap(json);
