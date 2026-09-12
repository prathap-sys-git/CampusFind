# CampusFind 🎓

## AI-Powered Campus Lost & Found System

> **An Individual College IT Project**

CampusFind is a smart web-based **Campus Lost & Found System** designed to help students quickly report, search, match, and recover lost items within a college campus.

Instead of depending on WhatsApp groups, notice boards, or manually checking lost-and-found records, CampusFind provides a centralized platform where users can report lost and found items. The system is designed to use **AI-powered image matching** to identify visually similar items and help connect the person who lost an item with a possible matching found-item report.

---

## 📌 Problem Statement

Students frequently lose personal belongings such as:

* 🎧 Earphones
* 📱 Mobile phones
* 💳 ID cards
* 💻 Laptops
* 🎒 Bags
* 🧴 Water bottles
* ☂️ Umbrellas
* 🚲 Bicycles
* 🔑 Keys
* 📚 Books and other belongings

Currently, lost-item information is often scattered across college WhatsApp groups, social media groups, security offices, and physical notice boards.

This makes it difficult to:

* Find a matching lost/found item
* Search through previous reports
* Verify ownership
* Contact the correct person
* Maintain a centralized record

### 💡 Proposed Solution

CampusFind provides one centralized platform for reporting and recovering campus belongings, with an AI-based visual matching system to identify potentially matching items.

---

# ✨ Key Features

### 🔐 Authentication

* Student registration and login
* Secure authentication using Supabase Auth
* User profile management
* Protected application routes

### 📦 Report Lost Item

Students can report lost belongings by providing:

* Item name
* Category
* Description
* Color
* Brand
* Location
* Date and time
* Additional details
* Item image

### 🔎 Report Found Item

Students or campus staff can report items they have found with similar information.

### 🤖 AI Image Matching

CampusFind is designed to compare uploaded item images using:

**CLIP + FAISS**

The AI pipeline converts images into embeddings and searches for visually similar items.

Example:

```text
Lost Item Image
       ↓
   CLIP Model
       ↓
 Image Embedding
       ↓
   FAISS Search
       ↓
Similar Found Items
       ↓
Match Score
```

Example result:

```text
Possible Match Found

Lost Item: Black Wireless Earbuds
Found Item: Black Wireless Earbuds

AI Match: 92%
```

### 🔍 Smart Search & Filtering

Users can browse and filter:

* Lost items
* Found items
* Categories
* Locations
* Dates
* Item names

### 📋 Item Details

Each item report contains detailed information about the reported item and its current status.

### 🤝 Claim Verification

Users can submit a claim for a found item.

The system can later be extended with ownership verification questions and admin approval.

### 🔔 Notifications

Users can receive notifications about:

* Possible AI matches
* Claim updates
* Item status changes
* Important system updates

### 👨‍💼 Admin Management

Administrators can manage:

* Lost-item reports
* Found-item reports
* Claims
* Users
* Suspicious reports
* Item status

---

# 🏗️ System Architecture

```text
                    ┌─────────────────────┐
                    │      Student        │
                    │   Web Application   │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │ React + TypeScript  │
                    │       + Vite        │
                    └──────────┬──────────┘
                               │
                               ▼
              ┌─────────────────────────────────┐
              │            Supabase             │
              │                                 │
              │  • Authentication               │
              │  • PostgreSQL Database           │
              │  • Storage                       │
              │  • Realtime                      │
              └───────────────┬─────────────────┘
                              │
                              ▼
                    ┌─────────────────────┐
                    │   Python AI Service │
                    │                     │
                    │       CLIP          │
                    │        +            │
                    │       FAISS         │
                    └─────────────────────┘
```

---

# 🛠️ Technology Stack

| Layer           | Technology           |
| --------------- | -------------------- |
| Frontend        | React                |
| Language        | TypeScript           |
| Build Tool      | Vite                 |
| Styling         | Tailwind CSS         |
| Backend         | Node.js + TypeScript |
| API             | Express.js           |
| Database        | Supabase PostgreSQL  |
| Authentication  | Supabase Auth        |
| File Storage    | Supabase Storage     |
| Realtime        | Supabase Realtime    |
| AI Service      | Python               |
| Computer Vision | CLIP                 |
| Vector Search   | FAISS                |
| Version Control | Git                  |
| Repository      | GitHub               |

---

# 🎨 Frontend

CampusFind uses a modern responsive interface with:

* Light theme
* Dark theme
* System theme
* Responsive design
* Animated page transitions
* Interactive cards
* Image upload preview
* Drag-and-drop image upload
* Search and filtering
* Dashboard statistics
* Notification interface

### Main Pages

```text
Public
│
├── Home
├── How It Works
├── Login
└── Register

Authenticated
│
├── Dashboard
├── Report Lost
├── Report Found
├── Browse Lost Items
├── Browse Found Items
├── AI Matches
├── Claims
├── Notifications
├── Profile
└── Settings
```

---

# 🔄 User Workflow

```text
Student loses an item
        ↓
Login to CampusFind
        ↓
Report Lost Item
        ↓
Upload Item Image
        ↓
Search Existing Found Items
        ↓
AI Image Matching
        ↓
Possible Match
        ↓
User Reviews Match
        ↓
Submit Claim
        ↓
Verification
        ↓
Item Recovered 🎉
```

---

# 🤖 AI Matching Approach

The planned AI matching system uses **CLIP** to generate semantic image embeddings.

These embeddings are stored and searched using **FAISS**.

The system can combine multiple signals:

```text
Final Score =
    α × S_CLIP
  + β × S_text
  + γ × S_location
  + δ × S_time
```

Proposed weights:

```text
α = 0.50  → Image similarity
β = 0.25  → Text similarity
γ = 0.15  → Location similarity
δ = 0.10  → Time similarity
```

### Match Classification

```text
Score > 0.75
    → High-confidence match

0.50 – 0.75
    → Possible match / manual verification

< 0.50
    → Low-confidence match
```

The AI system is intended to assist users rather than make final ownership decisions automatically.

---

# 🗄️ Database Design

The application is designed around Supabase PostgreSQL.

Main tables include:

```text
profiles
    │
    └── User information

items
    │
    ├── Lost items
    └── Found items

claims
    │
    └── Item ownership claims

notifications
    │
    └── User notifications
```

Images are stored in **Supabase Storage**, while the database stores the corresponding image path/URL and item metadata.

---

# 🔒 Security & Privacy

CampusFind is designed with privacy and security in mind.

Planned security measures include:

* Supabase Authentication
* Row Level Security (RLS)
* Protected routes
* Secure database policies
* Controlled image storage
* User-specific data access
* Claim verification
* No exposure of Supabase service-role keys

Sensitive credentials should be stored using environment variables and must never be committed to GitHub.

---

# 📂 Project Structure

```text
CampusFind/
│
├── src/
│   ├── components/
│   ├── pages/
│   ├── layouts/
│   ├── services/
│   ├── lib/
│   ├── hooks/
│   ├── types/
│   └── App.tsx
│
├── public/
│
├── supabase/
│   └── migrations/
│
├── ai-service/
│   ├── models/
│   ├── embeddings/
│   └── matching/
│
├── .env.example
├── .gitignore
├── package.json
├── tsconfig.json
└── README.md
```

---

# 🚀 Development Status

### ✅ Completed

* [x] Project initialization
* [x] React + TypeScript frontend
* [x] Vite setup
* [x] CampusFind landing page
* [x] Login/Register interface
* [x] Dashboard layout
* [x] Report Lost page
* [x] Report Found page
* [x] Image upload interface
* [x] Image preview functionality
* [x] Light/Dark/System theme
* [x] Frontend animations
* [x] Git repository setup

### 🔄 In Development

* [ ] Supabase Authentication
* [ ] Supabase PostgreSQL integration
* [ ] Supabase Storage
* [ ] Lost/Found database operations
* [ ] Browse and search integration
* [ ] Claims system
* [ ] Notifications
* [ ] Admin dashboard

### 🚧 Planned

* [ ] Python AI service
* [ ] CLIP image embeddings
* [ ] FAISS vector search
* [ ] AI similarity scoring
* [ ] Automatic match notifications
* [ ] Claim verification workflow
* [ ] AI performance evaluation
* [ ] Campus deployment/testing

---

# 📊 AI Evaluation

The AI matching system will be evaluated using metrics such as:

* Precision@K
* Recall@K
* Top-K retrieval accuracy
* Matching accuracy
* False-positive rate
* Response latency

Target:

```text
AI matching response time < 3 seconds
```

Actual performance will depend on the deployment environment, dataset size, and model configuration.

---

# 🌱 Future Enhancements

Possible future improvements include:

* 📱 Mobile application
* 📍 Campus map integration
* 📷 Better image similarity models
* 🧠 Multimodal AI matching
* 🔔 Real-time notifications
* 🪪 Enhanced identity/ownership verification
* 🛡️ Fraud and duplicate-report detection
* 📈 Admin analytics dashboard
* 🏫 Multi-campus support
* 🌐 Multi-language support

---

# 🎓 Academic Project

**Project Name:** CampusFind
**Project Type:** Individual College IT Project
**Domain:** Web Application / Artificial Intelligence
**Purpose:** Campus Lost & Found Management
**Status:** In Development

This project is developed as an individual academic project to demonstrate practical application of:

* Full-stack web development
* Database management
* Authentication
* Cloud storage
* Artificial intelligence
* Computer vision
* Vector similarity search
* Software engineering
* Git/GitHub version control

---

# 👨‍💻 Developer

**Prathap**

GitHub:
`https://github.com/prathap-sys-git`

Repository:
`https://github.com/prathap-sys-git/CampusFind`

---

# 📜 License

This project is developed for **academic and educational purposes**.

© 2026 Prathap — CampusFind
