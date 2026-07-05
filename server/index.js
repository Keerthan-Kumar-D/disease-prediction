const express = require("express");
const cors = require("cors");
require("dotenv").config();

const predictRoutes = require("./routes/predict");

const app = express();

// Temporary CORS configuration (allows all origins)
app.use(cors());

app.use(express.json());

// Root route
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Disease Prediction API is running"
  });
});

// Routes
app.use("/api/predict", predictRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});