import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

export default function Layout({ children, title = "IQEnergy AI Dashboard" }) {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const linkStyle = (path) => ({
    display: "block",
    padding: "14px 16px",
    marginBottom: "10px",
    borderRadius: "10px",
    textDecoration: "none",
    color: location.pathname === path ? "#ffffff" : "#1f2d3d",
    background: location.pathname === path ? "#2563eb" : "#f1f5f9",
    fontWeight: "bold",
  });

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        background: "#eef4ff",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          width: "250px",
          background: "#ffffff",
          padding: "24px 18px",
          boxShadow: "2px 0 10px rgba(0,0,0,0.06)",
        }}
      >
        <h2 style={{ marginTop: 0, marginBottom: "24px", color: "#1f2d3d" }}>
          IQEnergy
        </h2>

        <Link to="/dashboard" style={linkStyle("/dashboard")}>
          Dashboard
        </Link>

        <Link to="/reports" style={linkStyle("/reports")}>
          Reports
        </Link>

        <Link to="/settings" style={linkStyle("/settings")}>
          Settings
        </Link>

        <button
          onClick={handleLogout}
          style={{
            width: "100%",
            marginTop: "24px",
            background: "#ef4444",
            color: "#fff",
            border: "none",
            padding: "12px",
            borderRadius: "10px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          Logout
        </button>
      </div>

      <div style={{ flex: 1 }}>
        <div
          style={{
            background: "#ffffff",
            padding: "18px 28px",
            boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
          }}
        >
          <h2 style={{ margin: 0, color: "#1f2d3d" }}>{title}</h2>
        </div>

        <div style={{ padding: "28px" }}>{children}</div>
      </div>
    </div>
  );
}