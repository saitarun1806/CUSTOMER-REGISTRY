import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Star, BarChart3 } from "lucide-react";
import api from "../api/axios";

export default function FeedbackAnalytics() {
  const navigate = useNavigate();
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get("/api/feedback/");
        setFeedbacks(res.data || []);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load feedback analytics");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const stats = useMemo(() => {
    const total = feedbacks.length;
    const avg = total ? feedbacks.reduce((sum, f) => sum + f.rating, 0) / total : 0;

    const distribution = [5, 4, 3, 2, 1].map((star) => ({
      star,
      count: feedbacks.filter((f) => f.rating === star).length,
    }));

    const byAgent = {};
    feedbacks.forEach((f) => {
      const key = f.agent?._id || "unassigned";
      if (!byAgent[key]) {
        byAgent[key] = { name: f.agent?.fullName || "Unassigned", total: 0, sum: 0 };
      }
      byAgent[key].total += 1;
      byAgent[key].sum += f.rating;
    });
    const agentLeaderboard = Object.values(byAgent)
      .map((a) => ({ ...a, average: (a.sum / a.total).toFixed(1) }))
      .sort((a, b) => b.average - a.average);

    return { total, avg, distribution, agentLeaderboard };
  }, [feedbacks]);

  if (loading) return <div className="container">Loading...</div>;

  return (
    <div className="container">
      <h1 style={{ marginBottom: 20 }}>
        <BarChart3 size={22} style={{ verticalAlign: "middle", marginRight: 8 }} />
        Customer Feedback Analytics
      </h1>

      {error && <p className="error-text">{error}</p>}

      <div className="stats-grid">
        <div className="card stat-card">
          <div className="stat-number">{stats.total}</div>
          <div className="stat-label">Total Feedback</div>
        </div>
        <div className="card stat-card">
          <div className="stat-number">{stats.avg.toFixed(1)}</div>
          <div className="stat-label">Average Rating</div>
        </div>
        <div className="card stat-card">
          <div className="stat-number">{stats.agentLeaderboard.length}</div>
          <div className="stat-label">Rated Agents</div>
        </div>
      </div>

      <div className="card" style={{ marginBottom: 20 }}>
        <h3 style={{ marginBottom: 12 }}>Rating Distribution</h3>
        {stats.total === 0 && <p className="text-muted">No feedback submitted yet.</p>}
        {stats.distribution.map(({ star, count }) => {
          const pct = stats.total ? Math.round((count / stats.total) * 100) : 0;
          return (
            <div key={star} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
              <span style={{ width: 46, display: "flex", alignItems: "center", gap: 4 }}>
                {star} <Star size={12} fill="currentColor" style={{ color: "var(--warning)" }} />
              </span>
              <div style={{ flex: 1, background: "var(--surface-alt)", borderRadius: 999, height: 10, overflow: "hidden" }}>
                <div
                  style={{
                    width: `${pct}%`,
                    height: "100%",
                    background: "linear-gradient(135deg, var(--primary), var(--primary-light))",
                  }}
                />
              </div>
              <span className="text-muted" style={{ width: 60, textAlign: "right" }}>
                {count} ({pct}%)
              </span>
            </div>
          );
        })}
      </div>

      <div className="card" style={{ marginBottom: 20 }}>
        <h3 style={{ marginBottom: 12 }}>Agent Leaderboard</h3>
        {stats.agentLeaderboard.length === 0 && <p className="text-muted">No agent ratings yet.</p>}
        {stats.agentLeaderboard.map((a) => (
          <div
            key={a.name}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "10px 0",
              borderBottom: "1px solid var(--border)",
            }}
          >
            <span>{a.name}</span>
            <span style={{ display: "flex", alignItems: "center", gap: 4, color: "var(--warning)" }}>
              <Star size={14} fill="currentColor" />
              <span style={{ color: "var(--text)" }}>{a.average} ({a.total} reviews)</span>
            </span>
          </div>
        ))}
      </div>

      <div className="card">
        <h3 style={{ marginBottom: 12 }}>Recent Feedback</h3>
        {feedbacks.length === 0 && <p className="text-muted">Nothing to show yet.</p>}
        {feedbacks
          .slice()
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 15)
          .map((f) => (
            <div
              key={f._id}
              className="complaint-card-wrap card"
              style={{ marginBottom: 10, cursor: f.complaintId?._id ? "pointer" : "default" }}
              onClick={() => f.complaintId?._id && navigate(`/complaints/${f.complaintId._id}`)}
            >
              <div style={{ padding: 14 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <strong>{f.complaintId?.title || "Complaint"}</strong>
                  <span style={{ display: "flex", alignItems: "center", gap: 4, color: "var(--warning)" }}>
                    <Star size={13} fill="currentColor" /> {f.rating}/5
                  </span>
                </div>
                <p className="text-muted" style={{ margin: "4px 0 0" }}>
                  {f.customer?.fullName || "Customer"} → {f.agent?.fullName || "Unassigned"}
                </p>
                {f.comments && <p style={{ margin: "6px 0 0" }}>"{f.comments}"</p>}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
