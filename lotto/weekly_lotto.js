const fs = require("fs");
const axios = require("axios");
const fetch = require("node-fetch");

const { Octokit } = require("@octokit/core");

const userName = "bloodstrawberry";
const userEmail = "bloodstrawberry.library@gmail.com";
const repo = "auto-test";
const token = process.env.GH_TOKEN;

const getLottoNumber = async (drwNo) => {
  const response = await axios.get(
    `https://www.dhlottery.co.kr/common.do?method=getLottoNumber&drwNo=${drwNo}`
  );

  if(response.status !== 200) return undefined;

  console.log(response.data);
  return response.data;
};

const getSHA = async (octokit, path) => {
  const response = await octokit.request(
    `GET /repos/${userName}/${repo}/contents/${path}`
  );

  return response.data.sha;
};

const githubWrite = async (path, contents, commitMessage) => {
  const octokit = new Octokit({
    auth: token,
    request: {
      fetch: fetch,
    },
  });

  const fileSHA = await getSHA(octokit, path);

  const response = await octokit.request(
    `PUT /repos/${userName}/${repo}/contents/${path}`,
    {
      sha: fileSHA,
      message: commitMessage,
      committer: {
        name: userName,
        email: userEmail,
      },

      // btoa : 바이너리 데이터를 base64로 인코딩
      // unescape(encodeURIComponent(())) <- 한글 처리
      content: btoa(unescape(encodeURIComponent(`${contents}`))),
    }
  );

  console.log(response.status);
};

const updateLottoJson = async () => {
  const filePath = "lotto/lottoNumber.json";

  const data = fs.readFileSync(filePath, "utf-8");
  const lottoJson = JSON.parse(data);
  const lastNumber = lottoJson[lottoJson.length - 1].drwNo;
  const latest = await getLottoNumber(lastNumber + 1);
 
  lottoJson.push(latest);

  const updatedJson = JSON.stringify(lottoJson, null, 2);
  
  githubWrite(filePath, updatedJson, "Update Lotto!!");    
};

updateLottoJson();
