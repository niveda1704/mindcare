# 🧠 MindCare

> **An AI-Powered Digital Sanctuary for Student Mental Wellness**

![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)
![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![Status](https://img.shields.io/badge/status-active-success.svg)

MindCare is a holistic mental health platform designed to bridge the gap between students and counselors. By integrating **Google Gemini AI** for 24/7 empathetic support and **Socket.io** for real-time crisis alerts, it creates a scalable, responsive safety net for educational campuses, ensuring professional guidance is always within reach.

---

## 🏗️ System Architecture

### 🔧 Tech Stack
*   **Frontend**: `React 19`, `Vite`, `TailwindCSS`, `Framer Motion`
*   **Backend**: `Node.js`, `Express.js`
*   **Database**: `MongoDB` (Mongoose ODM)
*   **Real-time**: `Socket.io` (WebSockets)
*   **AI Engine**: `Google Gemini 1.5 Flash`

### 🔑 Key Modules
1.  **Context-Aware Chat Bot**: AI utilizing RAG-like context to provide empathetic, non-medical support.
2.  **Live Counselor Dashboard**: Websocket-enabled dashboard for counselors to view student status changes instantly.
3.  **Clinical Notes System**: Encrypted, private database collections for counselor session records.
4.  **Role-Based Access Control (RBAC)**: Secure middleware (`protect`, `restrictTo`) enforcing strict data boundaries between Students, Counselors, and Admins.

---

## ⚡ Quick Start Guide

### 1. Prerequisites
*   Node.js (v18+)
*   MongoDB (Local service or Atlas)

### 2. Installation
```bash
# Clone the repository
git clone https://github.com/yourusername/mindcare.git

# Install Top-level dependencies (Frontend)
npm install

# Install Backend dependencies
cd backend
npm install
```

### 3. Environment Config
Create `backend/.env`:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/mindcare
JWT_SECRET=your_jwt_secret
GEMINI_API_KEY=your_google_api_key
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

### 4. Deployment
**Developer Mode (Concurrent)**
```bash
# Run both servers (Windows)
.\start_app.bat
```

---

## 📂 Project Tree

```text
mindcare/
├── src/                  # React Frontend
│   ├── context/          # State Management (Auth, Sound)
│   ├── pages/            # Views (Dashboard, Chat, Profile)
│   └── components/       # Reusable UI (VoiceCompanion)
├── backend/              # Node.js API
│   ├── controllers/      # Logic (Auth, Counselor, Chat)
│   ├── models/           # Schemas (User, Note, Appointment)
│   └── routes/           # API Endpoints
└── public/               # Static Assets
```

## �️ Security Features
*   **JWT Authentication**: Stateless session management.
*   **Bcrypt Hashing**: Industry-standard password encryption.
*   **OTP Verification**: 2-Factor email validation for student registration.
*   **Sanitized Inputs**: MongoDB injection prevention.

---
*Maintained by Niveda Sree*
