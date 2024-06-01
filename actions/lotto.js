const fs = require("fs");
const axios = require("axios");
const fetch = require("node-fetch");

const { Octokit } = require("@octokit/rest");

const octokit = new Octokit({
  auth: process.env.GH_TOKEN,
  request: {
    fetch: fetch,
  },
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
  try {
    const result = await octokit.request(
      `GET /repos/bloodstrawberry/auto-test/contents/actions/lotto.json`,
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
      content: `${btoa(contents)}`, // or `${Buffer.from(contents).toString("base64")}`,      
      headers: {
        "X-GitHub-Api-Version": "2022-11-28",
      },
    }
  );

  console.log(result.status);

  return result.status;
};

const updateLottoJson = async () => {
  const filePath = "actions/lotto.json";

  try {
    const data = fs.readFileSync(filePath, "utf-8");
    const lottoJson = JSON.parse(data);
    const lastNumber = lottoJson[lottoJson.length - 1].drwNo;

    const latest = await getLottoNumber(lastNumber);
   
    lottoJson.push(latest);

    const updatedJson = JSON.stringify(lottoJson, null, 2);
    let response = await fileWrite(filePath, updatedJson);    
    console.log(response);
  } catch (err) {
    console.error("error : ", err);
    process.exit(1);
  }
};

updateLottoJson();
