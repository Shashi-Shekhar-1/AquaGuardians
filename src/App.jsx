import React, { useState, useEffect } from "react";

export default function AquaGuardians() {
  const [selectedHostel, setSelectedHostel] = useState(null);
  const [logs, setLogs] = useState([]);
  const [notifications, setNotifications] = useState([]);

  const [tank, setTank] = useState({
    level: 60,
    motor: false,
  });

  const hostels = [
    { id: 1, name: "Hostel A", location: "North Campus" },
    { id: 2, name: "Hostel B", location: "South Campus" },
  ];

  // 🔥 Realistic Simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setTank((prev) => {
        let level = prev.level;

        if (prev.motor) {
          level += Math.random() * 3;
        } else {
          level -= Math.random() * 1.5;
        }

        level = Math.max(0, Math.min(100, level));

        return { ...prev, level: Math.round(level) };
      });
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  // ⚙️ Auto Control
  useEffect(() => {
    if (tank.level < 20 && !tank.motor) {
      toggleMotor(true, "Auto Low");
    }
    if (tank.level > 85 && tank.motor) {
      toggleMotor(false, "Auto Full");
    }
  }, [tank.level]);

  // ⚠️ Dry Run
  useEffect(() => {
    if (tank.motor && tank.level < 5) {
      addNotification("⚠️ Dry Run Detected");
    }
  }, [tank]);

  const toggleMotor = (state, reason = "Manual") => {
    setTank((prev) => ({ ...prev, motor: state }));

    const time = new Date().toLocaleTimeString();

    setLogs((prev) => [
      { msg: `${state ? "Motor ON" : "Motor OFF"} (${reason})`, time },
      ...prev,
    ]);

    addNotification(`${state ? "Motor Started" : "Motor Stopped"} (${reason})`);
  };

  const addNotification = (msg) => {
    setNotifications((prev) => [
      { msg, time: new Date().toLocaleTimeString() },
      ...prev,
    ]);
  };

  // 💧 Tank UI
  const Tank = ({ level }) => (
    <div style={styles.tank}>
      <div style={{ ...styles.water, height: `${level}%` }}>
        <div style={styles.wave}></div>
      </div>
      <div style={styles.level}>{level}%</div>
    </div>
  );

  // 🏠 HOSTEL PAGE
  if (!selectedHostel) {
    return (
      <div style={styles.home}>
        <h1 style={styles.title}>💧 AquaGuardians</h1>
        <p style={styles.subtitle}>Smart Water Management System</p>

        <div style={styles.hostelGrid}>
          {hostels.map((h) => (
            <div
              key={h.id}
              style={styles.hostelCard}
              onClick={() => setSelectedHostel(h)}
            >
              <h2>{h.name}</h2>
              <p>{h.location}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 📊 DASHBOARD
  return (
    <div style={styles.app}>
      {/* SIDEBAR */}
      <aside style={styles.sidebar}>
        <h2 style={styles.logo}>💧 AquaGuard</h2>
        <p style={styles.menu}>Dashboard</p>
        <p style={styles.menu}>Tanks</p>
        <p style={styles.menu}>Logs</p>
      </aside>

      {/* MAIN */}
      <div style={styles.main}>
        <header style={styles.header}>
          <button style={styles.backBtn} onClick={() => setSelectedHostel(null)}>
            ← Back
          </button>
          <h2>{selectedHostel.name}</h2>
          <div style={styles.status}>
            {tank.motor ? "🟢 Running" : "🔴 Stopped"}
          </div>
        </header>

        {/* CARDS */}
        <div style={styles.cards}>
          <div style={styles.card}>
            <h4>Water Level</h4>
            <p>{tank.level}%</p>
          </div>

          <div style={styles.card}>
            <h4>Motor</h4>
            <p>{tank.motor ? "ON" : "OFF"}</p>
          </div>

          <div style={styles.card}>
            <h4>Alerts</h4>
            <p>{notifications.length}</p>
          </div>
        </div>

        {/* MAIN GRID */}
        <div style={styles.grid}>
          <div style={styles.panel}>
            <h3>Tank</h3>
            <Tank level={tank.level} />
          </div>

          <div style={styles.panel}>
            <h3>Controls</h3>

            <button style={styles.startBtn} onClick={() => toggleMotor(true)}>
              Start Motor
            </button>

            <button style={styles.stopBtn} onClick={() => toggleMotor(false)}>
              Stop Motor
            </button>
          </div>
        </div>

        {/* LOGS + NOTIFICATIONS */}
        <div style={styles.grid}>
          <div style={styles.panel}>
            <h3>Logs</h3>
            {logs.map((l, i) => (
              <p key={i}>{l.msg} — {l.time}</p>
            ))}
          </div>

          <div style={styles.panel}>
            <h3>Notifications</h3>
            {notifications.map((n, i) => (
              <p key={i}>{n.msg} — {n.time}</p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// 🎨 STYLES
const styles = {
  home: {
    height: "100vh",
    background: "linear-gradient(135deg, #0f172a, #1e293b)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    color: "white",
  },

  title: { fontSize: "2.5rem" },
  subtitle: { color: "#94a3b8", marginBottom: "30px" },

  hostelGrid: { display: "flex", gap: "20px" },

  hostelCard: {
    background: "rgba(255,255,255,0.08)",
    padding: "25px",
    borderRadius: "12px",
    cursor: "pointer",
    textAlign: "center",
  },

  app: { display: "flex", height: "100vh", background: "#f1f5f9" },

  sidebar: { width: "220px", background: "#0f172a", color: "white", padding: "20px" },
  logo: { color: "#38bdf8", marginBottom: "30px" },
  menu: { margin: "15px 0", color: "#cbd5f5" },

  main: { flex: 1, padding: "20px 40px" },

  header: { display: "flex", justifyContent: "space-between", alignItems: "center" },

  backBtn: { background: "none", border: "none", color: "#38bdf8", cursor: "pointer" },

  cards: { display: "flex", gap: "20px", marginTop: "20px" },

  card: {
    background: "white",
    padding: "15px",
    borderRadius: "10px",
    flex: 1,
  },

  grid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginTop: "20px" },

  panel: { background: "white", padding: "20px", borderRadius: "12px" },

  startBtn: { background: "#10b981", color: "white", padding: "10px", marginRight: "10px", border: "none", borderRadius: "6px" },
  stopBtn: { background: "#ef4444", color: "white", padding: "10px", border: "none", borderRadius: "6px" },

  tank: {
    width: "120px",
    height: "240px",
    border: "4px solid #1e293b",
    margin: "20px auto",
    position: "relative",
    overflow: "hidden",
    borderRadius: "12px",
    background: "#e2e8f0",
  },

  water: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    background: "linear-gradient(to top, #0ea5e9, #38bdf8)",
    transition: "height 1s",
  },

  wave: {
    position: "absolute",
    top: "-10px",
    width: "200%",
    height: "30px",
    background: "rgba(255,255,255,0.3)",
    animation: "wave 3s infinite linear",
  },

  level: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    fontWeight: "bold",
  },
};


