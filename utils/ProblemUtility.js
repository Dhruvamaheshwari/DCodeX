/** @format */

const axios = require("axios");

// Cache for runtimes (to avoid frequent calls)
let runtimesCache = null;
let cacheExpiry = 0;
const CACHE_TTL = 60 * 1000; // 1 minute

// Language mapping (input can be Judge0 ID or string)
const getPistonLanguage = (lan) => {
  if (!lan) return undefined;
  const map = {
    54: "c++",
    62: "java",
    63: "javascript",
    71: "python",
    cpp: "c++",
    c: "c",
    java: "java",
    js: "javascript",
    javascript: "javascript",
    python: "python",
  };
  return map[lan.toString().toLowerCase()];
};

// Fetch available runtimes (with caching)
const fetchRuntimes = async () => {
  if (runtimesCache && Date.now() < cacheExpiry) return runtimesCache;
  const response = await axios.get("http://localhost:2000/api/v2/runtimes", { timeout: 5000 });
  runtimesCache = response.data;
  cacheExpiry = Date.now() + CACHE_TTL;
  return runtimesCache;
};

// Get version for a language
const getVersionForLanguage = async (language) => {
  const runtimes = await fetchRuntimes();
  const runtime = runtimes.find(r => r.language === language);
  return runtime ? runtime.version : null;
};

// Get proper filename for Piston
const getFilename = (language) => {
  switch (language) {
    case "c++": return "main.cpp";
    case "java": return "Main.java";
    case "javascript": return "main.js";
    case "python": return "main.py";
    default: return "code.txt";
  }
};

// Execute code in Piston – FIXED VERSION
const executeInPiston = async (source_code, language, stdin = "") => {
  try {
    // 1. Get correct version (no "*" wildcard)
    const version = await getVersionForLanguage(language);
    if (!version) {
      return {
        error: true,
        message: `Language "${language}" is not installed in Piston. Run: node index.js ppman install ${language === "c++" ? "gcc" : language}`,
        stdout: "",
        stderr: "",
      };
    }

    // 2. Proper filename
    const filename = getFilename(language);

    // 3. Make request to Piston
    const response = await axios.post(
      "http://localhost:2000/api/v2/execute",
      {
        language: language,
        version: version,
        files: [{ name: filename, content: source_code || "" }],
        stdin: stdin || "",
      },
      { headers: { "Content-Type": "application/json" }, timeout: 10000 }
    );
    const data = response.data;

    // 4. Handle compilation error
    if (data.compile && data.compile.code !== 0) {
      return {
        error: true,
        status: "Compilation Error",
        stdout: "",
        stderr: data.compile.stderr || data.compile.output || "Compilation failed",
        compile_output: data.compile.output,
        message: data.compile.stderr || data.compile.output,
      };
    }

    // 5. Handle runtime error (non-zero exit code)
    if (data.run && data.run.code !== 0) {
      return {
        error: true,
        status: "Runtime Error",
        stdout: "",
        stderr: data.run.stderr || data.run.output || "Runtime error",
        message: data.run.stderr || data.run.output,
      };
    }

    // 6. Success
    return {
      error: false,
      status: "Accepted",
      stdout: data.run?.stdout || "",
      stderr: data.run?.stderr || "",
      compile_output: data.compile?.output || "",
      message: data.run?.output || "",
    };
  } catch (error) {
    console.error("Piston Execution Error:", error.response?.data || error.message);
    return {
      error: true,
      message: error.response?.data?.message || error.message || "Unknown Piston error",
      stdout: "",
      stderr: "",
    };
  }
};

module.exports = { getPistonLanguage, executeInPiston };