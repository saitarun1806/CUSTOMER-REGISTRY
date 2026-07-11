import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LifeBuoy } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { SupportIllustration } from "../components/Illustrations";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: "", email: "", password: "", phone: "", address: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await register(form);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-illustration">
        <div style={{ maxWidth: 340 }}>
          <SupportIllustration />
        </div>
      </div>
      <div className="auth-form-side">
        <div className="auth-box">
          <div className="auth-brand">
            <LifeBuoy />
            <strong>Customer Care Registry</strong>
          </div>
          <h1>Create your account</h1>
          <p className="subtitle">Register to raise and track support complaints.</p>

          <form onSubmit={handleSubmit}>
            <div className="field">
              <label>Full Name</label>
              <input name="fullName" value={form.fullName} onChange={handleChange} required />
            </div>
            <div className="field">
              <label>Email</label>
              <input type="email" name="email" value={form.email} onChange={handleChange} required />
            </div>
            <div className="field">
              <label>Password</label>
              <input type="password" name="password" value={form.password} onChange={handleChange} required />
            </div>
            <div className="field">
              <label>Phone (optional)</label>
              <input name="phone" value={form.phone} onChange={handleChange} />
            </div>
            <div className="field">
              <label>Address (optional)</label>
              <input name="address" value={form.address} onChange={handleChange} />
            </div>

            {error && <p className="error-text">{error}</p>}

            <button className="btn btn-primary" type="submit" disabled={loading} style={{ width: "100%", justifyContent: "center" }}>
              {loading ? "Creating account..." : "Register"}
            </button>
          </form>

          <p style={{ marginTop: 16, fontSize: 14 }}>
            Already have an account? <Link to="/login">Log In</Link>
          </p>
        </div>
      </div>
    </div>
  );
}