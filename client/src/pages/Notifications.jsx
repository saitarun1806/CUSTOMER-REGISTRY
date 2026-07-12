import { useEffect, useState } from "react";
import { BellRing } from "lucide-react";
import api from "../api/axios";
import heroImage from "../assets/hero.png";

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadNotifications = async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/notifications");
      setNotifications(res.data);
    } catch (err) {
      console.error("Failed to fetch notifications", err);
    } finally {
      setLoading(false);
    }
  };

  // Initial load when the page mounts
  useEffect(() => {
    loadNotifications();
  }, []);

  // Poll for new notifications every 5 seconds while this page is open
  useEffect(() => {
    const intervalId = setInterval(() => {
      loadNotifications();
    }, 5000);
    return () => clearInterval(intervalId);
  }, []);

  const markAsRead = async (id) => {
    await api.put(`/api/notifications/${id}/read`);
    loadNotifications();
  };

  return (
    <div className="container">
      <h1 style={{ marginBottom: 20 }}>
        <BellRing size={20} style={{ verticalAlign: "middle", marginRight: 6 }} />
        Notifications
      </h1>

      <div className="card">
        {loading && notifications.length === 0 ? (
          <p>Loading...</p>
        ) : notifications.length === 0 ? (
          <div className="empty-state">
            <img src={heroImage} alt="Nothing here yet" className="illustration-img illustration-img-sm" />
            <p>You're all caught up!</p>
          </div>
        ) : (
          notifications.map((n) => (
            <div key={n._id} className={`notification-item ${!n.isRead ? "unread" : ""}`}>
              <div>
                <p style={{ margin: 0 }}>{n.message}</p>
                <span className="notification-time">
                  {new Date(n.createdAt).toLocaleString()}
                </span>
              </div>
              {!n.isRead && (
                <button className="btn btn-outline" onClick={() => markAsRead(n._id)}>
                  Mark read
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}