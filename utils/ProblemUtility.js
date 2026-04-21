/** @format */

const axios = require("axios");

const getJDoodleLanguageInfo = (lan) => {
  const languageMap = {
    cpp: { language: "cpp", versionIndex: "5" },
    java: { language: "java", versionIndex: "4" }, 
    js: { language: "nodejs", versionIndex: "4" },
  };

  return languageMap[lan.toLowerCase()];
};

const executeInJDoodle = async (script, language, versionIndex, stdin) => {
  const data = {
    clientId: process.env.JDOODLE_CLIENT_ID,
    clientSecret: process.env.JDOODLE_CLIENT_SECRET,
    script: script,
    language: language,
    versionIndex: versionIndex,
    stdin: stdin,
  };

  try {
    const response = await axios.post(
      "https://api.jdoodle.com/v1/execute",
      data,
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
    return response.data;
  } catch (error) {
    console.error(
      "JDoodle Execution Error:",
      error.response ? error.response.data : error.message,
    );
    throw error;
  }
};

module.exports = { getJDoodleLanguageInfo, executeInJDoodle };
