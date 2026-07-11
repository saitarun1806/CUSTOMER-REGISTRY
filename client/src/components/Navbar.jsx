import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { LifeBuoy, LayoutDashboard, Bell, Users, LogOut, BarChart3 } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";

export default function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!user) return;

    const fetchUnread = async () => {
      try {
        const res = await api.get("/api/notifications");
        setUnreadCount(res.data.filter((n) => !n.isRead).length);
      } catch (err) {
        console.error("Failed to fetch unread count", err);
      }
    };

    fetchUnread();
    const intervalId = setInterval(fetchUnread, 5000);
    return () => clearInterval(intervalId);
  }, [user]);

  if (!user) return null;

  const isActive = (path) => (location.pathname === path ? "active" : "");

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="navbar">
      <div className="brand">
        <LifeBuoy size={22} />
        Customer Care Registry
      </div>
      <nav>
        <Link to="/dashboard" className={isActive("/dashboard")}>
          <LayoutDashboard size={16} /> Dashboard
        </Link>

        <Link to="/notifications" className={isActive("/notifications")} style={{ position: "relative" }}>
          <Bell size={16} /> Notifications
          {unreadCount > 0 && <span className="notif-count">{unreadCount}</span>}
        </Link>

        {user.role === "admin" && (
          <Link to="/agents" className={isActive("/agents")}>
            <Users size={16} /> Agents
          </Link>
        )}

        {user.role === "admin" && (
          <Link to="/analytics" className={isActive("/analytics")}>
            <BarChart3 size={16} /> Analytics
          </Link>
        )}

        <span className="user-chip">
          {user.fullName} · {user.role}
        </span>

        <button className="btn btn-outline" onClick={handleLogout}>
          <LogOut size={14} /> Logout
        </button>
      </nav>
    </header>
  );
}
