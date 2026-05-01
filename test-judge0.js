/** @format */

const axios = require("axios");

(async () => {
  const src = Buffer.from(
    "#include <iostream>\nusing namespace std;\nint main() { int a, b; cin >> a >> b; cout << a + b; return 0; }",
  ).toString("base64");
  const inp = Buffer.from("2 3").toString("base64");

  try {
    const res = await axios.post(
      "http://localhost:2358/submissions?base64_encoded=true&wait=true",
      {
        language_id: 54,
        source_code: src,
        stdin: inp,
      },
    );
    console.log(res.data);
  } catch (err) {
    console.error(err.response ? err.response.data : err.message);
  }
})();
