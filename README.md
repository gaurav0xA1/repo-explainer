# Repo Explainer

This is my first fullstack project! 🚀

## Overview
Repo Explainer is a web application that helps users understand any public GitHub repository. Paste a GitHub repo link or README text, and the app uses Google Gemini AI to generate:
- A project summary
- Tech stack explanation
- "How I would explain this in an interview"
- Possible questions an interviewer might ask

## How It Works
- **Frontend:** Built with React and Vite, providing a modern, responsive UI.
- **Backend:** Node.js/Express server that receives the repo link/text and calls the Gemini API for analysis.
- **AI Integration:** The backend sends a prompt to Gemini, which returns a detailed explanation and interview prep content.
- **User Flow:**
  1. User pastes a GitHub repo link or README text in the input box.
  2. Clicks submit.
  3. The app displays a summary, tech stack, interview explanation, and possible interview questions.

## Getting Started
1. Clone the repo and install dependencies in both `client` and `server` folders.
2. Set your Gemini API key as an environment variable in the server.
3. Start both the backend and frontend servers.
4. Open the frontend in your browser and start exploring!

---

Made with ❤️ as my first fullstack project.
