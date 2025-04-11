📘 CodeVibe — Collaborative Code Editor
CodeVibe is a real-time collaborative code editor built with the MERN stack, powered by WebSockets, and deployed using Google Cloud Run. It features user authentication, session-based live coding, messaging, and robust DevOps integration via GitHub Actions, Docker, GCP Monitoring, and Slack notifications.

🔗 Live Demo

🧠 Frontend: https://codevibe-frontend-514578696099.us-central1.run.app

🛠 Backend: https://codevibe-backend-514578696099.us-central1.run.app

⚙️ Tech Stack
Frontend: React, Socket.io-client

Backend: Express, MongoDB, Mongoose, Socket.io

Authentication: JWT, bcrypt

File Uploads: multer

DevOps: Docker, GitHub Actions, Google Cloud Run, Slack

Monitoring: Google Cloud Operations Suite (Stackdriver)

🚀 Features
👥 Register / Login with avatar selection

👨‍💻 Real-time collaborative code editor using WebSockets

💬 Live chat in coding sessions

📂 Upload and serve user avatars

🔐 Secure JWT-based authentication

🧪 Automated backend testing using Jest & Supertest

📡 Slack notifications for CI/CD status

📈 GCP Logs & Dashboards via Stackdriver

🧪 Testing
Backend tests written using Jest and Supertest

🔧 Run locally:

bash
Copy
Edit
npm test
✅ In CI/CD: Tests automatically run on every push to main before deploy.

🐳 Deployment (CI/CD with GitHub Actions + Docker + GCP)
CI/CD pipeline includes:

🧪 Run tests

🐳 Docker build & push for frontend and backend

☁️ Deploy to Google Cloud Run

🔔 Notify deployment status to Slack

📄 Sample CI/CD Workflow: See full workflow above ↑

📊 GCP Monitoring & Logs Setup
✅ GCP Cloud Run automatically collects logs and metrics.

🔧 Enable once:

bash
Copy
Edit
gcloud services enable monitoring.googleapis.com
gcloud services enable logging.googleapis.com
🔍 View logs:
GCP Console → Operations → Logging

📈 Dashboards:
GCP Console → Monitoring → Dashboards

🔍 Routes & API Testing via Postman
You can use Postman or any REST client to test the backend APIs:

🔐 Auth Routes
📝 Register
POST /api/auth/register
Body (JSON):

json
Copy
Edit
{
  "username": "john123",
  "email": "john@example.com",
  "password": "secret123",
  "gender": "male"
}
🔐 Login
POST /api/auth/login
Body (JSON):

json
Copy
Edit
{
  "username": "john123",
  "password": "secret123"
}
🧑‍💼 Get Profile
GET /api/auth/profile
Headers:

makefile
Copy
Edit
Authorization: Bearer <JWT_TOKEN>
✏️ Update Profile
PUT /api/auth/profile
Headers:

makefile
Copy
Edit
Authorization: Bearer <JWT_TOKEN>
Content-Type: multipart/form-data
Form Data (any or all fields):

scss
Copy
Edit
username, email, gender, password, avatar (file)
📚 Session Routes
🚀 Create Session
POST /api/sessions/create
Headers:

makefile
Copy
Edit
Authorization: Bearer <JWT_TOKEN>
🧑 Join Session
POST /api/sessions/join
Body:

json
Copy
Edit
{
  "sessionId": "abc-123"
}
💻 Update Code
POST /api/sessions/update-code
Body:

json
Copy
Edit
{
  "sessionId": "abc-123",
  "code": "console.log('Hello')"
}
🧠 DevOps Highlights
✅ Dockerized frontend & backend
✅ CI/CD via GitHub Actions
✅ Automated backend testing
✅ Google Cloud Run deployment
✅ Real-time Slack notification of deploy status
✅ Centralized monitoring/logging (Stackdriver)

🛡️ Security Notes
JWT for auth

Passwords hashed with bcrypt

Sensitive routes protected via middleware

File uploads managed securely via multer

👨‍💻 Author
Made with ❤️ by Vikash Raj
