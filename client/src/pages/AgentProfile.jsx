import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Star } from "lucide-react";
import api from "../api/axios";

export default function AgentProfile() {
  const { id } = useParams();
  const [agent, setAgent] = useState(null);
  const [summary, setSummary] = useState({ totalReviews: 0, averageRating: 0, feedbacks: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const [agentsRes, feedbackRes] = await Promise.all([
          api.get("/v1/api/auth/agents"),
          api.get(`/api/feedback/agent/${id}`),
        ]);
        setAgent(agentsRes.data.agents.find((a) => a._id === id) || null);
        setSummary(feedbackRes.data);
      } catch (err) {
        console.error("Failed to load agent profile", err);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) return <div className="container">Loading...</div>;
  if (!agent) return <div className="container">Agent not found.</div>;

  return (
    <div className="container">
      <Link to="/agents" style={{ display: "inline-flex", alignItems: "center", gap: 6, marginBottom: 16, fontSize: 14 }}>
        <ArrowLeft size={16} /> Back to Agents
      </Link>

      <div className="card" style={{ marginBottom: 20 }}>
        <h2 style={{ marginBottom: 4 }}>{agent.fullName}</h2>
        <p className="subtext">{agent.email}{agent.phone && ` · ${agent.phone}`}</p>
        <div style={{ display: "flex", alignItems: "center", gap: 6, color: "var(--warning)" }}>
          <Star size={18} color="currentColor" fill="currentColor" />
          <span style={{ color: "var(--text)", fontWeight: 600 }}>{summary.averageRating || 0} / 5</span>
          <span className="text-muted">({summary.totalReviews || 0} reviews)</span>
        </div>
      </div>

      <h3 style={{ marginBottom: 12 }}>All Reviews</h3>
      {(!summary.feedbacks || summary.feedbacks.length === 0) ? (
        <div className="empty-state">
          <p>No reviews yet.</p>
        </div>
      ) : (
        summary.feedbacks.map((f) => (
          <div key={f._id} className="card" style={{ marginBottom: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
              <div>
                <div style={{ fontWeight: 600 }}>{f.customer?.fullName || "Customer"}</div>
                <div className="complaint-meta">
                  {f.complaintId?.title} · {new Date(f.createdAt).toLocaleDateString()}
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 4, color: "var(--warning)" }}>
                <Star size={14} color="currentColor" fill="currentColor" />
                <span style={{ color: "var(--text)" }}>{f.rating}/5</span>
              </div>
            </div>
            {f.comments && <p style={{ margin: 0 }}>{f.comments}</p>}
          </div>
        ))
      )}
    </div>
  );
}
