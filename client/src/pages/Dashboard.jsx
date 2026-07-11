import { useEffect, useState } from "react";
import { PlusCircle } from "lucide-react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import ComplaintCard from "../components/ComplaintCard";
import { EmptyStateIllustration } from "../components/Illustrations";

const COMPLAINT_TYPES = ["Complaint", "Inquiry", "Billing", "Technical", "General", "Other"];

export default function Dashboard() {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", type: "General", description: "" });
  const [statusFilter, setStatusFilter] = useState("");

  const fetchAgents = async () => {
    if (user.role !== "admin") return;
    try {
      const res = await api.get("/v1/api/auth/agents");
      setAgents(res.data.agents);
    } catch (err) {
      console.error("Failed to fetch agents", err);
    }
  };

  const fetchComplaints = async () => {
    try {
      const url = user.role === "admin" && statusFilter
        ? `/api/complaints/status/${statusFilter}`
        : "/api/complaints";
      const res = await api.get(url);
      setComplaints(res.data.complaints || res.data);
    } catch (err) {
      console.error("Failed to fetch complaints", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAgents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setLoading(true);
    fetchComplaints();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter]);

  useEffect(() => {
    const intervalId = setInterval(fetchComplaints, 6000);
    return () => clearInterval(intervalId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter]);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await api.post("/api/complaints", form);
      setForm({ title: "", type: "General", description: "" });
      setShowForm(false);
      fetchComplaints();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to create complaint");
    }
  };

  const handleAssign = async (complaintId, agentId) => {
    try {
      await api.put(`/api/complaints/${complaintId}/assign`, { agentId });
      fetchComplaints();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to assign agent");
    }
  };

  const stats = {
    total: complaints.length,
    open: complaints.filter((c) => c.status === "Open").length,
    inProgress: complaints.filter((c) => c.status === "In Progress").length,
    resolved: complaints.filter((c) => c.status === "Resolved" || c.status === "Closed").length,
  };

  return (
    <div className="container">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <h1>
          {user.role === "customer" && "My Complaints"}
          {user.role === "agent" && "Assigned Complaints"}
          {user.role === "admin" && "All Complaints"}
        </h1>

        {user.role === "customer" && (
          <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
            <PlusCircle size={16} /> New Complaint
          </button>
        )}
      </div>

      <div className="stats-grid">
        <div className="card stat-card">
          <div className="stat-number">{stats.total}</div>
          <div className="stat-label">Total</div>
        </div>
        <div className="card stat-card">
          <div className="stat-number">{stats.open}</div>
          <div className="stat-label">Open</div>
        </div>
        <div className="card stat-card">
          <div className="stat-number">{stats.inProgress}</div>
          <div className="stat-label">In Progress</div>
        </div>
        <div className="card stat-card">
          <div className="stat-number">{stats.resolved}</div>
          <div className="stat-label">Resolved / Closed</div>
        </div>
      </div>

      {user.role === "admin" && (
        <div className="field" style={{ maxWidth: 220, marginBottom: 20 }}>
          <label>Filter by status</label>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="">All</option>
            <option value="Open">Open</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
            <option value="Closed">Closed</option>
          </select>
        </div>
      )}

      {showForm && (
        <form onSubmit={handleCreate} className="card" style={{ marginBottom: 24 }}>
          <div className="field">
            <label>Title</label>
            <input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
            />
          </div>
          <div className="field">
            <label>Type</label>
            <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
              {COMPLAINT_TYPES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
          <div className="field">
            <label>Description</label>
            <textarea
              rows={4}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              required
            />
          </div>
          <button className="btn btn-primary" type="submit">Submit Complaint</button>
        </form>
      )}

      {loading ? (
        <p>Loading...</p>
      ) : complaints.length === 0 ? (
        <div className="empty-state">
          <EmptyStateIllustration />
          <p>No complaints to show yet.</p>
        </div>
      ) : (
        complaints.map((c) => (
          <ComplaintCard
            key={c._id}
            complaint={c}
            agents={user.role === "admin" ? agents : null}
            onAssign={handleAssign}
          />
        ))
      )}
    </div>
  );
}
