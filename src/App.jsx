
import React, { useState, useEffect, useRef } from "react";

// ─── Data ────────────────────────────────────────────────────────────────────
const HOSTELS = [
  { id: 1, name: "Hostel 30", location: "North Campus", status: "active", level: 72 },
  { id: 2, name: "IT Building", location: "South Campus", status: "active", level: 55 },
  { id: 3, name: "Admin Block", location: "South Campus", status: "inactive", level: 30 },
  { id: 4, name: "Main Block", location: "South Campus", status: "active", level: 88 },
  { id: 5, name: "Hostel 3", location: "South Campus", status: "damaged", level: 0 },
  { id: 6, name: "Hostel 5", location: "North Campus", status: "active", level: 61 },
  { id: 7, name: "Hostel 7", location: "South Campus", status: "inactive", level: 20 },
  { id: 8, name: "Hostel 8", location: "North Campus", status: "active", level: 45 },
];

// ─── API BASE ───────────────────────────────────────────────────────────────
const API = "http://localhost:5000";

// ─── Helpers ────────────────────────────────────────────────────────────────
const ts = () =>
  new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

const levelStatus = (lvl) => {
  if (lvl < 20) return { cls: "low", label: "Low — motor auto-starting" };
  if (lvl > 85) return { cls: "full", label: "Tank full — motor stopping" };
  return { cls: "ok", label: "Level normal" };
};

// ─── MAIN APP ───────────────────────────────────────────────────────────────
export default function AquaGuardians() {
  const [view, setView] = useState("home");
  const [selected, setSelected] = useState(null);
  const [tank, setTank] = useState({ level: 60, motor: false });
  const [notifications, setNotifs] = useState([]);

  const addNotif = (msg) =>
    setNotifs((prev) => [{ msg, time: ts() }, ...prev].slice(0, 20));

  // ─── REAL HARDWARE CONTROL ───────────────────────────────────────────────
  const sendCommand = async (cmd) => {
    try {
      await fetch(`${API}/motor`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: cmd }),
      });

      if (cmd === "ON") {
        setTank((p) => ({ ...p, motor: true }));
        addNotif("Motor ON sent to system");
      }

      if (cmd === "OFF") {
        setTank((p) => ({ ...p, motor: false }));
        addNotif("Motor OFF sent to system");
      }

      if (cmd === "AUTO") {
        addNotif("AUTO mode activated");
      }
    } catch (err) {
      console.log("API Error:", err);
      addNotif("Server connection error");
    }
  };

  // ─── SELECT HOSTEL ────────────────────────────────────────────────────────
  const selectHostel = (h) => {
    setSelected(h);
    setView("dashboard");
    addNotif(`Opened ${h.name}`);
  };

  // ─── HOME ────────────────────────────────────────────────────────────────
  if (view === "home") {
    return (
      <div style={S.home}>
        <div style={S.homeTitle}>AquaGuardians</div>
        <div style={S.homeSub}>Smart Water Management System</div>

        <div style={S.hostelGrid}>
          {HOSTELS.map((h) => (
            <div key={h.id} style={S.hostelCard} onClick={() => selectHostel(h)}>
              <div style={{ fontSize: 24 }}>🏢</div>
              <div style={S.hostelCardName}>{h.name}</div>
              <div style={S.hostelCardLoc}>{h.location}</div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ─── DASHBOARD ────────────────────────────────────────────────────────────
  const { cls, label } = levelStatus(tank.level);

  return (
    <div style={S.main}>
      <div style={S.header}>
        <button onClick={() => setView("home")} style={S.backBtn}>
          ← Home
        </button>
        <h2 style={S.headerTitle}>
          {selected.name} — {selected.location}
        </h2>
      </div>

      {/* STATUS */}
      <div style={S.statusBox}>
        <div>Water Level: {tank.level}%</div>
        <div>Motor: {tank.motor ? "ON" : "OFF"}</div>
        <div>Status: {label}</div>
      </div>

      {/* BUTTONS */}
      <div style={S.btnRow}>
        <button style={S.btnOn} onClick={() => sendCommand("ON")}>
          MOTOR ON
        </button>

        <button style={S.btnOff} onClick={() => sendCommand("OFF")}>
          MOTOR OFF
        </button>

        <button style={S.btnAuto} onClick={() => sendCommand("AUTO")}>
          AUTO MODE
        </button>
      </div>

      {/* NOTIFICATIONS */}
      <div style={S.panel}>
        <h3>Notifications</h3>
        {notifications.map((n, i) => (
          <div key={i}>
            {n.msg} - {n.time}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── STYLES ────────────────────────────────────────────────────────────────
const S = {
  home: {
    minHeight: "100vh",
    background: "#0f172a",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  homeTitle: { fontSize: 36, color: "#38bdf8", fontWeight: 600 },
  homeSub: { fontSize: 16, color: "#94a3b8", marginBottom: 30 },

  hostelGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3,1fr)",
    gap: 20,
  },
  hostelCard: {
    background: "#1e293b",
    padding: 20,
    borderRadius: 10,
    color: "white",
    cursor: "pointer",
    textAlign: "center",
  },
  hostelCardName: { fontSize: 18, marginTop: 10 },
  hostelCardLoc: { fontSize: 12, color: "#94a3b8" },

  main: { padding: 20 },
  header: { display: "flex", alignItems: "center", gap: 10 },
  headerTitle: { fontSize: 22 },

  backBtn: {
    padding: 8,
    borderRadius: 6,
    border: "1px solid gray",
  },

  statusBox: {
    marginTop: 20,
    padding: 15,
    background: "#f1f5f9",
    borderRadius: 10,
  },

  btnRow: {
    display: "flex",
    gap: 10,
    marginTop: 20,
  },

  btnOn: { padding: 10, background: "green", color: "white" },
  btnOff: { padding: 10, background: "red", color: "white" },
  btnAuto: { padding: 10, background: "orange", color: "white" },

  panel: { marginTop: 20 },
};
