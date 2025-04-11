
# 📘 CodeVibe — Collaborative Code Editor

CodeVibe is a real-time collaborative code editor built with the MERN stack, powered by WebSockets, and deployed using Google Cloud Run. It features:

✅ User authentication with avatars  
✅ Session-based live code editing  
✅ Real-time messaging  
✅ Robust CI/CD with GitHub Actions & Docker  
✅ Monitoring via GCP & Slack notifications  

---

## 🔗 Live Demo

🌐 Frontend: [`codevibe-frontend`](#)  
🛠 Backend: [`codevibe-backend`](#)

---

## ⚙️ Tech Stack

| Layer     | Tech Used                               |
|-----------|------------------------------------------|
| Frontend  | React, Socket.io-client                  |
| Backend   | Express, MongoDB, Mongoose, Socket.io    |
| Auth      | JWT, bcrypt                              |
| File Uploads | multer                                |
| DevOps    | Docker, GitHub Actions, GCP Cloud Run    |
| Monitoring| Google Cloud Operations Suite (Stackdriver) |

---

## 🚀 Features

- 👥 Register/Login with avatar selection  
- 👨‍💻 Real-time collaborative code editor (WebSockets)  
- 💬 Live chat in coding sessions  
- 📂 Upload & serve user avatars  
- 🔐 JWT-based secure authentication  
- 🧪 Automated backend testing (Jest + Supertest)  
- 📡 Slack deploy notifications via GitHub Actions  
- 📈 GCP Logs & Custom Dashboards  

---

## 🧪 Testing

✅ Jest + Supertest for automated backend testing

📦 Run locally:

```bash
cd backend
npm install
npm test
```

⚙️ In CI/CD:  
Tests run automatically on every push to `main` before deployment.

---

## 🐳 CI/CD Pipeline (GitHub Actions + Docker + GCP)

1. 🧪 Run tests  
2. 🐳 Docker build & push (frontend + backend)  
3. ☁️ Deploy to Google Cloud Run  
4. 🔔 Slack notifications on deploy status  

📂 Example Workflow:  
Full CI/CD GitHub Actions workflow is included in the repo under `.github/workflows`.

---

## 📊 GCP Monitoring & Logs Setup

✅ Google Cloud Run automatically logs & tracks metrics.

🛠 Enable once:

```bash
gcloud services enable monitoring.googleapis.com
gcloud services enable logging.googleapis.com
```

📍 Access:

- Logs → GCP Console → Operations → Logging  
- Dashboards → GCP Console → Monitoring → Dashboards  

---

## 🔍 API Routes & Postman Testing

Use Postman or any REST client to test the backend APIs:

### 🔐 Auth Routes

#### 📝 Register
POST `/api/auth/register`  
Body:

```json
{
  "username": "john123",
  "email": "john@example.com",
  "password": "secret123",
  "gender": "male"
}
```

#### 🔐 Login
POST `/api/auth/login`  
Body:

```json
{
  "username": "john123",
  "password": "secret123"
}
```

#### 🧑‍💼 Get Profile
GET `/api/auth/profile`  
Headers:
```
Authorization: Bearer <JWT_TOKEN>
```

#### ✏️ Update Profile
PUT `/api/auth/profile`  
Headers:
```
Authorization: Bearer <JWT_TOKEN>
Content-Type: multipart/form-data
```
Form Data:
- `username`, `email`, `gender`, `password`, `avatar (file)`

---

### 📚 Session Routes

#### 🚀 Create Session
POST `/api/sessions/create`  
Headers:
```
Authorization: Bearer <JWT_TOKEN>
```

#### 🧑 Join Session
POST `/api/sessions/join`  
Body:

```json
{
  "sessionId": "abc-123"
}
```

#### 💻 Update Code
POST `/api/sessions/update-code`  
Body:

```json
{
  "sessionId": "abc-123",
  "code": "console.log('Hello World')"
}
```

---

## 🧠 DevOps Highlights

✅ Fully dockerized frontend & backend  
✅ End-to-end CI/CD via GitHub Actions  
✅ Auto-deployment to Google Cloud Run  
✅ Automated tests before every deployment  
✅ Slack notifications on deploy status  
✅ Stackdriver logs and custom dashboards  

---

## 🛡️ Security Notes

- JWT-based authentication  
- Passwords hashed with bcrypt  
- Protected routes via middleware  
- Avatar uploads secured using multer  

---

## 👨‍💻 Author

Made with ❤️ by **Vikash Raj**  
```

