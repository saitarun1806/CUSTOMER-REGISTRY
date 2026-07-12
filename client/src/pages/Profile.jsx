import { useState } from "react";
import { UserCircle } from "lucide-react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

export default function Profile() {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({
    fullName: user.fullName || "",
    phone: user.phone || "",
    address: user.address || "",
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");
    setError("");
    try {
      const res = await api.put("/v1/api/auth/profile", form);
      updateUser(res.data);
      setMessage("Profile updated successfully.");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: 480 }}>
      <h1 style={{ marginBottom: 20 }}>
        <UserCircle size={22} style={{ verticalAlign: "middle", marginRight: 8 }} />
        My Profile
      </h1>

      <div className="card">
        <p className="text-muted" style={{ marginBottom: 16 }}>{user.email} · {user.role}</p>

        {message && <p style={{ color: "var(--success)" }}>{message}</p>}
        {error && <p className="error-text">{error}</p>}

        <form onSubmit={handleSubmit}>
          <div className="field">
            <label>Full Name</label>
            <input name="fullName" value={form.fullName} onChange={handleChange} />
          </div>
          <div className="field">
            <label>Phone</label>
            <input name="phone" value={form.phone} onChange={handleChange} placeholder="Add a phone number" />
          </div>
          <div className="field">
            <label>Address</label>
            <textarea
              name="address"
              rows={3}
              value={form.address}
              onChange={handleChange}
              placeholder="Add an address"
            />
          </div>
          <button className="btn btn-primary" type="submit" disabled={saving}>
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
}
