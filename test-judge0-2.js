/** @format */

const axios = require("axios");

(async () => {
  const src =
    "#include <iostream>\nusing namespace std;\nint main() { int a, b; cin >> a >> b; cout << a + b; return 0; }";
  const inp = "2 3";

  try {
    const res = await axios.post(
      "http://localhost:2358/submissions?base64_encoded=false&wait=true",
      {
        language_id: 54,
        source_code: src,
        stdin: inp,
      },
    );
    console.log(res.data);
  } catch (err) {
    console.error(err.response ? err.response.data : err.stack);
  }
})();
