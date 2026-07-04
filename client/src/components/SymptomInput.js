import { useState, useEffect } from "react";
import axios from "axios";

function SymptomInput({ onPredict, loading }) {
  const [allSymptoms, setAllSymptoms] = useState([]);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState([]);
  const [suggestions, setSuggestions] = useState([]);

  const API = import.meta.env.VITE_API_URL;

 useEffect(() => {
   axios.get(`${API}/api/predict/symptoms`).then((res) => {
     setAllSymptoms(res.data);
   });
 }, []);

  const handleSearch = (e) => {
    const val = e.target.value.toLowerCase();
    setQuery(val);
    if (val.length > 1) {
      const filtered = allSymptoms.filter((s) =>
        s.toLowerCase().includes(val.replace(" ", "_"))
      );
      setSuggestions(filtered.slice(0, 6));
    } else {
      setSuggestions([]);
    }
  };

  const addSymptom = (symptom) => {
    if (!selected.includes(symptom)) {
      setSelected([...selected, symptom]);
    }
    setQuery("");
    setSuggestions([]);
  };

  const removeSymptom = (symptom) => {
    setSelected(selected.filter((s) => s !== symptom));
  };

  const handlePredict = () => {
    if (selected.length > 0) onPredict(selected);
  };

  // ── Clear only symptoms (local reset) ────────────────
  const handleClear = () => {
    setSelected([]);
    setQuery("");
    setSuggestions([]);
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>🩺 Enter Your Symptoms</h2>

      {/* Search Input */}
      <div style={styles.searchBox}>
        <input
          type="text"
          value={query}
          onChange={handleSearch}
          placeholder="Type a symptom (e.g. fever, headache...)"
          style={styles.input}
        />
        {suggestions.length > 0 && (
          <ul style={styles.dropdown}>
            {suggestions.map((s) => (
              <li
                key={s}
                onClick={() => addSymptom(s)}
                style={styles.dropdownItem}
                onMouseEnter={(e) => (e.target.style.background = "#EEF4FB")}
                onMouseLeave={(e) => (e.target.style.background = "#fff")}
              >
                {s.replace(/_/g, " ")}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Selected Symptom Tags */}
      {selected.length > 0 && (
        <div style={styles.tagContainer}>
          {selected.map((s) => (
            <span key={s} style={styles.tag}>
              {s.replace(/_/g, " ")}
              <button
                onClick={() => removeSymptom(s)}
                style={styles.removeBtn}
              >
                ✕
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Symptom count */}
      {selected.length > 0 && (
        <p style={styles.count}>
          {selected.length} symptom{selected.length > 1 ? "s" : ""} selected
        </p>
      )}

      {/* Buttons Row */}
      <div style={styles.btnRow}>
        {/* Clear Symptoms Button — only shows when symptoms selected */}
        {selected.length > 0 && (
          <button onClick={handleClear} style={styles.clearBtn}>
            🗑️ Clear Symptoms
          </button>
        )}

        {/* Predict Button */}
        <button
          onClick={handlePredict}
          disabled={selected.length === 0 || loading}
          style={{
            ...styles.predictBtn,
            opacity: selected.length === 0 || loading ? 0.5 : 1,
            flex: 1,
          }}
        >
          {loading ? "⏳ Predicting..." : "🔍 Predict Disease"}
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    background: "#fff",
    borderRadius: 12,
    padding: 24,
    boxShadow: "0 2px 12px rgba(0,0,0,0.1)",
  },
  title: { color: "#1F3864", marginBottom: 16, marginTop: 0 },
  searchBox: { position: "relative" },
  input: {
    width: "100%",
    padding: "10px 14px",
    fontSize: 15,
    borderRadius: 8,
    border: "1.5px solid #90CAF9",
    outline: "none",
    boxSizing: "border-box",
  },
  dropdown: {
    position: "absolute",
    top: "100%",
    left: 0,
    right: 0,
    background: "#fff",
    border: "1px solid #90CAF9",
    borderRadius: 8,
    listStyle: "none",
    margin: 0,
    padding: 0,
    zIndex: 100,
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
  },
  dropdownItem: {
    padding: "10px 14px",
    cursor: "pointer",
    fontSize: 14,
    borderBottom: "1px solid #f0f0f0",
    transition: "background 0.15s",
  },
  tagContainer: {
    display: "flex",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 16,
    minHeight: 40,
  },
  tag: {
    background: "#E3F2FD",
    color: "#1F3864",
    padding: "6px 12px",
    borderRadius: 20,
    fontSize: 13,
    display: "flex",
    alignItems: "center",
    gap: 6,
  },
  removeBtn: {
    background: "none",
    border: "none",
    cursor: "pointer",
    color: "#1F3864",
    fontWeight: "bold",
    padding: 0,
    fontSize: 12,
  },
  count: {
    color: "#888",
    fontSize: 13,
    marginTop: 8,
    marginBottom: 0,
  },
  btnRow: {
    display: "flex",
    gap: 12,
    marginTop: 16,
  },
  clearBtn: {
    padding: "12px 20px",
    fontSize: 14,
    fontWeight: "bold",
    background: "#fff",
    color: "#E53935",
    border: "2px solid #E53935",
    borderRadius: 8,
    cursor: "pointer",
  },
  predictBtn: {
    padding: "12px",
    fontSize: 16,
    fontWeight: "bold",
    background: "#1F3864",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    cursor: "pointer",
  },
};

export default SymptomInput;