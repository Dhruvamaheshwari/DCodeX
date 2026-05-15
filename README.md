<!-- @format -->

`<!-- @format -->

<div align="center">

# 🚀 DCodeX

**A High-Performance Full-Stack Online Code Execution & Judging Platform**

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](#)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](#)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)](#)
[![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)](#)
[![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)](#)
[![Redis](https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white)](#)
[![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)](#)
[![WSL](https://img.shields.io/badge/WSL-4D4D4D?style=for-the-badge&logo=linux&logoColor=white)](#)

</div>

## 📖 Overview

**DCodeX** is a robust and scalable full-stack system for an online competitive programming and code judging platform. Built with a modern **MERN** stack (along with Redis and Docker), it seamlessly manages users, coding problems, code submissions, and execution environments utilizing a locally hosted **Piston** engine powered by **Docker** and **WSL**.

Whether you're building the next LeetCode, HackerRank, or an internal corporate coding assessment tool, DCodeX provides the structural foundation and an intuitive frontend UI you need out-of-the-box.

---

## ✨ Features

- 🖥️ **Interactive UI**: Responsive and modern user interface built with React, Vite, Tailwind CSS, and DaisyUI. Maintains global state seamlessly with Redux Toolkit.
- 🔐 **Secure Authentication & Validation**: Robust user auth using JWT stored in HTTP-only cookies, password hashing with bcrypt, input validation with Zod, and secure logout via Redis token blacklisting.
- 👨‍💻 **Problem Management & Filtering**: Full CRUD operations for coding problems. Includes dynamic dropdown filtering by **Topic**, **Difficulty**, and **Specific Problem Title**.
- 📄 **Server-Side Pagination**: Highly optimized problem fetching with server-side pagination (e.g., retrieving 10 problems at a time) to prevent UI lag and minimize database load, even with 100,000+ problems.
- 📈 **User Progress Tracking**: Real-time stats reflecting the number of problems solved and an interactive navbar showing progress instantly upon login.
- 🚀 **Local Code Execution**: Integrated with **Piston** running locally in **Docker** via **WSL** for secure, low-latency, and sandboxed code execution across multiple languages.
- ⚡ **Caching & Rate Limiting**: Intelligent caching and cooldown mechanisms powered by **Redis** to ensure blazing fast response times and prevent API abuse.
- 📊 **Submissions Tracking**: Keep track of user submissions, verdicts (AC, WA, TLE, etc.), and execution metrics.
- 🛡️ **Role-Based Access Control (RBAC)**: Distinct permissions for standard users and administrators.

---

## 🛠️ Tech Stack

### Frontend

- **Framework**: [React](https://reactjs.org/) with [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) & [DaisyUI](https://daisyui.com/)
- **State Management**: [Redux Toolkit](https://redux-toolkit.js.org/)
- **Forms & Validation**: React Hook Form, Zod
- **API Client**: Axios

### Backend

- **Runtime**: [Node.js](https://nodejs.org/)
- **Framework**: [Express.js](https://expressjs.com/)
- **Database**: [MongoDB](https://www.mongodb.com/) (managed via [Mongoose](https://mongoosejs.com/))
- **Caching/Queue**: [Redis](https://redis.io/)
- **Code Execution**: [Piston](https://github.com/engineer-man/piston) (Locally hosted via Docker on WSL)

---

## 📂 Project Structure

```text
DCodeX/
├── Frontend/            # React + Vite frontend application (UI, State, Pages)
├── config/              # Database (MongoDB) and Redis connection setups
├── controller/          # Core business logic (Users, Problems, Submissions)
├── middleware/          # Security (Auth, Admin access, Cooldown/Rate Limiting)
├── model/               # Mongoose database schemas
├── Routes/              # Express API route definitions
├── utils/               # Utility functions and input validators
├── index.js             # Application entry point (Server)
├── package.json         # Dependency management & scripts
└── .env                 # Environment variables (not in VCS)
```

---

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed on your local machine:

- Node.js (v18 or higher)
- MongoDB (local or Atlas)
- Redis server (local or cloud)
- **Docker Desktop** (with WSL2 integration enabled in Windows)
- **Piston API** (Run locally via Docker container)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/dcodex.git
   cd dcodex
   ```

2. **Install Backend dependencies**

   ```bash
   npm install
   ```

3. **Install Frontend dependencies**

   ```bash
   cd Frontend
   npm install
   cd ..
   ```

4. **Start the local Piston Code Execution engine in Docker/WSL**

   ```bash
   docker run -d -p 2000:2000 ghcr.io/engineer-man/piston
   ```

5. **Environment Setup (Backend)**
   Create a `.env` file in the root directory and configure the following variables:

   ```env
   PORT=3000
   MONGO_URI=mongodb://localhost:27017/dcodex
   REDIS_URL=redis://localhost:6379
   JWT_KEY=your_super_secret_jwt_key
   PISTON_URL=http://127.0.0.1:2000
   ```

6. **Start the Application**

   **Terminal 1 (Backend):**

   ```bash
   npm start
   # or node index.js
   ```

   **Terminal 2 (Frontend):**

   ```bash
   cd Frontend
   npm run dev
   ```

   The frontend will be running on `http://localhost:5173` and the backend on `http://localhost:3000`.

---

## 🔌 Core API Routes

- **User Authentication (`/user`)**
  - `POST /register` - Register a new user
  - `POST /login` - Login to the platform
  - `POST /logout` - Securely logout (Redis token blacklisting)
  - `GET /check` - Verify Auth status

- **Problems (`/problem`)**
  - `GET /getAllProblem` - Fetch all problems
  - `GET /problemById/:id` - Get details of a specific problem
  - `POST /create` - Add a new problem (Admin only)

- **Submissions (`/submit`)**
  - `POST /:pid` - Submit code for a problem

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!
Feel free to check the [issues page](#) if you want to contribute.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📜 License

Distributed under the ISC License. See `LICENSE` for more information.

<div align="center">
  <i>Built with ❤️ by an awesome developer.</i>
</div>
