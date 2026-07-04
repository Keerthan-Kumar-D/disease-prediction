const express = require("express");
const router = express.Router();
const { execSync, exec } = require("child_process");
const path = require("path");

const ML_PATH = path.join(__dirname, "../ml");
const CSV_PATH = path.join(ML_PATH, "Testing.csv");
const SCRIPT_PATH = path.join(ML_PATH, "predict.py");

// GET /api/predict/symptoms
router.get("/symptoms", (req, res) => {
  try {
    const result = execSync(
      `python3 -c "import pandas as pd; df = pd.read_csv(r'${CSV_PATH}'); print(','.join(df.columns[:-1].tolist()))"`
    );
    const symptoms = result.toString().trim().split(",");
    res.json(symptoms);
  } catch (error) {
    res.status(500).json({ error: "Failed to load symptoms", details: error.message });
  }
});

// POST /api/predict
router.post("/", (req, res) => {
  const { symptoms } = req.body;

  if (!symptoms || symptoms.length === 0) {
    return res.status(400).json({ error: "No symptoms provided" });
  }

  const symptomsArg = JSON.stringify(symptoms);

  exec(
    `python3 "${SCRIPT_PATH}" '${symptomsArg}'`,
    (error, stdout, stderr) => {
      if (error) {
        console.error("Python error:", stderr);
        return res.status(500).json({ error: "Python failed", details: stderr });
      }
      try {
        const predictions = JSON.parse(stdout.trim());
        res.json({ symptoms, predictions });
      } catch (parseError) {
        res.status(500).json({ error: "Parse failed", details: stdout });
      }
    }
  );
});

module.exports = router;