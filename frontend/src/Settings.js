import React, { useEffect, useState } from "react";
import Layout from "./Layout";

export default function Settings() {
  const [powerThreshold, setPowerThreshold] = useState("");
  const [temperatureThreshold, setTemperatureThreshold] = useState("");
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const loadSettings = async () => {
    try {
      setError("");
      const response = await fetch("http://localhost:8000/settings");
      const data = await response.json();

      setPowerThreshold(data.power_threshold);
      setTemperatureThreshold(data.temperature_threshold);
      setEmailAlerts(data.email_alerts);
      setSmsAlerts(data.sms_alerts);
    } catch (err) {
      setError("Failed to load settings");
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const handleSave = async () => {
    try {
      setMessage("");
      setError("");

      const response = await fetch("http://localhost:8000/settings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          power_threshold: powerThreshold,
          temperature_threshold: temperatureThreshold,
          email_alerts: emailAlerts,
          sms_alerts: smsAlerts
        })
      });

      const result = await response.json();

      if (result.success) {
        setMessage("Settings saved successfully");
      } else {
        setError("Failed to save settings");
      }
    } catch (err) {
      setError("Failed to save settings");
    }
  };

  return (
    <Layout title="Settings">
      <h1 style={{ fontSize: "42px", marginBottom: "12px", color: "#1f2d3d" }}>
        Settings
      </h1>

      <p style={{ fontSize: "18px", color: "#475569", marginBottom: "24px" }}>
        Manage thresholds, alerts, and application preferences.
      </p>

      <div
        style={{
          background: "#fff",
          padding: "24px",
          borderRadius: "16px",
          boxShadow: "0 4px 14px rgba(0,0,0,0.08)",
          maxWidth: "700px",
        }}
      >
        <h3 style={{ marginBottom: "20px" }}>Threshold Settings</h3>

        <label style={labelStyle}>Power Threshold</label>
        <input
          type="text"
          value={powerThreshold}
          onChange={(e) => setPowerThreshold(e.target.value)}
          style={inputStyle}
        />

        <label style={labelStyle}>Temperature Threshold</label>
        <input
          type="text"
          value={temperatureThreshold}
          onChange={(e) => setTemperatureThreshold(e.target.value)}
          style={inputStyle}
        />

        <h3 style={{ marginTop: "24px", marginBottom: "16px" }}>Alert Preferences</h3>

        <div style={{ marginBottom: "12px" }}>
          <label>
            <input
              type="checkbox"
              checked={emailAlerts}
              onChange={() => setEmailAlerts(!emailAlerts)}
              style={{ marginRight: "10px" }}
            />
            Enable Email Alerts
          </label>
        </div>

        <div style={{ marginBottom: "18px" }}>
          <label>
            <input
              type="checkbox"
              checked={smsAlerts}
              onChange={() => setSmsAlerts(!smsAlerts)}
              style={{ marginRight: "10px" }}
            />
            Enable SMS Alerts
          </label>
        </div>

        {message && (
          <div
            style={{
              background: "#e8fff1",
              color: "#166534",
              padding: "12px",
              borderRadius: "10px",
              marginBottom: "14px",
            }}
          >
            {message}
          </div>
        )}

        {error && (
          <div
            style={{
              background: "#ffe5e5",
              color: "#b00020",
              padding: "12px",
              borderRadius: "10px",
              marginBottom: "14px",
            }}
          >
            {error}
          </div>
        )}

        <button
          onClick={handleSave}
          style={{
            background: "#2563eb",
            color: "#fff",
            border: "none",
            padding: "12px 18px",
            borderRadius: "10px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          Save Settings
        </button>
      </div>
    </Layout>
  );
}

const labelStyle = {
  display: "block",
  marginBottom: "8px",
  fontWeight: "bold",
  color: "#334155",
};

const inputStyle = {
  width: "100%",
  padding: "12px",
  borderRadius: "10px",
  border: "1px solid #cbd5e1",
  marginBottom: "16px",
  fontSize: "16px",
  boxSizing: "border-box",
};