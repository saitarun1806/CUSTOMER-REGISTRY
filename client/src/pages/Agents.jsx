import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserPlus, Star, ChevronRight } from "lucide-react";
import api from "../api/axios";

export default function Agents() {
  const navigate = useNavigate();
  const [agents, setAgents] = useState([]);
  const [form, setForm] = useState({ fullName: "", email: "", password: "", phone: "", address: "" });
  const [ratings, setRatings] = useState({});
  const [error, setError] = useState("");

  const loadAgents = async () => {
    const res = await api.get("/v1/api/auth/agents");
    setAgents(res.data.agents);

    const entries = await Promise.all(
      res.data.agents.map(async (a) => {
        try {
          const fb = await api.get(`/api/feedback/agent/${a._id}`);
          return [a._id, fb.data];
        } catch {
          return [a._id, { averageRating: 0, totalReviews: 0 }];
        }
      })
    );
    setRatings(Object.fromEntries(entries));
  };

  useEffect(() => { loadAgents(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await api.post("/v1/api/auth/agent", form);
      setForm({ fullName: "", email: "", password: "", phone: "", address: "" });
      loadAgents();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create agent");
    }
  };

  return (
    <div className="container">
      <h1 style={{ marginBottom: 20 }}>Support Agents</h1>

      <form onSubmit={handleCreate} className="card" style={{ marginBottom: 24 }}>
        <h3 style={{ marginBottom: 12 }}><UserPlus size={16} style={{ verticalAlign: "middle" }} /> Add New Agent</h3>
        <div className="field">
          <label>Full Name</label>
          <input value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} required />
        </div>
        <div className="field">
          <label>Email</label>
          <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
        </div>
        <div className="field">
          <label>Password</label>
          <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
        </div>
        {error && <p className="error-text">{error}</p>}
        <button className="btn btn-primary" type="submit">Create Agent</button>
      </form>

      {agents.map((a) => (
        <div key={a._id} className="card complaint-card-wrap">
          <div className="complaint-card" onClick={() => navigate(`/agents/${a._id}`)}>
            <div>
              <div className="complaint-title">{a.fullName}</div>
              <div className="complaint-meta">{a.email}</div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 4, color: "var(--warning)" }}>
                <Star size={14} color="currentColor" fill="currentColor" />
                <span style={{ color: "var(--text)" }}>
                  {ratings[a._id]?.averageRating || 0} ({ratings[a._id]?.totalReviews || 0} reviews)
                </span>
              </div>
              <ChevronRight size={16} className="text-muted" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
