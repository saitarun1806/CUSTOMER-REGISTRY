# Customer Care Registry

A MERN-stack customer complaint/support system with three roles — **customer**, **agent**, and **admin** — covering complaint submission, live chat, escalation, feedback, and notifications.

```
client/   → React + Vite frontend
server/    → Node + Express + MongoDB backend
```

---

## Demo Accounts

Use these to log in and explore the app without registering new users.

| Role     | Email               | Password      |
|----------|---------------------|---------------|
| Admin    | `admin8689@gmail.com` | `admin8689` |
| Agent    | `agent@demo.com`    | `Agent@123`   |
| Customer | `customer@demo.com` | `Customer@123`|

**Notes:**
- The **admin** account is not a normal database user — it's auto-created the first time you log in with the email/password set in the backend's `ADMIN_EMAIL` / `ADMIN_PASSWORD` environment variables. The values above match the included `.env`; change them before you deploy anywhere public, then log in once with the new values to (re)create the admin account.
- The **agent** and **customer** accounts are created by a seed script — run it once against your database:
  ```bash
  cd "server"
  npm install
  npm run seed
  ```
  It's safe to re-run; it skips any demo account that already exists.
- ⚠️ These are demo credentials for local/testing use only. Rotate all three before exposing the deployment publicly.

---

## 1. Backend Deployment (`server`)

The backend is a standard Express + Mongoose API. Deploy it to any Node host (Render, Railway, Fly.io, an EC2/VPS box, etc.).

1. Push `server` to its own repo (or a subdirectory your host can target).
2. Set these environment variables on your host:

   | Variable         | Example                                              |
   |------------------|-------------------------------------------------------|
   | `PORT`           | `8081` (or whatever your host assigns)                |
   | `MONGO_URI`      | `mongodb+srv://user:pass@cluster.mongodb.net/customer-registry` |
   | `JWT_SECRET`     | a long random string                                   |
   | `JWT_EXPIRE`     | `30d`                                                  |
   | `ADMIN_EMAIL`    | email for the auto-provisioned admin login             |
   | `ADMIN_PASSWORD` | password for the auto-provisioned admin login          |

   Use a hosted MongoDB (e.g. MongoDB Atlas free tier) rather than `localhost` for anything deployed.
3. Build command: `npm install`. Start command: `npm start`.
4. (Optional, once) run `npm run seed` with the deployed `MONGO_URI` to create the demo agent/customer accounts in production too.
5. Note the public URL your host gives the API (e.g. `https://your-app.onrender.com`) — you'll need it for the frontend.

---

## 2. Frontend Deployment (`client`)

The frontend is a Vite React app. Deploy it to Vercel, Netlify, Cloudflare Pages, etc.

1. Push `client` to its own repo (or point your host at that subdirectory).
2. Set a build environment variable:

   | Variable       | Value                                  |
   |----------------|------------------------------------------|
   | `VITE_API_URL` | your deployed backend URL, e.g. `https://your-app.onrender.com` |

   (See `.env.example` in this folder. Without this variable set, the app falls back to `http://localhost:8081`, which only works for local development.)
3. Build command: `npm install && npm run build`. Output directory: `dist`.
4. Deploy. Once live, confirm `VITE_API_URL` has no trailing slash and matches the backend's actual public URL exactly (including `https://`).
5. On your backend host, make sure CORS is allowed for the frontend's deployed domain (the backend currently allows all origins via `cors()`, so no change is needed unless you tighten that later).

---

## 3. Local Development

```bash
# Backend
cd "server"
npm install
npm run dev        # starts on the PORT in .env (default 8081)

# Frontend (in a second terminal)
cd "client"
npm install
npm run dev         # starts on http://localhost:5173, calls http://localhost:8081 by default
```

Then log in with any of the demo accounts above.
