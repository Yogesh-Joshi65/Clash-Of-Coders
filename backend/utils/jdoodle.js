const axios = require('axios');

const JDOODLE_ENDPOINT = "https://api.jdoodle.com/v1/execute";

// Map frontend language names to JDoodle language codes and version indexes
// Check JDoodle docs for latest version indexes if needed
const LANGUAGE_MAP = {
  javascript: { language: 'nodejs', versionIndex: '5' }, // Node.js 18.x
  python: { language: 'python3', versionIndex: '4' },    // Python 3.9
  cpp: { language: 'cpp17', versionIndex: '1' },         // GCC 10
  java: { language: 'java', versionIndex: '4' }          // JDK 17
};

/**
 * Executes code using the JDoodle API
 * @param {string} script - The source code to execute
 * @param {string} language - The language (javascript, python, cpp, java)
 * @param {string} stdin - Input data for the program (test case input)
 */
const executeCode = async (script, language, stdin) => {
  const config = LANGUAGE_MAP[language.toLowerCase()];

  if (!config) {
    return { error: `Unsupported language: ${language}` };
  }

  const payload = {
    clientId: process.env.JDOODLE_CLIENT_ID,
    clientSecret: process.env.JDOODLE_CLIENT_SECRET,
    script: script,
    stdin: stdin, // Passes the test case input here
    language: config.language,
    versionIndex: config.versionIndex
  };

  try {
    const response = await axios.post(JDOODLE_ENDPOINT, payload);
    
    // JDoodle Response Structure:
    // { output: "...", statusCode: 200, memory: "...", cpuTime: "..." }
    
    return {
      stdout: response.data.output, // The actual print statements from the code
      usage: response.data.cpuTime,
      memory: response.data.memory,
      error: response.data.statusCode !== 200 ? response.data.output : null
    };

  } catch (error) {
    console.error("JDoodle API Error:", error.message);
    return { error: "Execution failed due to external API error" };
  }
};

module.exports = { executeCode };