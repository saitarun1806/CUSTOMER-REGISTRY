import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { Send, Star, Flame } from "lucide-react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

export default function ComplaintDetail() {
  const { id } = useParams();
  const { user } = useAuth();

  const [complaint, setComplaint] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [feedbackForm, setFeedbackForm] = useState({ rating: 5, comments: "" });
  const [loading, setLoading] = useState(true);
  const [escalationReason, setEscalationReason] = useState("");
  const [escalating, setEscalating] = useState(false);

  const messagesEndRef = useRef(null);

  const loadComplaint = async () => {
    const res = await api.get("/api/complaints");
    const found = res.data.find((c) => c._id === id);
    setComplaint(found || null);
  };

  const loadMessages = async () => {
    const res = await api.get(`/api/messages/${id}`);
    setMessages(res.data);
  };

  const loadFeedback = async () => {
    try {
      const res = await api.get(`/api/feedback/${id}`);
      setFeedback(res.data);
    } catch {
      setFeedback(null);
    }
  };

  useEffect(() => {
    (async () => {
      setLoading(true);
      await Promise.all([loadComplaint(), loadMessages(), loadFeedback()]);
      setLoading(false);
    })();
  }, [id]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      loadMessages();
      loadComplaint();
    }, 4000);
    return () => clearInterval(intervalId);
  }, [id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    await api.post(`/api/messages/${id}`, { text: newMessage });
    setNewMessage("");
    loadMessages();
  };

  const handleEscalate = async (e) => {
    e.preventDefault();
    setEscalating(true);
    try {
      await api.put(`/api/complaints/${id}/escalate`, { reason: escalationReason });
      setEscalationReason("");
      loadComplaint();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to escalate complaint");
    } finally {
      setEscalating(false);
    }
  };

  const handleStatusChange = async (status) => {
    await api.put(`/api/complaints/${id}/status`, { status });
    loadComplaint();
  };

  const handleSubmitFeedback = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/api/feedback/${id}`, feedbackForm);
      loadFeedback();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to submit feedback");
    }
  };

  if (loading) return <div className="container">Loading...</div>;
  if (!complaint) return <div className="container">Complaint not found.</div>;

  const canResolve = complaint.status !== "Resolved" && complaint.status !== "Closed";
  const isMine = (senderId) => senderId === user._id || senderId?._id === user._id;
  const isClosed = complaint.status === "Closed";

  return (
    <div className="container">
      <div className="card" style={{ marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
          <h2 style={{ margin: 0 }}>{complaint.title}</h2>
          {complaint.isEscalated && (
            <span className="badge badge-escalated">
              <Flame size={12} /> Escalated
            </span>
          )}
        </div>
        <p className="subtext">
          {complaint.type} · Status: {complaint.status}
          {complaint.assignedAgent?.fullName && ` · Agent: ${complaint.assignedAgent.fullName}`}
        </p>
        <p>{complaint.description}</p>
        {complaint.isEscalated && complaint.escalationReason && (
          <p className="subtext">Escalation reason: {complaint.escalationReason}</p>
        )}

        {(user.role === "agent" || user.role === "admin") && (
          <div style={{ display: "flex", gap: 8, marginTop: 16, flexWrap: "wrap" }}>
            {["Open", "In Progress", "Resolved", "Closed"].map((s) => (
              <button
                key={s}
                className="btn btn-outline"
                disabled={complaint.status === s}
                onClick={() => handleStatusChange(s)}
              >
                {s}
              </button>
            ))}
          </div>
        )}

        {(user.role === "agent" || user.role === "admin") && !complaint.isEscalated && complaint.status !== "Closed" && (
          <form onSubmit={handleEscalate} style={{ display: "flex", gap: 8, marginTop: 12 }}>
            <input
              className="message-input"
              placeholder="Reason for escalation (optional)"
              value={escalationReason}
              onChange={(e) => setEscalationReason(e.target.value)}
            />
            <button className="btn btn-danger" type="submit" disabled={escalating}>
              <Flame size={14} /> {escalating ? "Escalating..." : "Escalate"}
            </button>
          </form>
        )}
      </div>

      <div className="card" style={{ marginBottom: 20 }}>
        <h3 style={{ marginBottom: 12 }}>Messages</h3>
        <div className="messages-list">
          {messages.length === 0 && <p className="text-muted">No messages yet.</p>}
          {messages.map((m) => (
            <div key={m._id} className={`message-bubble ${isMine(m.sender) ? "message-mine" : "message-theirs"}`}>
              <div className="message-sender">{m.sender?.fullName || "User"}</div>
              {m.content}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        {isClosed ? (
          <p className="text-muted" style={{ marginTop: 8 }}>
            This complaint is closed. Chat is disabled.
          </p>
        ) : (
          <form onSubmit={handleSendMessage} style={{ display: "flex", gap: 8 }}>
            <input
              className="message-input"
              placeholder="Type a message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
            />
            <button className="btn btn-primary" type="submit"><Send size={16} /></button>
          </form>
        )}
      </div>

      {user.role === "customer" && !canResolve && (
        <div className="card">
          <h3 style={{ marginBottom: 12 }}>
            <Star size={16} style={{ verticalAlign: "middle" }} /> Feedback
          </h3>
          {feedback ? (
            <p>You rated this {feedback.rating}/5 — "{feedback.comments}"</p>
          ) : (
            <form onSubmit={handleSubmitFeedback}>
              <div className="field">
                <label>Rating (1-5)</label>
                <input
                  type="number"
                  min={1}
                  max={5}
                  value={feedbackForm.rating}
                  onChange={(e) => setFeedbackForm({ ...feedbackForm, rating: Number(e.target.value) })}
                />
              </div>
              <div className="field">
                <label>Comments</label>
                <textarea
                  rows={3}
                  value={feedbackForm.comments}
                  onChange={(e) => setFeedbackForm({ ...feedbackForm, comments: e.target.value })}
                />
              </div>
              <button className="btn btn-primary" type="submit">Submit Feedback</button>
            </form>
          )}
        </div>
      )}

      {(user.role === "agent" || user.role === "admin") && isClosed && (
        <div className="card">
          <h3 style={{ marginBottom: 12 }}>
            <Star size={16} style={{ verticalAlign: "middle" }} /> Customer Feedback
          </h3>
          {feedback ? (
            <p>
              Customer rated this {feedback.rating}/5
              {feedback.comments && ` — "${feedback.comments}"`}
            </p>
          ) : (
            <p className="text-muted">No feedback submitted by the customer yet.</p>
          )}
        </div>
      )}
    </div>
  );
}