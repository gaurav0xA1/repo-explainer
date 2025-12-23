import express from 'express';
import cors from 'cors';
import { GoogleGenAI } from "@google/genai";

const app = express();
const PORT = process.env.PORT || 3001;
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Middleware to parse JSON bodies
app.use(cors());

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Express server is running!');
});

// Add this POST endpoint
app.post('/api/repo', async (req, res) => {
  const { repoUrl } = req.body;
  try {
    const prompt = `You are a project explainer generator. Given this GitHub repo link: ${repoUrl}, generate the following:

1. Project summary
2. Tech stack explanation
3. How I would explain this project in an interview
4. Possible questions an interviewer might ask about this project

Format your response clearly with headings for each section.`;
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });
    res.json({
      repoUrl: repoUrl,
      explanation: response.text
    });
  } catch (error) {
    res.status(500).json({ message: "AI error", error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

async function main() {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: "Explain how AI works in a few words",
  });
  console.log(response.text);
}

main();