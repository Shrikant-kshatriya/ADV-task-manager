# 🧠 Task Management System

A full-stack task management application built for small teams, focusing on collaboration, productivity, and seamless real-time task handling.

## 🌐 Live Demo

**Frontend**: [https://stamurai-frontend.vercel.app/](https://stamurai-frontend.vercel.app/)
**Backend**: [https://your-backend-url.onrender.com](https://your-backend-url.onrender.com)

---

## 📌 Table of Contents

* [Features](#features)
* [Tech Stack](#tech-stack)
* [Setup Instructions](#setup-instructions)
* [Architecture & Approach](#architecture--approach)
* [RBAC Rules](#rbac-rules)
* [Assumptions & Trade-offs](#assumptions--trade-offs)
* [Future Improvements](#future-improvements)

---

## ✅ Features

### 🔐 User Authentication

* Secure registration and login using JWT and hashed passwords.
* Session management with cookies.

### 📋 Task Management

* Create, update, delete, and view tasks.
* Each task includes: `title`, `description`, `due date`, `priority`, and `status`.

### 👥 Team Collaboration

* Assign tasks to other users based on RBAC rules.
* Real-time notifications (Socket.io) when a task is assigned.

### 📊 Dashboard

* View tasks:

  * Assigned to me
  * Created by me
  * Overdue tasks

### 🔎 Search & Filter

* Search by title/description.
* Filter by:

  * Task status
  * Priority
  * Due date

### 🔐 Role-Based Access Control (RBAC)

* Admin, Manager, and User roles.
* Role-based task assignment and access to team views.

### 🧑‍🤝‍🧑 Team Page (Managers & Admins)

* View all users in the organization/team.

---

## 🛠 Tech Stack

| Layer         | Tech                                           |
| ------------- | ---------------------------------------------- |
| **Frontend**  | Next.js (App Router), JavaScript, Tailwind CSS |
| **Backend**   | Node.js, Express.js, JWT                       |
| **Database**  | MongoDB + Mongoose                             |
| **Real-time** | Socket.io                                      |
| **Auth**      | JWT (access token in HTTP-only cookie)         |

---

## ⚙️ Setup Instructions

### 🖥️ Backend

```bash
cd server
npm install
# Create .env file with the following:
# MONGODB_URL=
# JWT_SECRET=
# SESSION_SECRET=
# CLIENT_URL=
# NODE_ENV=development
node index.js
```

### 🌐 Frontend

```bash
cd frontend
npm install
# Create .env file with:
# NEXT_PUBLIC_SERVER_URL=
npm run dev
```

---

## 🧠 Architecture & Approach

* Used **Next.js App Router** for scalable and dynamic frontend routes.
* Employed **Express.js** with **JWT-based authentication** for stateless security.
* Leveraged **Socket.io** to deliver real-time task assignment alerts.
* Implemented **RBAC** to ensure only authorized users can assign tasks across roles.
* Designed a **dark-themed UI** using Tailwind CSS for clean and modern UX.
* Built reusable components and APIs with clean separation of concerns.

---

## 🔐 RBAC Rules

| Role    | Can Assign To        | Access to Team Page |
| ------- | -------------------- | ------------------- |
| Admin   | Admin, Manager, User | ✅ Yes               |
| Manager | Manager, User        | ✅ Yes               |
| User    | Self                 | ❌ No                |

---

## 💡 Assumptions & Trade-offs

* **Role assignment is static** post-registration (no role management UI).
* **In-app notifications** are implemented; **email** notifications are not.
* **Optimized for desktop-first**, responsive design is in place but not PWA.
* Real-time updates handled via Socket.io; no polling fallback.
* All tasks are **team-visible** via APIs, restricted based on role.

---

## 🚀 Future Improvements

* 🔔 Notification preference settings (mute, email, push)
* 📆 Recurring task support (daily/weekly/monthly)
* 🧪 Unit and integration tests (Jest/Mocha)
* 📈 Analytics dashboard for task completion metrics
* 📜 Audit logs for all user actions
* 📱 PWA support for offline functionality

---

## 📎 Submission Details

* **GitHub Repo**: [https://github.com/Shrikant-kshatriya/ADV-task-manager](https://github.com/Shrikant-kshatriya/ADV-task-manager)
* **Deployed Frontend**: [https://stamurai-frontend.vercel.app/](https://stamurai-frontend.vercel.app/)
* **Deployed Backend**: [https://task-api.onrender.com](https://task-api.onrender.com)

