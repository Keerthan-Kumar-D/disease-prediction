const express = require("express");
const cors = require("cors");
require("dotenv").config();

const predictRoutes = require("./routes/predict");

const app = express();

const allowedOrigins = [
  "http://localhost:3000",
  "https://disease-prediction-brown.vercel.app"
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (Postman, curl, etc.)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error("Not allowed by CORS"));
  }
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