# Customer Care Registry

A MERN-stack customer complaint/support system with three roles — **customer**, **agent**, and **admin** — covering complaint submission, live chat, escalation, feedback, and notifications.

**Live app:** https://customer-registry-indol.vercel.app

## Demo Accounts

| Role     | Email                  | Password       |
|----------|--------------------------|-----------------|
| Admin    | `admin8689@gmail.com`  | `admin8689`     |
| Agent    | `agent@demo.com`       | `Agent@123`     |
| Customer | `customer@demo.com`    | `Customer@123`  |

---

---

## Project Structure

```
server/   → Node + Express + MongoDB backend
client/   → React + Vite frontend
```

### server/
```
server/
├── server.js
├── package.json
└── src/
    ├── config/
    │   └── db.js
    ├── controllers/
    │   ├── authController.js
    │   ├── complaintController.js
    │   ├── feedbackController.js
    │   ├── messageController.js
    │   └── notificationController.js
    ├── middleware/
    │   └── authMiddleware.js
    ├── models/
    │   ├── User.js
    │   ├── Complaint.js
    │   ├── Feedback.js
    │   ├── Message.js
    │   └── Notification.js
    └── routes/
        ├── authRoutes.js
        ├── complaintRoutes.js
        ├── feedbackRoutes.js
        ├── messageRoutes.js
        └── notificationRoutes.js
```

### client/
```
client/
├── index.html
├── package.json
├── vite.config.js
└── src/
    ├── api/
    │   └── axios.jsx
    ├── components/
    │   ├── ComplaintCard.jsx
    │   ├── Navbar.jsx
    │   └── ProtectedRoute.jsx
    ├── context/
    │   ├── AuthContext.jsx
    ├── pages/
    │   ├── Home.jsx
    │   ├── Login.jsx
    │   ├── Register.jsx
    │   ├── Dashboard.jsx
    │   ├── ComplaintDetail.jsx
    │   ├── Notifications.jsx
    │   ├── Agents.jsx
    │   ├── AgentProfile.jsx
    │   └── FeedbackAnalytics.jsx
    ├── App.jsx
    └── main.jsx
```

---


## Environment Variables

### server/.env
```
PORT=8081
MONGO_URI=<your MongoDB connection string>
JWT_SECRET=<your JWT secret>
JWT_EXPIRE=30d
ADMIN_EMAIL=<admin login email>
ADMIN_PASSWORD=<admin login password>
```

### client/.env
```
VITE_API_URL=<your backend API URL>
```
