import React, { useEffect, useMemo, useState } from "react";

const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://127.0.0.1:8000";

function Dashboard() {
  const [selectedPlant, setSelectedPlant] = useState("Plant A");
  const [dashboardData, setDashboardData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(
      `${API_BASE_URL}/dashboard-data?plant=${encodeURIComponent(selectedPlant)}`
    )
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch dashboard data");
        }
        return res.json();
      })
      .then((data) => {
        setDashboardData(data);
        setError("");
      })
      .catch((err) => {
        console.error("Error fetching dashboard data:", err);
        setError("Unable to load dashboard data");
      });
  }, [selectedPlant]);

  const plant = dashboardData?.plant || selectedPlant;
  const power = dashboardData?.power ?? "N/A";
  const temperature = dashboardData?.temperature ?? "N/A";
  const status = dashboardData?.status || "N/A";

  const aiInsight =
    dashboardData?.ai_insight ||
    dashboardData?.aiInsights ||
    dashboardData?.insight ||
    "No AI insight available";

  const alerts = Array.isArray(dashboardData?.alerts)
    ? dashboardData.alerts
    : dashboardData?.alerts
    ? [dashboardData.alerts]
    : [];

  const powerSeries = useMemo(() => {
    if (
      Array.isArray(dashboardData?.power_history) &&
      dashboardData.power_history.length > 0
    ) {
      return dashboardData.power_history;
    }
    return [95, 105, 110, 118, 120, 117];
  }, [dashboardData]);

  const temperatureSeries = useMemo(() => {
    if (
      Array.isArray(dashboardData?.temperature_history) &&
      dashboardData.temperature_history.length > 0
    ) {
      return dashboardData.temperature_history;
    }
    return [38, 40, 42, 44, 45, 43];
  }, [dashboardData]);

  const chartLabels = ["6 AM", "9 AM", "12 PM", "3 PM", "6 PM", "9 PM"];

  const getStatusColor = (value) => {
    const text = String(value).toLowerCase();
    if (
      text.includes("normal") ||
      text.includes("stable") ||
      text.includes("running")
    ) {
      return "#16a34a";
    }
    if (text.includes("warning") || text.includes("alert")) {
      return "#f59e0b";
    }
    if (text.includes("critical") || text.includes("down")) {
      return "#dc2626";
    }
    return "#334155";
  };

  const renderLineChart = (data, title, unit, lineColor = "#2563eb") => {
    const width = 520;
    const height = 230;
    const padding = 36;

    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min || 1;

    const points = data
      .map((value, index) => {
        const x =
          padding + (index * (width - padding * 2)) / (data.length - 1);
        const y =
          height - padding - ((value - min) / range) * (height - padding * 2);
        return `${x},${y}`;
      })
      .join(" ");

    return (
      <div
        style={{
          background: "#ffffff",
          borderRadius: "20px",
          padding: "22px",
          border: "1px solid #e2e8f0",
          boxShadow: "0 12px 30px rgba(15, 23, 42, 0.06)",
          height: "100%",
        }}
      >
        <div style={{ marginBottom: "12px" }}>
          <h3
            style={{
              margin: 0,
              fontSize: "22px",
              color: "#0f172a",
              fontWeight: "700",
            }}
          >
            {title}
          </h3>
          <p
            style={{
              margin: "5px 0 0 0",
              color: "#64748b",
              fontSize: "14px",
            }}
          >
            Live operational trend
          </p>
        </div>

        <svg
          viewBox={`0 0 ${width} ${height}`}
          style={{ width: "100%", height: "240px", display: "block" }}
        >
          <line
            x1={padding}
            y1={height - padding}
            x2={width - padding}
            y2={height - padding}
            stroke="#dbe3ee"
            strokeWidth="2"
          />
          <line
            x1={padding}
            y1={padding}
            x2={padding}
            y2={height - padding}
            stroke="#dbe3ee"
            strokeWidth="2"
          />

          {data.map((value, index) => {
            const x =
              padding + (index * (width - padding * 2)) / (data.length - 1);
            const y =
              height -
              padding -
              ((value - min) / range) * (height - padding * 2);

            return (
              <g key={index}>
                <circle cx={x} cy={y} r="5" fill={lineColor} />
                <text
                  x={x}
                  y={y - 12}
                  textAnchor="middle"
                  fontSize="11"
                  fill="#334155"
                  fontWeight="600"
                >
                  {value} {unit}
                </text>
                <text
                  x={x}
                  y={height - 10}
                  textAnchor="middle"
                  fontSize="11"
                  fill="#64748b"
                >
                  {chartLabels[index] || `P${index + 1}`}
                </text>
              </g>
            );
          })}

          <polyline
            fill="none"
            stroke={lineColor}
            strokeWidth="4"
            strokeLinejoin="round"
            strokeLinecap="round"
            points={points}
          />
        </svg>
      </div>
    );
  };

  if (error) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#f4f8fc",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <div
          style={{
            background: "#ffffff",
            padding: "24px",
            borderRadius: "18px",
            boxShadow: "0 12px 30px rgba(15, 23, 42, 0.08)",
            color: "#dc2626",
            fontSize: "18px",
            fontWeight: "600",
          }}
        >
          {error}
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#f4f8fc",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "Arial, sans-serif",
          fontSize: "18px",
          color: "#0f172a",
        }}
      >
        Loading dashboard...
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(180deg, #eef5ff 0%, #f7fbff 40%, #ffffff 100%)",
        fontFamily: "Arial, sans-serif",
        color: "#0f172a",
        padding: "18px",
      }}
    >
      <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
        <div
          style={{
            background: "linear-gradient(90deg, #0f172a 0%, #1d4ed8 100%)",
            color: "#ffffff",
            borderRadius: "24px",
            padding: "18px 24px",
            boxShadow: "0 18px 40px rgba(15, 23, 42, 0.18)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "20px",
            flexWrap: "wrap",
            marginBottom: "22px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "18px" }}>
            <div
              style={{
                background: "#ffffff",
                borderRadius: "16px",
                padding: "8px 12px",
                boxShadow: "0 8px 18px rgba(0,0,0,0.10)",
              }}
            >
              <img
                src="/logo.png"
                alt="Company Logo"
                style={{
                  height: "46px",
                  width: "150px",
                  objectFit: "contain",
                  display: "block",
                }}
              />
            </div>

            <div>
              <h1
                style={{
                  margin: 0,
                  fontSize: "30px",
                  fontWeight: "800",
                  letterSpacing: "0.2px",
                }}
              >
                iQ Energy - AI Dashboard
              </h1>
              <p
                style={{
                  margin: "6px 0 0 0",
                  opacity: 0.92,
                  fontSize: "15px",
                }}
              >
                Real-time plant monitoring, alerts, and AI-driven operational insights
              </p>
            </div>
          </div>

          <div
            style={{
              background: "rgba(255,255,255,0.10)",
              border: "1px solid rgba(255,255,255,0.16)",
              borderRadius: "16px",
              padding: "12px 14px",
              minWidth: "210px",
            }}
          >
            <label
              htmlFor="plant-select"
              style={{
                display: "block",
                fontSize: "13px",
                marginBottom: "6px",
                opacity: 0.9,
              }}
            >
              Select Plant
            </label>
            <select
              id="plant-select"
              value={selectedPlant}
              onChange={(e) => setSelectedPlant(e.target.value)}
              style={{
                width: "100%",
                padding: "10px 12px",
                borderRadius: "10px",
                border: "none",
                fontSize: "15px",
                outline: "none",
                background: "#ffffff",
              }}
            >
              <option>Plant A</option>
              <option>Plant B</option>
              <option>Plant C</option>
            </select>
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: "18px",
            marginBottom: "22px",
          }}
        >
          {[
            { title: "Plant", value: plant, color: "#0f172a", badge: "Active Site" },
            { title: "Power Output", value: `${power} MW`, color: "#0f172a", badge: "Live Output" },
            { title: "Temperature", value: `${temperature} °C`, color: "#0f172a", badge: "Thermal State" },
            { title: "System Status", value: status, color: getStatusColor(status), badge: "Health Check" },
          ].map((card, index) => (
            <div
              key={index}
              style={{
                background: "#ffffff",
                borderRadius: "20px",
                padding: "22px",
                boxShadow: "0 12px 30px rgba(15, 23, 42, 0.06)",
                border: "1px solid #e2e8f0",
              }}
            >
              <div
                style={{
                  display: "inline-block",
                  marginBottom: "12px",
                  padding: "5px 10px",
                  borderRadius: "999px",
                  background: "#eef4ff",
                  color: "#2563eb",
                  fontSize: "12px",
                  fontWeight: "700",
                }}
              >
                {card.badge}
              </div>

              <p style={{ margin: 0, color: "#64748b", fontSize: "14px" }}>
                {card.title}
              </p>
              <h2
                style={{
                  margin: "10px 0 0 0",
                  fontSize: "24px",
                  color: card.color,
                  fontWeight: "800",
                }}
              >
                {card.value}
              </h2>
            </div>
          ))}
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr",
            gap: "20px",
            marginBottom: "22px",
          }}
        >
          <div>{renderLineChart(powerSeries, "Power Trend", "MW", "#2563eb")}</div>

          <div
            style={{
              background: "#ffffff",
              borderRadius: "20px",
              padding: "22px",
              border: "1px solid #e2e8f0",
              boxShadow: "0 12px 30px rgba(15, 23, 42, 0.06)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "14px",
              }}
            >
              <h3
                style={{
                  margin: 0,
                  fontSize: "22px",
                  color: "#b91c1c",
                  fontWeight: "800",
                }}
              >
                Alerts
              </h3>
              <div
                style={{
                  background: alerts.length > 0 ? "#fef2f2" : "#f0fdf4",
                  color: alerts.length > 0 ? "#dc2626" : "#16a34a",
                  padding: "6px 10px",
                  borderRadius: "999px",
                  fontSize: "12px",
                  fontWeight: "700",
                }}
              >
                {alerts.length} Active
              </div>
            </div>

            {alerts.length > 0 ? (
              <div style={{ display: "grid", gap: "12px" }}>
                {alerts.map((alert, index) => (
                  <div
                    key={index}
                    style={{
                      background: "#fff7ed",
                      border: "1px solid #fed7aa",
                      borderRadius: "14px",
                      padding: "14px",
                      color: "#7c2d12",
                      fontSize: "15px",
                      fontWeight: "600",
                      lineHeight: "1.5",
                    }}
                  >
                    {alert}
                  </div>
                ))}
              </div>
            ) : (
              <div
                style={{
                  background: "#f0fdf4",
                  border: "1px solid #bbf7d0",
                  borderRadius: "14px",
                  padding: "14px",
                  color: "#166534",
                  fontWeight: "600",
                }}
              >
                No active alerts
              </div>
            )}
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.2fr 1fr",
            gap: "20px",
          }}
        >
          <div>{renderLineChart(temperatureSeries, "Temperature Trend", "°C", "#f97316")}</div>

          <div style={{ display: "grid", gap: "20px" }}>
            <div
              style={{
                background: "#ffffff",
                borderRadius: "20px",
                padding: "22px",
                border: "1px solid #e2e8f0",
                boxShadow: "0 12px 30px rgba(15, 23, 42, 0.06)",
              }}
            >
              <h3
                style={{
                  marginTop: 0,
                  marginBottom: "14px",
                  fontSize: "22px",
                  color: "#2563eb",
                  fontWeight: "800",
                }}
              >
                AI Insights
              </h3>

              <div
                style={{
                  background:
                    "linear-gradient(135deg, #eff6ff 0%, #ffffff 100%)",
                  border: "1px solid #dbeafe",
                  borderRadius: "16px",
                  padding: "18px",
                  lineHeight: "1.7",
                  fontSize: "15px",
                  color: "#334155",
                }}
              >
                {aiInsight}
              </div>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "18px",
              }}
            >
              <div
                style={{
                  background: "#ffffff",
                  borderRadius: "20px",
                  padding: "20px",
                  boxShadow: "0 12px 30px rgba(15, 23, 42, 0.06)",
                  border: "1px solid #e2e8f0",
                }}
              >
                <p style={{ margin: 0, color: "#64748b", fontSize: "14px" }}>
                  Efficiency
                </p>
                <h3
                  style={{
                    margin: "10px 0 0 0",
                    fontSize: "28px",
                    fontWeight: "800",
                    color: "#0f172a",
                  }}
                >
                  94.8%
                </h3>
              </div>

              <div
                style={{
                  background: "#ffffff",
                  borderRadius: "20px",
                  padding: "20px",
                  boxShadow: "0 12px 30px rgba(15, 23, 42, 0.06)",
                  border: "1px solid #e2e8f0",
                }}
              >
                <p style={{ margin: 0, color: "#64748b", fontSize: "14px" }}>
                  Risk Level
                </p>
                <h3
                  style={{
                    margin: "10px 0 0 0",
                    fontSize: "28px",
                    fontWeight: "800",
                    color: "#16a34a",
                  }}
                >
                  Low
                </h3>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;