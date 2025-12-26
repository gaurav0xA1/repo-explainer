// Truncate text to 2/3 of its original length (by lines)
function truncateText(text) {
  if (!text) return '';
  const lines = text.split(/\r?\n/);
  const maxLines = Math.ceil(lines.length * 2 / 3);
  if (lines.length <= maxLines) return text;
  return lines.slice(0, maxLines).join('\n') + '\n... (truncated)';
}
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
      <div
        className="container"
        style={
          !loading && result.repoUrl
            ? { maxWidth: 700, minWidth: 400, transition: 'max-width 0.3s, min-width 0.3s' }
            : {}
        }
      >
        <div className="app-title" style={{ fontFamily: 'Fira Mono, monospace', fontWeight: 900, fontSize: '2.3rem', letterSpacing: '2px', color: '#a5b4fc', marginBottom: 0 }}>
          repo-explainer
        </div>
        <div style={{ color: '#cbd5e1', fontSize: '1.08rem', textAlign: 'center', marginBottom: 24, maxWidth: 400 }}>
          Instantly generate clear, interview-ready explanations for any public GitHub repository. Paste a repo URL below and get a summary, tech stack, and more—powered by AI.
        </div>
        <div className="textbox">
          <input
            type="text"
            placeholder="Paste a GitHub repo URL..."
            value={search}
            onChange={handleChange}
            onPaste={handlePaste}
          />
          <div className="submit-btn">
            <button onClick={handleSubmit}>Explain Repo</button>
          </div>
          {loading && (
            <div className="loading-spinner">
              <div className="spinner"></div>
              <div style={{marginTop:8, color:'#6366f1', fontWeight:500}}>Generating explanation...</div>
            </div>
          )}
          {!loading && result.repoUrl && (
            <div
              className="response-message"
              style={{
                maxWidth: 600,
                minWidth: 340,
                background: '#232946',
                color: '#f3f4f6',
                transition: 'max-width 0.3s, min-width 0.3s, background 0.2s',
              }}
            >
              <div style={{ marginBottom: 12 }}>
                <span style={{ fontWeight: 600, color: '#a5b4fc' }}>Repo:</span> <a href={result.repoUrl} target="_blank" rel="noopener noreferrer">{result.repoUrl}</a>
              </div>
              <div>
                <span style={{ fontWeight: 600, color: '#a5b4fc' }}>Explanation:</span>
                <div style={{ marginTop: 8 }}>
                  <FormattedExplanation text={truncateText(result.explanation)} />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


// Format explanation with basic markdown support (headings, code, lists)
function FormattedExplanation({ text }) {
  if (!text) return null;
  const lines = text.split(/\r?\n/);
  const elements = [];
  let inCode = false;
  let codeLines = [];
  lines.forEach((line, idx) => {
    if (line.trim().startsWith('```')) {
      if (!inCode) {
        // Start code block
        inCode = true;
        codeLines = [];
      } else {
        // End code block
        inCode = false;
        elements.push(<pre key={idx}>{codeLines.join('\n')}</pre>);
        codeLines = [];
      }
      return;
    }
    if (inCode) {
      codeLines.push(line);
      return;
    }
    if (/^#+ /.test(line)) {
      const level = line.match(/^#+/)[0].length;
      elements.push(
        <div key={idx} style={{ fontWeight: 700, fontSize: `${1.2 + (6-level)*0.1}rem`, margin: '10px 0 4px', color: '#a5b4fc' }}>{line.replace(/^#+ /, '')}</div>
      );
      return;
    }
    if (/^\d+\. /.test(line)) {
      elements.push(
        <div key={idx} style={{ marginLeft: 16 }}>{line}</div>
      );
      return;
    }
    if (/^- /.test(line)) {
      elements.push(
        <div key={idx} style={{ marginLeft: 16 }}>• {line.replace(/^- /, '')}</div>
      );
      return;
    }
    if (line.trim() === '') {
      elements.push(<br key={idx} />);
      return;
    }
    elements.push(<div key={idx}>{line}</div>);
  });
  // If file ends while still in code block
  if (inCode && codeLines.length > 0) {
    elements.push(<pre key={lines.length}>{codeLines.join('\n')}</pre>);
  }
  return <div>{elements}</div>;
}

export default App;