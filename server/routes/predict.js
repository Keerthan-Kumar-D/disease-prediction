const express = require("express");
const router = express.Router();
const { PythonShell } = require("python-shell");
const { execSync } = require("child_process");
const path = require("path");
const Prediction = require("../models/Prediction");

// GET /api/predict/symptoms
router.get("/symptoms", (req, res) => {
  try {
    const csvPath = path.join(__dirname, "../ml/Testing.csv").replace(/\\/g, "\\\\");
    const result = execSync(
      `python -c "import pandas as pd; df = pd.read_csv('${csvPath}'); print(','.join(df.columns[:-1].tolist()))"`
    );
    const symptoms = result.toString().trim().split(",");
    res.json(symptoms);
  } catch (error) {
    res.status(500).json({ error: "Failed to load symptoms", details: error.message });
  }
});

// POST /api/predict
router.post("/", async (req, res) => {
  const { symptoms } = req.body;

  if (!symptoms || symptoms.length === 0) {
    return res.status(400).json({ error: "No symptoms provided" });
  }

  try {
    const options = {
      mode: "text",
      pythonPath: "python",
      scriptPath: path.join(__dirname, "../ml"),
      args: [JSON.stringify(symptoms)],
    };

    PythonShell.run("predict.py", options).then((results) => {
      const predictions = JSON.parse(results[0]);
      const prediction = new Prediction({ symptoms, results: predictions });
      prediction.save();
      res.json({ symptoms, predictions });
    }).catch((err) => {
      res.status(500).json({ error: "Python error", details: err.message });
    });

  } catch (error) {
    res.status(500).json({ error: "Prediction failed", details: error.message });
  }
});

// GET /api/predict/history
router.get("/history", async (req, res) => {
  try {
    const history = await Prediction.find().sort({ createdAt: -1 }).limit(10);
    res.json(history);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch history" });
  }
});

module.exports = router;