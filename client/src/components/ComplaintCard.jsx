import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Flame } from "lucide-react";

const statusClass = {
  Open: "badge-open",
  "In Progress": "badge-progress",
  Resolved: "badge-resolved",
  Closed: "badge-closed",
};

export default function ComplaintCard({ complaint, agents, onAssign }) {
  const navigate = useNavigate();
  const [selectedAgent, setSelectedAgent] = useState("");
  const [assigning, setAssigning] = useState(false);

  const handleAssignClick = async (e) => {
    e.stopPropagation();
    if (!selectedAgent) return;
    setAssigning(true);
    try {
      await onAssign(complaint._id, selectedAgent);
      setSelectedAgent("");
    } finally {
      setAssigning(false);
    }
  };

  return (
    <div className="card complaint-card-wrap">
      <div className="complaint-card" onClick={() => navigate(`/complaints/${complaint._id}`)}>
        <div>
          <div className="complaint-title">
            {complaint.title}
            {complaint.isEscalated && (
              <span className="badge badge-escalated" title={complaint.escalationReason || "Escalated"}>
                <Flame size={12} /> Escalated
              </span>
            )}
          </div>
          <div className="complaint-meta">
            {complaint.type} · {new Date(complaint.createdAt).toLocaleDateString()}
            {complaint.customer?.fullName && ` · ${complaint.customer.fullName}`}
            {complaint.assignedAgent?.fullName && ` · Agent: ${complaint.assignedAgent.fullName}`}
          </div>
        </div>
        <span className={`badge ${statusClass[complaint.status] || "badge-open"}`}>
          {complaint.status}
        </span>
      </div>

      {agents && complaint.status !== "Closed" && (
        <div className="card-assign-row" onClick={(e) => e.stopPropagation()}>
          <select value={selectedAgent} onChange={(e) => setSelectedAgent(e.target.value)}>
            <option value="">
              {complaint.assignedAgent?.fullName ? `Reassign agent...` : "Assign agent..."}
            </option>
            {agents.map((a) => (
              <option key={a._id} value={a._id}>{a.fullName}</option>
            ))}
          </select>
          <button className="btn btn-outline" disabled={!selectedAgent || assigning} onClick={handleAssignClick}>
            {assigning ? "Assigning..." : "Assign"}
          </button>
        </div>
      )}
    </div>
  );
}
