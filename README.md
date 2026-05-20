<div align="center">

# 🚀 DCodeX - Full-Stack Online Judge & Coding Platform

**A High-Performance System for Competitive Programming and Algorithm Practice**
</div>

## 📖 Project Overview
**DCodeX** is a highly dynamic, full-stack online coding platform heavily inspired by industry-leading systems like LeetCode and HackerRank. It allows developers and students to practice coding problems, run code against custom test cases, and securely submit their solutions for automated evaluation.

The system is designed to provide an interactive, real-time code execution environment utilizing a secure sandboxed execution engine. It perfectly balances a rich, customizable UI with a robust, scalable backend architecture.

## ✨ Features Section
* **Dynamic Problem Fetching:** Instantly retrieves coding problems, descriptions, and metadata directly from the backend database.
* **Multi-Language Code Editor:** Integrated Monaco Editor (the core engine behind VS Code) supporting syntax highlighting and autocomplete.
* **Dynamic Language Switching:** Users can seamlessly toggle between languages (C++, Java, Python, JavaScript) while preserving their boilerplate and active code within a cached state map.
* **Code Execution System:** Real-time compilation and execution of user code against predefined visible test cases.
* **Test Case Validation System:** 
  * Displays dynamic pass/fail indicators.
  * *Passed test cases* are highlighted in **green**.
  * *Failed test cases* are highlighted in **red**.
  * Provides detailed side-by-side comparison of user input, expected output, and actual output.
* **Submission System:** Tracks successful and rejected submissions. Evaluates code against hidden test cases and dynamically populates the user's submission history with real-time stats (Memory, Runtime, Status).
* **Editorial & Solution Sections:** Dedicated tabs for users to view official problem editorials and reference solutions.
* **Dynamic Tabs & Buttons:** Interactive UI allowing toggle between descriptions, testcases, and results without screen freezing.
* **User Authentication:** Robust JSON Web Token (JWT) system handling user login, registration, and persistent sessions.
* **Responsive & Resizable UI:** Features a completely draggable and resizable split-pane layout (left/right and top/bottom) mirroring professional IDEs.
* **Loading & Error Handling:** Beautiful loading spinners and graceful error catchers preventing UI freezes during heavy code execution/compilation.
* **Secure Code Execution:** Backend strictly validates and routes code to a sandboxed Docker container ensuring the main server is protected from malicious scripts.

## 🛠️ Tech Stack

### Frontend
- **React.js (Vite):** Core UI framework optimized for blazing-fast development and rendering.
- **Tailwind CSS & DaisyUI:** Utility-first framework for sleek, modern, and dark-theme component styling.
- **Redux / Context API:** Global state management for authentication and user sessions.
- **Axios:** Streamlined HTTP client for backend network requests.
- **Monaco Editor / CodeMirror:** High-performance code editor powering the syntax environment.
- **React Router:** For dynamic single-page application (SPA) navigation.

### Backend
- **Node.js:** Server-side javascript runtime.
- **Express.js:** Lightweight routing and API framework.
- **MongoDB:** NoSQL database for flexible data modeling and fast retrieval.
- **Mongoose:** Object Data Modeling (ODM) library for MongoDB.
- **JWT Authentication:** Secure, stateless authentication system.

### Code Execution
- **Docker Sandboxing:** Isolates user code execution to prevent unauthorized network or filesystem access.
- **Judge0 API / Custom Compiler Setup (Piston):** A high-performance remote code execution system designed for safe compilation and execution of untrusted snippets.

## 📡 API Documentation

Below is a brief overview of the exposed REST endpoints:

```http
# Problem Fetching
GET /api/problems
GET /api/problems/:id

# Code Execution & Submission
POST /api/code/run
POST /api/code/submit
GET /api/submissions/:problemId

# Authentication (Examples)
POST /api/user/register
POST /api/user/login
```

## 🗄️ Database Schema

### `Users` Collection
```json
{
  "_id": "ObjectId",
  "username": "coder123",
  "email": "user@example.com",
  "password": "hashed_password",
  "role": "user",
  "problemsSolved": ["ObjectId1", "ObjectId2"]
}
```

### `Problems` Collection
```json
{
  "_id": "ObjectId",
  "title": "Two Sum",
  "description": "Given an array of integers return indices of the two numbers...",
  "difficulty": "easy",
  "tags": ["Array", "Hash Table"],
  "startCode": [
     { "language": "cpp", "initialCode": "int main() { ... }" }
  ],
  "visibleTestCases": [{ "input": "2 3", "output": "5" }],
  "hiddenTestCases": [{ "input": "...", "output": "..." }]
}
```

### `Submissions` Collection
```json
{
  "_id": "ObjectId",
  "userId": "ObjectId",
  "problemId": "ObjectId",
  "Code": "int main() { return 0; }",
  "language": "cpp",
  "status": "Accepted",
  "runtime": "12",
  "memory": "4096",
  "testCasePassed": 5,
  "testCasesTotal": 5,
  "createdAt": "Timestamp"
}
```

## 📁 Folder Structure

```text
DCodeX/
├── Frontend/
│   ├── public/
│   ├── src/
│   │   ├── adminPage/       # Admin specific portals
│   │   ├── pages/           # CodeEditor, HomePage, Login, Signup
│   │   ├── utils/           # axiosClient configurations
│   │   ├── store.js         # Redux Store
│   │   ├── App.jsx          # Route Definitions
│   │   └── main.jsx         # React Entry Point
│   ├── tailwind.config.js   # CSS Styling rules
│   └── package.json
│
├── config/                  # MongoDB & Redis Initialization
├── controller/              # Auth, Problems, and Submission Logic
├── middleware/              # JWT Validation and Rate Limiters
├── model/                   # Mongoose Database Schemas
├── Routes/                  # REST API Route Declarations
├── utils/                   # Code Execution Utility Logic
├── index.js                 # Express Application Entry
└── package.json
```

## 🔄 Workflow Explanation

1. **User opens problem:** The client navigates to the coding workspace via the problem list.
2. **Data fetched from backend:** The React component fetches problem details, testcases, and editorial configurations.
3. **User selects language:** A dynamic dropdown enables selecting Java, Python, C++, or JavaScript.
4. **Boilerplate loads dynamically:** Based on the choice, the specific starter skeleton code injects into the Monaco Editor.
5. **User writes code:** Features like syntax highlighting and formatting support development.
6. **Code runs against test cases:** The 'Run' button sends code securely to the backend execution module.
7. **Passed test case → green:** Verified exact matches render a green success check.
8. **Failed test case → red:** Discrepancies generate localized red failure blocks paired with exact diff displays.
9. **User submits code:** Submissions process against a larger set of hidden testcases.
10. **Submission stored in database:** A comprehensive entry mapping execution runtime, compilation status, and memory is saved for the user's historical portfolio.

## 🎨 UI Features
* **Dynamic Tabs:** Click effortlessly between Problem Description, Editorials, Solutions, and Submissions.
* **Resizable Panels:** Draggable horizontal and vertical layout splitters.
* **Draggable Layout:** Workspace blocks completely resize like standard coding IDEs.
* **Responsive Design:** Fluid height matching and overflow containment preventing screen clipping.
* **Theme Support:** Tailwind Dark-mode integrations applied globally ensuring an immersive, eye-friendly layout.

## 🛡️ Security Features
* **Sandboxed execution:** Untrusted code compiles inside isolated Docker instances.
* **Memory limits:** Processes killed automatically if RAM spikes unacceptably.
* **Timeout handling:** Infinite loops (`while(true)`) are terminated automatically to prevent resource strangulation.
* **Protected APIs:** Only valid JWT holders can submit solutions or fetch secure payloads. Admin checks apply for problem manipulation.
* **JWT auth:** Handled purely via HttpOnly server cookies (invulnerable to cross-site scripting/XSS).

## 🚀 Installation Guide

### 1. Backend Setup

```bash
# Clone the repository
git clone <your-repo-link>
cd DCodeX

# Install Node dependencies
npm install

# Start the execution engine (Docker Required)
docker run -d -p 2000:2000 ghcr.io/engineer-man/piston

# Launch the Application Server
npm run dev
```

### 2. Frontend Setup

Open a new terminal window:

```bash
# Navigate to Frontend module
cd DCodeX/Frontend

# Install React dependencies
npm install

# Start the Vite Development Server
npm run dev
```

## 🔑 Environment Variables

Create a `.env` file in the root `DCodeX/` directory:

```env
MONGO_URI=mongodb://127.0.0.1:27017/dcodex
JWT_SECRET=your_super_secret_jwt_key
PORT=4000
PISTON_URL=http://127.0.0.1:2000
```

## 🎯 Future Improvements
* **Contest System:** Time-bound competitive arenas for ranking.
* **AI Code Review:** Automated chatbot highlighting algorithm inefficiencies.
* **Leaderboard:** Global ranking metrics based on total AC solutions.
* **Discussion Section:** A user-to-user forum under each problem.
* **Real-time Collaboration:** Multiplayer websocket code syncing.
* **Plagiarism Detection:** AST-based code comparison to reject copied logic.
