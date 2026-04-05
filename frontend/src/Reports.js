import React, { useEffect, useState } from "react";
import Layout from "./Layout";

export default function Reports() {
  const [plant, setPlant] = useState("Plant A");
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  const fetchReportData = async (selectedPlant) => {
    try {
      setError("");
      const response = await fetch(
        `http://localhost:8000/reports-data?plant=${encodeURIComponent(selectedPlant)}`
      );
      const result = await response.json();
      setData(result);
    } catch (err) {
      setError("Failed to load report data");
    }
  };

  useEffect(() => {
    fetchReportData(plant);
  }, [plant]);

  return (
    <Layout title="Reports">
      <h1 style={{ fontSize: "42px", marginBottom: "12px", color: "#1f2d3d" }}>
        Reports
      </h1>

      <p style={{ fontSize: "18px", color: "#475569", marginBottom: "24px" }}>
        View plant performance summaries and reporting data.
      </p>

      <div
        style={{
          background: "#fff",
          padding: "24px",
          borderRadius: "16px",
          boxShadow: "0 4px 14px rgba(0,0,0,0.08)",
          marginBottom: "24px",
          maxWidth: "420px",
        }}
      >
        <h3>Select Plant</h3>
        <select
          value={plant}
          onChange={(e) => setPlant(e.target.value)}
          style={{
            width: "100%",
            padding: "14px",
            borderRadius: "10px",
            border: "1px solid #ccc",
            fontSize: "16px",
            marginTop: "12px",
          }}
        >
          <option>Plant A</option>
          <option>Plant B</option>
          <option>Plant C</option>
        </select>
      </div>

      {error && (
        <div
          style={{
            background: "#ffe5e5",
            color: "#b00020",
            padding: "16px",
            borderRadius: "12px",
            marginBottom: "20px",
          }}
        >
          {error}
        </div>
      )}

      {data && (
        <>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: "20px",
              marginBottom: "24px",
            }}
          >
            <div style={cardStyle}>
              <h3>Daily Generation</h3>
              <p style={valueStyle}>{data.daily_generation}</p>
            </div>

            <div style={cardStyle}>
              <h3>Weekly Generation</h3>
              <p style={valueStyle}>{data.weekly_generation}</p>
            </div>

            <div style={cardStyle}>
              <h3>Efficiency</h3>
              <p style={valueStyle}>{data.efficiency}</p>
            </div>

            <div style={cardStyle}>
              <h3>Incidents</h3>
              <p style={valueStyle}>{data.incidents}</p>
            </div>
          </div>

          <div
            style={{
              background: "#fff",
              padding: "24px",
              borderRadius: "16px",
              boxShadow: "0 4px 14px rgba(0,0,0,0.08)",
            }}
          >
            <h3>Report Summary</h3>
            <p style={{ fontSize: "17px", lineHeight: "1.7" }}>
              {plant} delivered <strong>{data.daily_generation}</strong> today and{" "}
              <strong>{data.weekly_generation}</strong> this week with an efficiency of{" "}
              <strong>{data.efficiency}</strong>. Current operational note:{" "}
              <strong>{data.incidents}</strong>.
            </p>

            <button
              style={{
                marginTop: "18px",
                background: "#2563eb",
                color: "#fff",
                border: "none",
                padding: "12px 18px",
                borderRadius: "10px",
                cursor: "pointer",
                fontWeight: "bold",
              }}
              onClick={() => alert("Demo export completed")}
            >
              Export Report
            </button>
          </div>
        </>
      )}
    </Layout>
  );
}

const cardStyle = {
  background: "#fff",
  padding: "24px",
  borderRadius: "16px",
  boxShadow: "0 4px 14px rgba(0,0,0,0.08)",
};

const valueStyle = {
  fontSize: "28px",
  fontWeight: "bold",
  color: "#2563eb",
};