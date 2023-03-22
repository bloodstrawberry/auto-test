// calculator.js
function myAdd(a, b) {
  return a + b;
}

function myDivide(a, b) {
  if (b === 0) throw new Error("Can't be divided by zero.");
  return parseInt(a / b);
}

module.exports = { myAdd, myDivide };

// // calculator.js
// exports.myAdd = (a, b) => {
//   return a + b;
// };

// exports.myDivide = (a, b) => {
//   if (b === 0) throw new Error("Can't be divided by zero.");
//   return parseInt(a / b);
// };
