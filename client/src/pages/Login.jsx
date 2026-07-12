import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LifeBuoy } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import heroImage from "../assets/hero.png";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-illustration">
        <div style={{ maxWidth: 340 }}>
          <img src={heroImage} alt="Support agent helping a customer" className="illustration-img" />
        </div>
      </div>
      <div className="auth-form-side">
        <div className="auth-box">
          <div className="auth-brand">
            <LifeBuoy />
            <strong>Customer Care Registry</strong>
          </div>
          <h1>Welcome back</h1>
          <p className="subtitle">Log in to manage complaints and support tickets.</p>

          <form onSubmit={handleSubmit}>
            <div className="field">
              <label>Email</label>
              <input type="email" name="email" value={form.email} onChange={handleChange} required />
            </div>
            <div className="field">
              <label>Password</label>
              <input type="password" name="password" value={form.password} onChange={handleChange} required />
            </div>

            {error && <p className="error-text">{error}</p>}

            <button className="btn btn-primary" type="submit" disabled={loading} style={{ width: "100%", justifyContent: "center" }}>
              {loading ? "Logging in..." : "Log In"}
            </button>
          </form>

          <p style={{ marginTop: 16, fontSize: 14 }}>
            Don't have an account? <Link to="/register">Register</Link>
          </p>
        </div>
      </div>
    </div>
  );
}