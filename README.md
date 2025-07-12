# 🌍 Travel Planner App

A full-stack travel itinerary planner built using **React.js**, **Tailwind CSS**, and **Firebase**.  
Users can sign up, plan trips with categories, mark favorites, and manage their itineraries securely.

---

## ✨ Features

- 🔐 User Authentication (Email/Password)
- 📆 Add, View, and Delete Trips
- ⭐ Save Trips as Favorites
- 📂 Categorize Trips by Type (Adventure, Leisure, Work)
- 🖼️ UI built with Tailwind CSS + Lucide Icons
- ☁️ Firebase Auth + Firestore + Hosting

---

## 🛠️ Tech Stack

- **Frontend:** React, React Router, Tailwind CSS, Lucide React
- **Backend-as-a-Service:** Firebase (Auth + Firestore + Hosting)
- **Icons:** [lucide-react](https://lucide.dev/)

---

## 🚀 Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/YOUR_USERNAME/travel-planner.git
cd travel-planner
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure Firebase

Create a `.env` file in the root:

```env
REACT_APP_FIREBASE_API_KEY=your_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
```

> You can get these values from your Firebase Project > Project Settings.

---

## 📦 Run the App Locally

```bash
npm start
```

---

## 🔥 Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Enable:
   - **Authentication → Email/Password**
   - **Firestore Database → Start in test mode**
4. Copy config keys into your `.env`

---

## 🚢 Deployment (Firebase Hosting)

```bash
npm run build
npm install -g firebase-tools
firebase login
firebase init
# Choose Hosting → Use build folder → Yes to SPA
firebase deploy
```

---

## 🧑‍💻 Author

- **Harsha Vardhan Yanakandla**
- 💼 Full Stack Developer Intern Candidate

