const express = require("express");
const cors = require("cors");
require("dotenv").config();

const predictRoutes = require("./routes/predict");

const app = express();

app.use(cors({
  origin: [
    "https://disease-prediction-nu.vercel.app",
    "http://localhost:5173"
  ]
}));

app.use(express.json());

// Root route
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Disease Prediction API is running"
  });
});

// Prediction route
app.use("/api/predict", predictRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});