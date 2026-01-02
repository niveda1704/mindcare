
const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require('dotenv');
dotenv.config();

const testGemini = async () => {
    try {
        const apiKey = process.env.GEMINI_API_KEY;
        console.log("Testing Gemini API with Key:", apiKey ? "Key Found" : "No Key Found");

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });

        console.log("Sending request...");
        const result = await model.generateContent("Hello, are you working?");
        const response = await result.response;
        const text = response.text();
        console.log("Success! Response:", text);
    } catch (error) {
        console.error("Gemini API Error details:");
        console.error(error);
    }
};

testGemini();
