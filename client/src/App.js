import { useState, useEffect } from "react";
import axios from "axios";
import SymptomInput from "./components/SymptomInput";
import ResultChart from "./components/ResultChart";

const API = import.meta.env.VITE_API_URL;

function App() {
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [resetKey, setResetKey] = useState(0);
  const [waking, setWaking] = useState(true);

  useEffect(() => {
    axios
      .get(`${API}/api/predict/symptoms`)
      .then(() => setWaking(false))
      .catch(() => {
        setWaking(false);
        setError("Server failed to start. Please refresh.");
      });
  }, []);

  const handlePredict = async (symptoms) => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.post(`${API}/api/predict`, { symptoms });
      setPredictions(res.data.predictions);
    } catch (err) {
      setError("Prediction failed. Please try again.");
    }
    setLoading(false);
  };

  const handleReset = () => {
    setPredictions([]);
    setError("");
    setResetKey((prev) => prev + 1);
  };

  if (waking) {
    return (
      <div style={styles.wakingPage}>
        <div style={styles.wakingBox}>
          <h2 style={styles.wakingTitle}>🏥 Disease Prediction System</h2>
          <p style={styles.wakingText}>⏳ Server is waking up...</p>
          <p style={styles.wakingSubText}>
            This may take 30-60 seconds on first load.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.heading}>🏥 Disease Prediction System</h1>
          <p style={styles.subheading}>Powered by Naive Bayes Classification</p>
        </div>

        <SymptomInput
          key={resetKey}
          onPredict={handlePredict}
          loading={loading}
        />

        {error && <p style={styles.error}>{error}</p>}

        {predictions.length > 0 && (
          <>
            <ResultChart predictions={predictions} />
            <div style={styles.resetContainer}>
              <button onClick={handleReset} style={styles.resetBtn}>
                🔄 Reset — Try Another Prediction
              </button>
            </div>
          </>
        )}

        <p style={styles.footer}>
          ⚠️ For educational purposes only. Always consult a qualified doctor.
        </p>
      </div>
    </div>
  );
}

const styles = {
  wakingPage: {
    minHeight: "100vh",
    background: "#EEF4FB",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  wakingBox: {
    background: "#fff",
    borderRadius: 16,
    padding: "48px 40px",
    textAlign: "center",
    boxShadow: "0 4px 24px rgba(0,0,0,0.1)",
    maxWidth: 400,
    width: "90%",
  },
  wakingTitle: { color: "#1F3864", fontSize: 22, margin: "0 0 12px" },
  wakingText: { color: "#333", fontSize: 16, margin: "0 0 8px" },
  wakingSubText: { color: "#888", fontSize: 13, margin: 0 },
  page: { minHeight: "100vh", background: "#EEF4FB", padding: "30px 16px" },
  container: { maxWidth: 800, margin: "0 auto" },
  header: { textAlign: "center", marginBottom: 28 },
  heading: { color: "#1F3864", fontSize: 28, margin: 0 },
  subheading: { color: "#555", marginTop: 6 },
  error: { color: "red", textAlign: "center", marginTop: 12 },
  resetContainer: { display: "flex", justifyContent: "center", marginTop: 20 },
  resetBtn: {
    padding: "12px 32px",
    fontSize: 15,
    fontWeight: "bold",
    background: "#fff",
    color: "#1F3864",
    border: "2px solid #1F3864",
    borderRadius: 8,
    cursor: "pointer",
  },
  footer: { textAlign: "center", color: "#888", fontSize: 12, marginTop: 32 },
};

export default App;