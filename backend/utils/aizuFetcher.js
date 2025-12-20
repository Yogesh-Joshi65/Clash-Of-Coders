const axios = require('axios');
const cheerio = require('cheerio');

// Verified List of ITP1 (Intro to Programming) problems
const PROBLEM_IDS = [
    'ITP1_1_B', 'ITP1_1_C', 'ITP1_1_D', 
    'ITP1_2_A', 'ITP1_2_C', 'ITP1_2_D',
    'ITP1_3_A', 'ITP1_3_B', 'ITP1_3_C', 'ITP1_3_D',
    'ITP1_4_A', 'ITP1_4_B', 'ITP1_4_C', 'ITP1_4_D'
];

const getAizuProblem = async () => {
    try {
        const randomId = PROBLEM_IDS[Math.floor(Math.random() * PROBLEM_IDS.length)];
        const apiUrl = `https://judgeapi.u-aizu.ac.jp/resources/descriptions/en/${randomId}`;
        
        console.log(`[AIZU] Fetching: ${apiUrl}`);
        
        const response = await axios.get(apiUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                'Accept': 'application/json'
            },
            timeout: 5000 
        });

        let data = response.data;

        // Handle String Response
        if (typeof data === 'string') {
            try {
                data = JSON.parse(data);
            } catch (e) {
                console.error(`[AIZU] Failed to parse response string: ${data.substring(0, 50)}...`);
                return null;
            }
        }

        // Check for 'html' key as well
        let htmlContent = data.html_description || data.html;

        // Fallback: Sometimes only literal_description exists
        if (!htmlContent && data.literal_description) {
            console.log('[AIZU] html/html_description missing, using literal_description');
            htmlContent = `<pre>${data.literal_description}</pre>`;
        }

        // Check if we found ANY content
        if (!htmlContent) {
            console.error(`[AIZU] Error: Missing description fields.`);
            if (data) {
                console.log(`[AIZU] Received Keys: ${Object.keys(data).join(', ')}`);
            }
            return null;
        }

        if (typeof htmlContent !== 'string') {
            console.error(`[AIZU] Error: Description content is not a string. Type: ${typeof htmlContent}`);
            return null;
        }

        // Parse HTML to extract test cases
        const $ = cheerio.load(htmlContent);

        $('script').remove();
        $('img').remove();

        const testCases = [];
        let currentInput = null;

        // --- IMPROVED PARSING LOGIC ---
        // Aizu ITP1 problems usually have "Sample Input X" followed by <pre>
        // But sometimes they are just "Input" / "Output"
        
        // 1. Get all text-containing elements in order
        const allElements = $('h2, h3, p, div, pre');

        allElements.each((i, el) => {
            const text = $(el).text().trim().toLowerCase();
            const tagName = $(el).prop('tagName').toLowerCase();

            // Detect Input Header
            if (text.includes('sample input') || (text === 'input' && tagName.startsWith('h'))) {
                // Look ahead for the next PRE tag
                let nextEl = $(el).next();
                // Skip empty text nodes or BRs
                while(nextEl.length && !nextEl.is('pre') && !nextEl.text().trim()) {
                    nextEl = nextEl.next();
                }
                
                if (nextEl.is('pre')) {
                    currentInput = nextEl.text().trim();
                }
            } 
            // Detect Output Header
            else if ((text.includes('sample output') || (text === 'output' && tagName.startsWith('h'))) && currentInput !== null) {
                let nextEl = $(el).next();
                while(nextEl.length && !nextEl.is('pre') && !nextEl.text().trim()) {
                    nextEl = nextEl.next();
                }

                if (nextEl.is('pre')) {
                    const output = nextEl.text().trim();
                    testCases.push({ input: currentInput, expectedOutput: output });
                    currentInput = null; // Reset pair
                }
            }
        });

        // Fail-safe: If regex/cheerio extraction failed, fallback to a generic extract if literal description is clean
        if (testCases.length === 0) {
            console.warn(`[AIZU] Warning: No test cases extracted for ${randomId}. Dumping HTML snippet for debug.`);
            // console.log(htmlContent.substring(0, 200)); 
            // Return null so the backend triggers the Fallback Problem (which has valid test cases)
            return null;
        }

        console.log(`[AIZU] Successfully extracted ${testCases.length} test cases for ${randomId}`);

        const starterCode = {
            javascript: `// Solve Aizu Problem ${randomId}\nconst fs = require('fs');\nconst input = fs.readFileSync('/dev/stdin').toString().trim().split('\\n');\n// Write code here\n`,
            python: `# Solve Aizu Problem ${randomId}\nimport sys\nlines = sys.stdin.readlines()\n# Write code here\n`,
            cpp: `// Solve Aizu Problem ${randomId}\n#include <iostream>\nusing namespace std;\nint main() {\n    return 0;\n}`,
            java: `// Solve Aizu Problem ${randomId}\nimport java.util.Scanner;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n    }\n}`
        };

        return {
            problemId: randomId,
            title: `Aizu ${randomId}`,
            description: htmlContent, 
            descriptionUrl: `https://onlinejudge.u-aizu.ac.jp/problems/${randomId}`,
            testCases: testCases,
            starterCode: starterCode
        };

    } catch (error) {
        console.error("Aizu Fetch Error:", error.message);
        return null;
    }
};

module.exports = { getAizuProblem };