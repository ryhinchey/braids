const future = (by = 1000) => Math.floor(Date.now() / by + 100000);

module.exports = [
  {
    name: "cookie1",
    value: "val1",
    domain: ".americanexpress.com",
    expires: future(),
    sameSite: "None"
  },
  {
    name: "cookie2",
    value: "val2",
    domain: ".americanexpress.com",
    sameSite: "None",
    expires: future()
  },
  {
    name: "cookie3",
    value: "val3",
    domain: ".americanexpress.com",
    sameSite: "None",
    expires: future()
  }
];
