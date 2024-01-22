const fs = require("fs");
const axios = require("axios");

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

const updateLottoJson = async () => {
  const filePath = "lotto.json";

  try {
    const data = fs.readFileSync(filePath, "utf-8");
    const lottoJson = JSON.parse(data);
    const lastNumber = lottoJson[lottoJson.length - 1].drwNo;

    const latest = await getLottoNumber(lastNumber + 1);

    lottoJson.push(latest);

    const updatedJson = JSON.stringify(lottoJson, null, 2);

    fs.writeFileSync(filePath, updatedJson);

    console.log("success");
  } catch (err) {
    console.error("error : ", err);
    process.exit(1);
  }
};

updateLottoJson();
