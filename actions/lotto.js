const fs = require("fs");
const axios = require("axios");
const { Octokit } = require("@octokit/core");
const { createRequestLog } = require("@octokit/plugin-request-log");

const MyOctokit = Octokit.plugin(createRequestLog);

const octokit = new MyOctokit({
  auth: process.env.GH_TOKEN,
});

const getLottoNumber = async (drwNo) => {
  try {
    const response = await axios.get(
      `https://www.dhlottery.co.kr/common.do?method=getLottoNumber&drwNo=${drwNo}`
    );

    // console.log(response.data);
    return response.data;
  } catch (e) {
    return undefined;
  }
};

const getSHA = async (path) => {
  const result = await octokit.request(
    `GET /repos/bloodstrawberry/auto-test/contents/${path}`,
    {
      owner: "bloodstrawberry",
      repo: "auto-test",
      path,
    }
  );

  return result.data.sha;
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
      content: `${Buffer.from(contents).toString("base64")}`,
      headers: {
        "X-GitHub-Api-Version": "2022-11-28",
      },
    }
  );

  return result.status;
};

const updateLottoJson = async () => {
  const filePath = "actions/lotto.json";

  try {
    const data = fs.readFileSync(filePath, "utf-8");
    const lottoJson = JSON.parse(data);

    let contents = "text!!";
    console.log(`${Buffer.from(contents).toString("base64")}`);
    console.log("=============");
    console.log(`${btoa(contents)}`);
    console.log("=============");    
    console.log(lottoJson);
    
    const lastNumber = lottoJson[lottoJson.length - 1].drwNo;

    const latest = await getLottoNumber(lastNumber + 1);
    console.log("=============");   
    console.log(latest);
    lottoJson.push(latest);

    const updatedJson = JSON.stringify(lottoJson, null, 2);
    let response = await fileWrite("actions/lotto.json", updatedJson);

    console.log(response);
  } catch (err) {
    console.error("error : ", err);
    process.exit(1);
  }
};

updateLottoJson();
