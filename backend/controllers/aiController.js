const { GoogleGenerativeAI } = require("@google/generative-ai");

const analyzeCode = async (req, res) => {
    const { sourceCode, problemTitle, language } = req.body;

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        console.error("AI Error: GEMINI_API_KEY is missing");
        return res.status(500).json({ message: "Server API Key configuration error" });
    }

    try {
        const genAI = new GoogleGenerativeAI(apiKey);
        
        // Use the latest stable model
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `
            You are a coding interview coach. 
            Analyze this ${language} solution for "${problemTitle}".
            
            Code:
            ${sourceCode}

            Return purely valid JSON with these keys:
            {
                "timeComplexity": "O(...)",
                "spaceComplexity": "O(...)",
                "feedback": "Short summary...",
                "suggestions": ["Tip 1", "Tip 2"]
            }
            Do not use markdown formatting. Just raw JSON.
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        let text = response.text();
        
        text = text.replace(/```json/g, '').replace(/```/g, '').trim();
        
        res.json(JSON.parse(text));

    } catch (error) {
        console.error("AI Generation Error:", error);
        res.status(500).json({ message: "Failed to analyze code" });
    }
};

module.exports = { analyzeCode };