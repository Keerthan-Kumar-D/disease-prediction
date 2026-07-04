import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function ResultChart({ predictions }) {
  if (!predictions || predictions.length === 0) return null;

  const data = {
    labels: predictions.map((p) => p.disease),
    datasets: [
      {
        label: "Probability (%)",
        data: predictions.map((p) => p.probability),
        backgroundColor: ["#1F3864","#2E74B5","#4A90D9","#90CAF9","#BBDEFB"],
        borderRadius: 6,
      },
    ],
  };

  const options = {
    indexAxis: "y",
    responsive: true,
    plugins: {
      legend: { display: false },
      title: { display: true, text: "Top 5 Predicted Diseases", font: { size: 16 }, color: "#1F3864" },
    },
    scales: {
      x: { max: 100, ticks: { callback: (v) => v + "%" } },
    },
  };

  return (
    <div style={styles.container}>
      <Bar data={data} options={options} />
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>Rank</th>
            <th style={styles.th}>Disease</th>
            <th style={styles.th}>Probability</th>
          </tr>
        </thead>
        <tbody>
          {predictions.map((p, i) => (
            <tr key={i} style={{ background: i % 2 === 0 ? "#F5F9FF" : "#fff" }}>
              <td style={styles.td}>{i + 1}</td>
              <td style={styles.td}>{p.disease}</td>
              <td style={styles.td}>{p.probability.toFixed(2)}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const styles = {
  container: { background: "#fff", borderRadius: 12, padding: 24, boxShadow: "0 2px 12px rgba(0,0,0,0.1)", marginTop: 24 },
  table: { width: "100%", borderCollapse: "collapse", marginTop: 20 },
  th: { background: "#1F3864", color: "#fff", padding: "10px 14px", textAlign: "left" },
  td: { padding: "10px 14px", borderBottom: "1px solid #E3F2FD" },
};

export default ResultChart;