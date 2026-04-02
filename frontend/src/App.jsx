import { useState } from "react";

function App() {
  const [resumeFile, setResumeFile] = useState(null);
  const [jdFile, setJdFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [latex, setLatex] = useState("");
  const [gaps, setGaps] = useState([]);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const handleSubmit = async () => {
    if (!resumeFile || !jdFile) return;
    setLoading(true);
    setError("");
    setLatex("");
    setGaps([]);

    const formData = new FormData();
    formData.append("resume", resumeFile);
    formData.append("jd", jdFile);

    try {
      const res = await fetch("https://resume-tailor-production-b39e.up.railway.app/tailor", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Something went wrong");
      setLatex(data.latex);
      setGaps(data.gaps);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(latex);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Resume Tailor</h1>
      <p style={styles.subtitle}>
        Upload your resume + job description → get ATS-optimised LaTeX for Overleaf
      </p>

      <div style={styles.uploadGrid}>
        <UploadZone
          label="Resume"
          hint="PDF or DOCX"
          file={resumeFile}
          onChange={setResumeFile}
          accept=".pdf,.docx"
        />
        <UploadZone
          label="Job Description"
          hint="PDF, DOCX or TXT"
          file={jdFile}
          onChange={setJdFile}
          accept=".pdf,.docx,.txt"
        />
      </div>

      {error && <p style={styles.error}>{error}</p>}

      <button
        style={{
          ...styles.button,
          opacity: !resumeFile || !jdFile || loading ? 0.4 : 1,
          cursor: !resumeFile || !jdFile || loading ? "not-allowed" : "pointer",
        }}
        onClick={handleSubmit}
        disabled={!resumeFile || !jdFile || loading}
      >
        {loading ? "Generating..." : "Generate tailored LaTeX →"}
      </button>

      {latex && (
        <div style={styles.outputSection}>
          <div style={styles.outputHeader}>
            <span style={styles.outputLabel}>LaTeX — paste into Overleaf</span>
            <button style={styles.copyBtn} onClick={handleCopy}>
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
          <pre style={styles.latexBox}>{latex}</pre>
          <p style={styles.hint}>
            → overleaf.com · New Project · Blank · paste and compile
          </p>

          {gaps.length > 0 && (
            <div style={styles.gapBox}>
              <p style={styles.gapLabel}>Skills gap — not in your resume</p>
              {gaps.map((g, i) => (
                <p key={i} style={styles.gapItem}>— {g}</p>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function UploadZone({ label, hint, file, onChange, accept }) {
  return (
    <label style={{ ...styles.uploadZone, ...(file ? styles.uploadZoneDone : {}) }}>
      <input
        type="file"
        accept={accept}
        style={{ display: "none" }}
        onChange={(e) => onChange(e.target.files[0])}
      />
      <span style={styles.zoneLabel}>{label}</span>
      <span style={styles.zoneName}>
        {file ? file.name : "Drop or click to upload"}
      </span>
      <span style={styles.zoneHint}>{file ? "✓ Ready" : hint}</span>
    </label>
  );
}

const styles = {
  container: {
    maxWidth: 720,
    margin: "0 auto",
    padding: "2rem 1.5rem",
    fontFamily: "monospace",
  },
  title: {
    fontSize: 22,
    fontWeight: 600,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    color: "#666",
    marginBottom: 24,
  },
  uploadGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 12,
    marginBottom: 16,
  },
  uploadZone: {
    border: "1px dashed #ccc",
    borderRadius: 10,
    padding: "1.25rem",
    cursor: "pointer",
    display: "flex",
    flexDirection: "column",
    gap: 4,
    minHeight: 100,
    justifyContent: "center",
    transition: "background 0.15s",
  },
  uploadZoneDone: {
    borderColor: "#4caf50",
    background: "#f0fff0",
  },
  zoneLabel: {
    fontSize: 11,
    textTransform: "uppercase",
    letterSpacing: "0.8px",
    color: "#888",
  },
  zoneName: {
    fontSize: 13,
    fontWeight: 500,
  },
  zoneHint: {
    fontSize: 11,
    color: "#aaa",
  },
  button: {
    width: "100%",
    padding: "10px 0",
    fontSize: 14,
    fontFamily: "monospace",
    fontWeight: 500,
    border: "1px solid #ccc",
    borderRadius: 8,
    background: "#fff",
    cursor: "pointer",
    marginBottom: 16,
    transition: "background 0.15s",
  },
  error: {
    color: "#c00",
    fontSize: 13,
    marginBottom: 12,
  },
  outputSection: {
    marginTop: 8,
  },
  outputHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  outputLabel: {
    fontSize: 11,
    textTransform: "uppercase",
    letterSpacing: "0.8px",
    color: "#888",
  },
  copyBtn: {
    fontSize: 12,
    fontFamily: "monospace",
    padding: "4px 12px",
    border: "1px solid #ccc",
    borderRadius: 6,
    background: "transparent",
    cursor: "pointer",
  },
  latexBox: {
    background: "#f5f5f5",
    border: "1px solid #e0e0e0",
    borderRadius: 10,
    padding: "1rem",
    fontSize: 11,
    lineHeight: 1.6,
    whiteSpace: "pre-wrap",
    wordBreak: "break-word",
    maxHeight: 400,
    overflowY: "auto",
  },
  hint: {
    fontSize: 12,
    color: "#aaa",
    marginTop: 8,
  },
  gapBox: {
    marginTop: 12,
    background: "#fff5f5",
    border: "1px solid #fcc",
    borderRadius: 10,
    padding: "1rem",
  },
  gapLabel: {
    fontSize: 11,
    textTransform: "uppercase",
    letterSpacing: "0.8px",
    color: "#888",
    marginBottom: 8,
  },
  gapItem: {
    fontSize: 13,
    color: "#c00",
    margin: "3px 0",
  },
};

export default App;