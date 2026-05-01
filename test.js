const axios = require("axios");

async function run() {
  try {
    const response = await axios.post(
      "http://localhost:2358/submissions?base64_encoded=false&wait=true",
      {
        source_code: "console.log(5)",
        language_id: 63,
        stdin: ""
      }
    );

    console.log(response.data);
  } catch (err) {
    console.error(err.response?.data || err.message);
  }
}

run();