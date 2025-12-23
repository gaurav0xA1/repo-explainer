import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [search, setSearch] = useState("");
  const [result, setResult] = useState({ repoUrl: "", explanation: "" });
  const [loading, setLoading] = useState(false);

  // Regex to validate GitHub repo URL
  const githubRepoRegex = /^https:\/\/github\.com\/[\w-]+\/[\w.-]+\/?$/;

  // logic to handle input change
  const handleChange = (e) => {
    setSearch(e.target.value);
    console.log("Typed:", e.target.value);
  };

  // logic to handle paste event
  const handlePaste = (e) => {
    const pasted = e.clipboardData.getData("text");
    console.log("pasted:", pasted);
  };

  // logic to handle button click
const handleSubmit = async () => {
  if (!githubRepoRegex.test(search)) {
    alert("Please enter a valid GitHub repository URL.");
    return;
  }
  setLoading(true);
  setResult({ repoUrl: "", explanation: "" });
  try {
    const response = await fetch("http://localhost:3001/api/repo", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ repoUrl: search }),
    });
    const data = await response.json();
    setResult({ repoUrl: data.repoUrl, explanation: data.explanation });
    console.log(data);
  } catch (error) {
    console.error("Error:", error);
    setResult({ repoUrl: "", explanation: "An error occurred!" });
  } finally {
    setLoading(false);
  }
};



  return (
    <div className="background">
      <div className="container">
        <div className="textbox">
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={handleChange}
            onPaste={handlePaste}
          />
          <div className="submit-btn">
            <button onClick={handleSubmit}>Submit</button>
          </div>
          {loading && (
            <div className="loading-spinner">
              <div className="spinner"></div>
              <div style={{marginTop:8, color:'#6366f1', fontWeight:500}}>Generating explanation...</div>
            </div>
          )}
          {!loading && result.repoUrl && (
            <div className="response-message">
              <div>
                <strong>Repo:</strong> <a href={result.repoUrl} target="_blank" rel="noopener noreferrer">{result.repoUrl}</a>
              </div>
              <div>
                <strong>Explanation:</strong> {result.explanation}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;