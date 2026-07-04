# Disease Prediction System

An end-to-end disease prediction web application built with a React frontend, an Express backend, and a Python-based prediction engine. Users can search and select symptoms, send them to the server, and receive the top predicted diseases with probabilities in both chart and table form.

The prediction flow uses a simple Naive Bayes-style scoring approach over the symptom dataset stored in `server/ml/Testing.csv`. The backend also stores each prediction in MongoDB so recent results can be reviewed later.

## Project Overview

This project is designed as an educational symptom checker. It is not a medical diagnosis tool and should not replace a doctor’s advice.

How it works:

1. The user searches for symptoms in the React UI.
2. The frontend sends the selected symptoms to the Express API.
3. The backend loads the symptom dataset and calls the Python prediction script.
4. The Python script calculates the top predicted diseases.
5. The results are returned to the frontend and displayed as a bar chart and table.
6. The prediction is saved in MongoDB for history tracking.

## Features

- Symptom search with autocomplete suggestions
- Multi-select symptom input
- Disease prediction based on selected symptoms
- Top 5 disease probabilities shown in a chart and table
- Prediction history saved in MongoDB
- Clean split between client, server, and ML logic

## Tech Stack

- Frontend: React, Axios, Chart.js, react-chartjs-2
- Backend: Node.js, Express, Mongoose, CORS
- ML / Data Processing: Python, pandas, numpy
- Database: MongoDB

## Repository Structure

```text
client/
  src/
    components/
      SymptomInput.jsx
      ResultChart.jsx
server/
  index.js
  routes/
    predict.js
  models/
    prediction.js
  ml/
    predict.py
    Testing.csv
  requirements.txt
```

## Prerequisites

Before running the project, make sure you have:

- Node.js and npm installed
- Python 3 installed
- MongoDB running locally or a MongoDB Atlas connection string

## Setup Instructions

### 1. Clone the repository

```bash
git clone <your-repository-url>
cd disease-prediction
```

### 2. Install frontend dependencies

```bash
cd client
npm install
```

### 3. Install backend dependencies

```bash
cd ../server
npm install
```

### 4. Install Python dependencies

```bash
python -m pip install -r requirements.txt
```

### 5. Configure environment variables

Create a `.env` file inside the `server/` folder if you want to override the default MongoDB connection or server port.

Example:

```env
MONGO_URI=mongodb://localhost:27017/disease_prediction
PORT=5000
```

If `MONGO_URI` is not set, the server uses the local MongoDB URI above by default.

### 6. Start MongoDB

Make sure MongoDB is running before starting the backend. If you are using a local installation, start the MongoDB service first. If you are using MongoDB Atlas, update `MONGO_URI` accordingly.

### 7. Run the backend server

```bash
cd server
node index.js
```

The backend runs on `http://localhost:5000` by default.

### 8. Run the React frontend

Open a second terminal:

```bash
cd client
npm start
```

The frontend runs on `http://localhost:3000`.

## API Endpoints

### `GET /api/predict/symptoms`
Returns the available symptom list from the dataset.

### `POST /api/predict`
Accepts a JSON body like this:

```json
{
  "symptoms": ["fever", "headache"]
}
```

Returns the top predicted diseases with probabilities.

### `GET /api/predict/history`
Returns the most recent saved predictions from MongoDB.

## Python Requirements

The Python prediction script depends on:

- `pandas`
- `numpy`

These are listed in `server/requirements.txt`.

## Notes

- The frontend currently points to `http://localhost:5000` for API requests.
- The dataset file `server/ml/Testing.csv` must remain in place for symptom loading and prediction.
- The project is intended for demonstration and learning purposes only.

## Troubleshooting

- If the frontend shows a prediction error, confirm the backend is running on port `5000`.
- If symptoms do not load, check that Python is installed and the `pandas` dependency is available.
- If MongoDB connection errors appear, verify the `MONGO_URI` value and that MongoDB is reachable.

## Disclaimer

This application is not a substitute for professional medical advice, diagnosis, or treatment. Always consult a qualified healthcare provider for medical concerns.