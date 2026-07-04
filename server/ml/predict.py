import sys
import json
import pandas as pd
import numpy as np

# Load dataset
import os
base = os.path.dirname(os.path.abspath(__file__))
df = pd.read_csv(os.path.join(base, "Testing.csv"))
df["prognosis"] = df["prognosis"].str.strip()

X = df.drop("prognosis", axis=1)
y = df["prognosis"]
symptom_list = X.columns.tolist()

# Naive Bayes scoring
def predict(entered_symptoms):
    scores = {}
    for disease in y.unique():
        subset = X[y == disease]
        log_score = 0
        for symptom in entered_symptoms:
            if symptom in symptom_list:
                p = (subset[symptom].sum() + 1) / (len(subset) + 2)
                log_score += np.log(p)
        scores[disease] = log_score

    vals = np.array(list(scores.values()))
    vals -= vals.max()
    exp_vals = np.exp(vals)
    probs = exp_vals / exp_vals.sum() * 100

    results = sorted(
        zip(scores.keys(), probs),
        key=lambda x: x[1],
        reverse=True
    )[:5]

    return [{"disease": d, "probability": round(float(p), 2)} for d, p in results]

if __name__ == "__main__":
    symptoms = json.loads(sys.argv[1])
    output = predict(symptoms)
    print(json.dumps(output))