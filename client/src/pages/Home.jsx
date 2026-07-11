import { Link, Navigate } from "react-router-dom";
import { LifeBuoy, Lock, Zap, ShieldCheck, Bell, Star, ArrowRight } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import heroImage from "../assets/hero.png";

const FEATURES = [
  {
    icon: Lock,
    title: "Encrypted messages",
    description: "Every conversation between you and a support agent travels over an encrypted connection, so your details stay private end to end.",
  },
  {
    icon: Zap,
    title: "Quick resolution",
    description: "Complaints route straight to the right agent and status updates land instantly, so issues get resolved in hours, not days.",
  },
  {
    icon: ShieldCheck,
    title: "Role-based access",
    description: "Customers, agents, and admins each see only what they need to, keeping sensitive complaint data locked down by role.",
  },
  {
    icon: Bell,
    title: "Real-time notifications",
    description: "Get notified the moment your complaint is assigned, updated, or resolved — no need to keep refreshing the page.",
  },
];

export default function Home() {
  const { user } = useAuth();
  if (user) return <Navigate to="/dashboard" replace />;

  return (
    <div>
      <header className="home-nav">
        <div className="brand">
          <LifeBuoy size={22} />
          Customer Care Registry
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <Link to="/login" className="btn btn-outline">Login</Link>
          <Link to="/register" className="btn btn-primary">Get Started</Link>
        </div>
      </header>

      <section className="hero-section">
        <div className="hero-copy">
          <h1>Support tickets, resolved fast — and kept private.</h1>
          <p className="subtext" style={{ fontSize: 16 }}>
            Customer Care Registry gives your team one secure place to log complaints, chat with agents, and track every ticket from open to resolved.
          </p>
          <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
            <Link to="/register" className="btn btn-primary">
              Get Started <ArrowRight size={16} />
            </Link>
            <Link to="/login" className="btn btn-outline">Login</Link>
          </div>
        </div>
        <div className="hero-image">
          <img src={heroImage} alt="Support agent helping a customer" className="illustration-img" />
        </div>
      </section>

      <section className="container">
        <h2 style={{ textAlign: "center", marginBottom: 8 }}>Built around security and speed</h2>
        <p className="subtext" style={{ textAlign: "center", marginBottom: 32 }}>
          The essentials every support desk needs, without the overhead.
        </p>
        <div className="feature-grid">
          {FEATURES.map(({ icon: Icon, title, description }) => (
            <div key={title} className="card feature-card">
              <div className="feature-icon"><Icon size={20} /></div>
              <h3 style={{ margin: "12px 0 6px" }}>{title}</h3>
              <p className="subtext" style={{ margin: 0 }}>{description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container">
        <div className="card cta-card">
          <Star size={22} color="var(--warning)" fill="var(--warning)" />
          <h2 style={{ margin: "10px 0 6px" }}>Ready to raise your first ticket?</h2>
          <p className="subtext" style={{ marginBottom: 20 }}>
            Create a free account and get matched with a support agent in minutes.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
            <Link to="/register" className="btn btn-primary">Get Started</Link>
            <Link to="/login" className="btn btn-outline">Login</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
