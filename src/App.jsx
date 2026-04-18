import React, { useState, useEffect, useRef } from "react";

// ─── Data ────────────────────────────────────────────────────────────────────
const HOSTELS = [
  { id: 1, name: "Hostel 30",    location: "North Campus", status: "active",   level: 72 },
  { id: 2, name: "IT Building",  location: "South Campus", status: "active",   level: 55 },
  { id: 3, name: "Admin Block",  location: "South Campus", status: "inactive", level: 30 },
  { id: 4, name: "Main Block",   location: "South Campus", status: "active",   level: 88 },
  { id: 5, name: "Hostel 3",     location: "South Campus", status: "damaged",  level: 0  },
  { id: 6, name: "Hostel 5",     location: "North Campus", status: "active",   level: 61 },
  { id: 7, name: "Hostel 7",     location: "South Campus", status: "inactive", level: 20 },
  { id: 8, name: "Hostel 8",     location: "North Campus", status: "active",   level: 45 },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────
const ts = () =>
  new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });

const levelStatus = (lvl) => {
  if (lvl < 20) return { cls: "low",  label: "Low — motor auto-starting" };
  if (lvl > 85) return { cls: "full", label: "Tank full — motor stopping" };
  return { cls: "ok", label: "Level normal" };
};

const statusPillStyle = (s) => {
  if (s === "active")   return { bg: "#dcfce7", color: "#166534" };
  if (s === "inactive") return { bg: "#fef3c7", color: "#92400e" };
  return { bg: "#fee2e2", color: "#991b1b" };
};

const barColor = (s) => {
  if (s === "active")   return "#0ea5e9";
  if (s === "inactive") return "#f59e0b";
  return "#ef4444";
};

const dotColor = (type) => {
  if (type === "start") return "#10b981";
  if (type === "stop")  return "#ef4444";
  if (type === "warn")  return "#8b5cf6";
  return "#f59e0b";
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function Sidebar({ view, setView, hasSelected }) {
  const items = [
    { key: "dashboard", label: "Dashboard" },
    { key: "tanks",     label: "Tanks"     },
    { key: "history",   label: "History"   },
  ];
  return (
    <aside style={S.sidebar}>
      <div style={S.sidebarLogo}>💧 AquaGuardians</div>
      {items.map((item) => (
        <div
          key={item.key}
          style={{
            ...S.sidebarItem,
            ...(view === item.key ? S.sidebarItemActive : {}),
            ...(item.key === "dashboard" && !hasSelected ? { opacity: 0.4, cursor: "default" } : {}),
          }}
          onClick={() => {
            if (item.key === "dashboard" && !hasSelected) return;
            setView(item.key);
          }}
        >
          {item.label}
        </div>
      ))}
    </aside>
  );
}

function TankVisual({ level }) {
  return (
    <div style={S.tankWrap}>
      <div style={S.tankOuter}>
        <div style={{ ...S.tankWater, height: `${level}%` }}>
          <div style={S.tankShimmer} />
        </div>
      </div>
      <div style={S.tankPct}>{level}% full</div>
      <div style={S.tankBarWrap}>
        <div style={{ ...S.tankBar, width: `${level}%` }} />
      </div>
    </div>
  );
}

function StatCard({ label, value, color }) {
  return (
    <div style={S.statCard}>
      <div style={S.statLabel}>{label}</div>
      <div style={{ ...S.statValue, color }}>{value}</div>
    </div>
  );
}

// ─── Views ────────────────────────────────────────────────────────────────────

function HomeView({ onSelect }) {
  return (
    <div style={S.home}>
      <div style={S.homeTitle}>AquaGuardians</div>
      <div style={S.homeSub}>Smart Water Management System</div>
      <div style={S.hostelGrid}>
        {HOSTELS.map((h) => (
          <div key={h.id} style={S.hostelCard} onClick={() => onSelect(h)}>
            <div style={{ fontSize: 24, marginBottom: 8 }}>🏢</div>
            <div style={S.hostelCardName}>{h.name}</div>
            <div style={S.hostelCardLoc}>{h.location}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function DashboardView({ hostel, tank, onToggleMotor, notifications, onHome }) {
  const { cls, label } = levelStatus(tank.level);
  return (
    <div style={S.main}>
      {/* Header */}
      <div style={S.header}>
        <button style={S.backBtn} onClick={onHome}>← Home</button>
        <h2 style={S.headerTitle}>{hostel.name} — {hostel.location}</h2>
        <span style={{ ...S.motorBadge, ...(tank.motor ? S.motorOn : S.motorOff) }}>
          {tank.motor ? "Motor running" : "Motor stopped"}
        </span>
      </div>

      {/* Stats */}
      <div style={S.statRow}>
        <StatCard label="Water level"   value={`${tank.level}%`} color="#0ea5e9" />
        <StatCard label="Motor status"  value={tank.motor ? "On" : "Off"} color={tank.motor ? "#10b981" : "#f59e0b"} />
        <StatCard label="Alerts"        value={notifications.length} color="#334155" />
      </div>

      {/* Tank + Controls */}
      <div style={S.grid2}>
        <div style={S.panel}>
          <div style={S.panelTitle}>Tank view</div>
          <TankVisual level={tank.level} />
          <div style={{ ...S.levelIndicator, ...(cls === "low" ? S.indLow : cls === "full" ? S.indFull : S.indOk) }}>
            {label}
          </div>
        </div>

        <div style={S.panel}>
          <div style={S.panelTitle}>Motor controls</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <button style={{ ...S.ctrlBtn, ...S.ctrlStart }} onClick={() => onToggleMotor(true)}>
              <span style={{ ...S.ctrlDot, background: "#16a34a" }} /> Start motor
            </button>
            <button style={{ ...S.ctrlBtn, ...S.ctrlStop }} onClick={() => onToggleMotor(false)}>
              <span style={{ ...S.ctrlDot, background: "#dc2626" }} /> Stop motor
            </button>
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div style={S.panel}>
        <div style={S.panelTitle}>Notifications</div>
        {notifications.length === 0 ? (
          <div style={S.emptyState}>No notifications yet.</div>
        ) : (
          <div style={S.notifList}>
            {notifications.map((n, i) => (
              <div key={i} style={S.notifItem}>
                <span style={S.notifMsg}>{n.msg}</span>
                <span style={S.notifTime}>{n.time}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function TanksView({ onHome }) {
  const active   = HOSTELS.filter((h) => h.status === "active").length;
  const inactive = HOSTELS.filter((h) => h.status === "inactive").length;
  const damaged  = HOSTELS.filter((h) => h.status === "damaged").length;

  return (
    <div style={S.main}>
      <div style={S.header}>
        <button style={S.backBtn} onClick={onHome}>← Home</button>
        <h2 style={S.headerTitle}>All Tanks Overview</h2>
      </div>

      <div style={{ ...S.statRow, gridTemplateColumns: "repeat(4,1fr)" }}>
        <StatCard label="Total tanks" value={HOSTELS.length} color="#0ea5e9" />
        <StatCard label="Active"      value={active}         color="#10b981" />
        <StatCard label="Inactive"    value={inactive}       color="#f59e0b" />
        <StatCard label="Damaged"     value={damaged}        color="#ef4444" />
      </div>

      <div style={S.panel}>
        <div style={S.panelTitle}>All tanks</div>
        <div style={S.tankOverviewGrid}>
          {HOSTELS.map((h) => {
            const pill = statusPillStyle(h.status);
            return (
              <div key={h.id} style={S.tankOverviewCard}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div>
                    <div style={S.tankCardName}>{h.name}</div>
                    <div style={S.tankCardLoc}>📍 {h.location}</div>
                  </div>
                  <span style={{ ...S.pill, background: pill.bg, color: pill.color }}>
                    {h.status.charAt(0).toUpperCase() + h.status.slice(1)}
                  </span>
                </div>
                <div style={S.tankLevelRow}>
                  <span style={S.tankLevelPct}>
                    Level: {h.status === "damaged" ? "N/A" : `${h.level}%`}
                  </span>
                  <span style={S.tankNum}>Tank #{h.id}</span>
                </div>
                <div style={S.miniBarWrap}>
                  <div
                    style={{
                      ...S.miniBar,
                      width: `${h.status === "damaged" ? 0 : h.level}%`,
                      background: barColor(h.status),
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function HistoryView({ history, onHome }) {
  const starts = history.filter((x) => x.type === "start").length;
  const stops  = history.filter((x) => x.type === "stop").length;

  return (
    <div style={S.main}>
      <div style={S.header}>
        <button style={S.backBtn} onClick={onHome}>← Home</button>
        <h2 style={S.headerTitle}>System History</h2>
      </div>

      <div style={S.statRow}>
        <StatCard label="Total events"  value={history.length} color="#0ea5e9" />
        <StatCard label="Motor starts"  value={starts}         color="#10b981" />
        <StatCard label="Motor stops"   value={stops}          color="#ef4444" />
      </div>

      <div style={S.panel}>
        <div style={S.panelTitle}>Event log</div>
        {history.length === 0 ? (
          <div style={S.emptyState}>
            No events yet. Select a hostel and control the motor to see history.
          </div>
        ) : (
          <div>
            {history.map((e, i) => (
              <div key={i} style={S.historyItem}>
                <div style={S.hDotCol}>
                  <div style={{ ...S.hDot, background: dotColor(e.type) }} />
                  {i < history.length - 1 && <div style={S.hLine} />}
                </div>
                <div style={S.hContent}>
                  <div style={S.hMsg}>{e.msg}</div>
                  <div style={S.hSub}>Tank: {e.tank}</div>
                </div>
                <div style={S.hTime}>{e.time}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Main App ─────────────────────────────────────────────────────────────────
export default function AquaGuardians() {
  const [view, setView]               = useState("home");
  const [selected, setSelected]       = useState(null);
  const [tank, setTank]               = useState({ level: 60, motor: false });
  const [notifications, setNotifs]    = useState([]);
  const [history, setHistory]         = useState([]);
  const simRef                        = useRef(null);

  const addNotif = (msg) =>
    setNotifs((prev) => [{ msg, time: ts() }, ...prev].slice(0, 30));

  const addHistory = (type, msg, tankName) =>
    setHistory((prev) => [{ type, msg, tank: tankName, time: ts() }, ...prev].slice(0, 50));

  const toggleMotor = (on, reason = "Manual") => {
    setTank((prev) => ({ ...prev, motor: on }));
    const name = selected?.name || "Unknown";
    addHistory(on ? "start" : "stop", `Motor ${on ? "started" : "stopped"} — ${reason}`, name);
    addNotif(`Motor ${on ? "started" : "stopped"} (${reason})`);
  };

  // Simulation
  useEffect(() => {
    if (view !== "dashboard" || !selected) return;
    simRef.current = setInterval(() => {
      setTank((prev) => {
        let lvl = prev.level + (prev.motor ? Math.random() * 3 : -(Math.random() * 1.5));
        lvl = Math.max(0, Math.min(100, Math.round(lvl)));
        return { ...prev, level: lvl };
      });
    }, 1500);
    return () => clearInterval(simRef.current);
  }, [view, selected]);

  // Auto control
  useEffect(() => {
    if (view !== "dashboard") return;
    if (tank.level < 20 && !tank.motor) toggleMotor(true, "Auto — low level");
    if (tank.level > 85 &&  tank.motor) toggleMotor(false, "Auto — tank full");
    if (tank.motor && tank.level < 5) {
      addNotif("⚠️ Dry run detected");
      addHistory("warn", "Dry run detected", selected?.name || "");
    }
  }, [tank.level]); // eslint-disable-line

  const selectHostel = (h) => {
    clearInterval(simRef.current);
    setSelected(h);
    setTank({ level: 60, motor: false });
    setNotifs([]);
    addHistory("auto", "Dashboard opened", h.name);
    setView("dashboard");
  };

  const goHome = () => {
    clearInterval(simRef.current);
    setView("home");
    setSelected(null);
  };

  // ── Home ──
  if (view === "home") return <HomeView onSelect={selectHostel} />;

  // ── Dashboard / Tanks / History share sidebar ──
  return (
    <div style={S.dashLayout}>
      <Sidebar view={view} setView={setView} hasSelected={!!selected} />

      {view === "dashboard" && (
        <DashboardView
          hostel={selected}
          tank={tank}
          onToggleMotor={toggleMotor}
          notifications={notifications}
          onHome={goHome}
        />
      )}
      {view === "tanks" && <TanksView onHome={goHome} />}
      {view === "history" && <HistoryView history={history} onHome={goHome} />}
    </div>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const S = {
  // Layout
  home: {
    minHeight: "100vh",
    background: "#0f172a",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "2rem",
  },
  homeTitle: { fontSize: "2rem", fontWeight: 500, color: "#38bdf8", letterSpacing: "-0.5px" },
  homeSub:   { fontSize: 14, color: "#64748b", marginTop: 6, marginBottom: 25 },
  hostelGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: 16,
    width: "100%",
    maxWidth: 1000,
  },
  hostelCard: {
    background: "rgba(255,255,255,0.06)",
    border: "0.5px solid rgba(255,255,255,0.1)",
    borderRadius: 12,
    padding: "18px 14px",
    cursor: "pointer",
    textAlign: "center",
    transition: "all 0.2s",
  },
  hostelCardName: { fontSize: 15, fontWeight: 500, color: "#e2e8f0" },
  hostelCardLoc:  { fontSize: 15, color: "#64748b", marginTop: 10 },

  dashLayout: { display: "flex", minHeight: "150vh" },

  sidebar: {
    width: 200,
    background: "#0f172a",
    padding: "20px 14px",
    display: "flex",
    flexDirection: "column",
    gap: 2,
    flexShrink: 0,
  },
  sidebarLogo: {
    fontSize: 16,
    fontWeight: 500,
    color: "#38bdf8",
    marginBottom: 20,
    paddingBottom: 14,
    borderBottom: "0.5px solid rgba(255,255,255,0.08)",
  },
  sidebarItem: {
    fontSize: 16,
    color: "#64748b",
    padding: "9px 10px",
    borderRadius: 8,
    cursor: "pointer",
  },
  sidebarItemActive: { background: "rgba(56,189,248,0.14)", color: "#38bdf8" },

  main: {
    flex: 1,
    background: "#f8fafc",
    padding: "20px 24px",
    overflowY: "auto",
    minWidth: 0,
  },
  header: { display: "flex", alignItems: "center", gap: 12, marginBottom: 18 },
  headerTitle: { fontSize: 18, fontWeight: 500, color: "#0f172a", flex: 1 },
  backBtn: {
    background: "none",
    border: "0.5px solid #cbd5e1",
    borderRadius: 8,
    padding: "6px 12px",
    fontSize: 18,
    color: "#64748b",
    cursor: "pointer",
  },
  motorBadge: { fontSize: 15, padding: "4px 10px", borderRadius: 99, fontWeight: 600 },
  motorOn:  { background: "#dcfce7", color: "#166534" },
  motorOff: { background: "#fee2e2", color: "#991b1b" },

  // Stats
  statRow: { display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10, marginBottom: 14 },
  statCard: {
    background: "#fff",
    border: "0.5px solid #e2e8f0",
    borderRadius: 12,
    padding: "14px 16px",
  },
  statLabel: { fontSize: 11, color: "#64748b", marginBottom: 5, textTransform: "uppercase", letterSpacing: "0.4px" },
  statValue: { fontSize: 22, fontWeight: 500 },

  // Panels / Grid
  grid2: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 },
  panel: {
    background: "#fff",
    border: "0.5px solid #e2e8f0",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  panelTitle: { fontSize: 13, fontWeight: 500, color: "#0f172a", marginBottom: 12 },

  // Tank visual
  tankWrap: { display: "flex", flexDirection: "column", alignItems: "center", gap: 10 },
  tankOuter: {
    width: 80,
    height: 180,
    border: "2px solid #94a3b8",
    borderRadius: 10,
    overflow: "hidden",
    background: "#f1f5f9",
    position: "relative",
  },
  tankWater: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    background: "linear-gradient(to top, #0284c7, #38bdf8)",
    transition: "height 1.2s ease",
  },
  tankShimmer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "100%",
    background: "linear-gradient(120deg,rgba(255,255,255,0) 40%,rgba(255,255,255,0.22) 50%,rgba(255,255,255,0) 60%)",
  },
  tankPct: { fontSize: 13, fontWeight: 500, color: "#0f172a" },
  tankBarWrap: { width: "100%", background: "#e2e8f0", borderRadius: 99, height: 5, overflow: "hidden" },
  tankBar: { height: 5, borderRadius: 99, background: "#0ea5e9", transition: "width 1.2s ease" },

  levelIndicator: { marginTop: 10, padding: "8px 12px", borderRadius: 8, fontSize: 12, fontWeight: 500 },
  indLow:  { background: "#fef3c7", color: "#92400e" },
  indOk:   { background: "#dcfce7", color: "#166534" },
  indFull: { background: "#dbeafe", color: "#1e40af" },

  // Controls
  ctrlBtn: {
    border: "none",
    borderRadius: 8,
    padding: "10px 14px",
    fontSize: 13,
    fontWeight: 500,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: 8,
  },
  ctrlStart: { background: "#dcfce7", color: "#166534" },
  ctrlStop:  { background: "#fee2e2", color: "#991b1b" },
  ctrlDot: { width: 8, height: 8, borderRadius: "50%", flexShrink: 0 },

  // Notifications
  notifList: { display: "flex", flexDirection: "column", gap: 6, maxHeight: 200, overflowY: "auto" },
  notifItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    fontSize: 15,
    padding: "7px 10px",
    borderRadius: 8,
    background: "#f8fafc",
    border: "0.5px solid #e2e8f0",
  },
  notifMsg:  { color: "#0f172a" },
  notifTime: { color: "#64748b", fontSize: 11, flexShrink: 0, marginLeft: 8 },
  emptyState: { fontSize: 13, color: "#94a3b8", textAlign: "center", padding: "20px 0" },

  // Tanks overview
  tankOverviewGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 },
  tankOverviewCard: {
    background: "#f8fafc",
    border: "0.5px solid #e2e8f0",
    borderRadius: 10,
    padding: "12px 14px",
  },
  tankCardName: { fontSize: 13, fontWeight: 500, color: "#0f172a", marginBottom: 2 },
  tankCardLoc:  { fontSize: 11, color: "#64748b", marginBottom: 8 },
  pill: { fontSize: 11, fontWeight: 500, padding: "3px 8px", borderRadius: 99 },
  tankLevelRow: { display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 6 },
  tankLevelPct: { fontSize: 12, color: "#64748b" },
  tankNum:      { fontSize: 11, color: "#94a3b8" },
  miniBarWrap:  { width: "100%", background: "#e2e8f0", borderRadius: 99, height: 4, marginTop: 6, overflow: "hidden" },
  miniBar:      { height: 4, borderRadius: 99, transition: "width 0.8s ease" },

  // History
  historyItem: { display: "flex", gap: 14, alignItems: "flex-start", padding: "12px 0", borderBottom: "0.5px solid #e2e8f0" },
  hDotCol:  { display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 3 },
  hDot:     { width: 10, height: 10, borderRadius: "50%", flexShrink: 0 },
  hLine:    { width: 1, background: "#e2e8f0", flex: 1, marginTop: 4, minHeight: 20 },
  hContent: { flex: 1 },
  hMsg:     { fontSize: 13, color: "#0f172a", fontWeight: 500 },
  hSub:     { fontSize: 11, color: "#64748b", marginTop: 2 },
  hTime:    { fontSize: 11, color: "#64748b", flexShrink: 0, paddingTop: 3 },
};

