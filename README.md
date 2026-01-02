# MindCare 🌿

MindCare is a holistic mental wellness platform meant to connect Seekers (users), Guides (support peers), and Keepers (professionals) in a soothing "Garden" environment. The application features comprehensive tools for mood tracking, immediate AI assistance, and professional resource access.

## Features 

*   **Role-Based Experience**: Tailored interfaces for Seekers, Guides, and Keepers.
*   **Mood & Wellness Tracking**: Visual analytics to monitor mental health trends over time.
*   **AI Voice Companion**: A conversational AI specifically tuned for empathy and support (powered by Google Gemini).
*   **Resource Hub**: A library of curated mental health articles, videos, and exercises.
*   **Ambient Soundscapes**: Integrated calming nature sounds (`NatureBackground`, `AmbientSound`) for relaxation.
*   **Secure Authentication**: Robust email-based OTP verification system.
*   **Emergency Support**: Instant access to crisis resources and notification systems.

## Tech Stack 

### Frontend
- **Framework**: React 19 + Vite
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Visualization**: Recharts
- **Icons**: Lucide React

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (Mongoose)
- **Real-time**: Socket.io
- **AI Integration**: Google Generative AI (Gemini)
- **Utilities**: Nodemailer (Email), BCrypt (Security)

## Getting Started 

Follow these instructions to set up the project locally.

### Prerequisites
- Node.js (v18+ recommended)
- MongoDB installed and running locally on port 27017 (or a cloud Atlas URI)

### Installation

1.  **Clone the repository**
    ```bash
    git clone <repository_url>
    cd mindcare
    ```

2.  **Install Frontend Dependencies**
    ```bash
    npm install
    ```

3.  **Install Backend Dependencies**
    ```bash
    cd backend
    npm install
    ```

### Configuration

Create a `.env` file in the `backend` folder with the following keys:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/mindcare
JWT_SECRET=your_secure_jwt_secret_key
# Email Configuration (for OTPs)
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_app_password
# AI Configuration
GEMINI_API_KEY=your_google_gemini_api_key
```

### Running the Application

#### Option 1: One-Click Start (Windows)
Simply run the included batch file in the root directory:
```cmd
start_app.bat
```

#### Option 2: Manual Start
1.  **Start the Backend**
    ```bash
    cd backend
    npm run dev
    ```
2.  **Start the Frontend** (in a new terminal)
    ```bash
    # verify you are in the root 'mindcare' folder
    npm run dev
    ```

Access the application at: **http://localhost:5173**

## Project Structure 

```
mindcare/
├── src/
│   ├── components/      # Reusable UI components (VoiceCompanion, AmbientSound)
│   ├── pages/           # Main application pages
│   ├── context/         # React Context (Auth, Theme)
│   └── assets/          # Static assets
├── backend/
│   ├── controllers/     # Route logic
│   ├── models/          # Database schemas
│   ├── routes/          # API endpoints
│   └── utils/           # Helper functions (Email, AI)
└── public/              # Public static files
```



