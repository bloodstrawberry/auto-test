const fs = require('fs');

const filePath1 = "actions/lotto.js";
const filePath = "actions/test.txt";

const data = fs.readFileSync(filePath1, "utf-8");
console.log(data)

// 파일에 '1234'라는 내용을 동기적으로 씁니다.
try {
    fs.writeFileSync(filePath, '1234');
    console.log('파일에 성공적으로 쓰였습니다!');
} catch (err) {
    console.error('파일을 쓰는 중에 오류가 발생했습니다.', err);
}
