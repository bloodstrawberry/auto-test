const cal = require("../source/calculator");

describe("Calculator test", () => {
  it("correct", () => {
    expect(cal.myAdd(3, 3)).toEqual(6);
    expect(cal.myDivide(5, 2)).toEqual(2);
    expect(cal.myDivide(10, 3)).toEqual(3.3);
  });

  it("exception test", () => {
    expect(() => {
      cal.myDivide(5, 0);
    }).toThrow("Can't be divided by zero.");
  });
});
