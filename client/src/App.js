import { useState, useEffect } from "react";
import axios from "axios";
import SymptomInput from "./components/SymptomInput";
import ResultChart from "./components/ResultChart";

function App() {
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [resetKey, setResetKey] = useState(0);



  const handlePredict = async (symptoms) => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.post("http://localhost:5000/api/predict", { symptoms });
      setPredictions(res.data.predictions);
      
    } catch (err) {
      setError("Prediction failed. Make sure the server is running.");
    }
    setLoading(false);
  };

  // ── Reset everything ──────────────────────────────────
  const handleReset = () => {
    setPredictions([]);
    setError("");
    setResetKey((prev) => prev + 1); // forces SymptomInput to remount and clear
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>

        {/* Header */}
        <div style={styles.header}>
          <h1 style={styles.heading}>🏥 Disease Prediction System</h1>
          <p style={styles.subheading}>Powered by Naive Bayes Classification</p>
        </div>

        {/* Symptom Input */}
        <SymptomInput
          key={resetKey}
          onPredict={handlePredict}
          loading={loading}
        />

        {/* Error */}
        {error && <p style={styles.error}>{error}</p>}

        {/* Results + Reset */}
        {predictions.length > 0 && (
          <>
            <ResultChart predictions={predictions} />

            {/* Reset Button */}
            <div style={styles.resetContainer}>
              <button onClick={handleReset} style={styles.resetBtn}>
                🔄 Reset — Try Another Prediction
              </button>
            </div>
          </>
        )}



        {/* Footer */}
        <p style={styles.footer}>
          ⚠️ For educational purposes only. Always consult a qualified doctor.
        </p>

      </div>
    </div>
  );
}

const styles = {
  page: { minHeight: "100vh", background: "#EEF4FB", padding: "30px 16px" },
  container: { maxWidth: 800, margin: "0 auto" },
  header: { textAlign: "center", marginBottom: 28 },
  heading: { color: "#1F3864", fontSize: 28, margin: 0 },
  subheading: { color: "#555", marginTop: 6 },
  error: { color: "red", textAlign: "center", marginTop: 12 },
  resetContainer: {
    display: "flex",
    justifyContent: "center",
    marginTop: 20,
  },
  resetBtn: {
    padding: "12px 32px",
    fontSize: 15,
    fontWeight: "bold",
    background: "#fff",
    color: "#1F3864",
    border: "2px solid #1F3864",
    borderRadius: 8,
    cursor: "pointer",
    transition: "all 0.2s",
  },
  footer: { textAlign: "center", color: "#888", fontSize: 12, marginTop: 32 },
};

export default App;