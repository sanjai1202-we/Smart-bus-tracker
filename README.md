# Smart Multi-College Bus Tracking Platform

A complete, production-ready system to track college buses in real-time. Features role-based dashboards, live GPS polling via WebSockets (Socket.io + Redis), ETA predictions (Python microservice), and safety alerts.

## Tech Stack
- **Frontend**: Next.js 14, Tailwind CSS, Google Maps API, Zustand, Socket.io-client
- **Backend**: Node.js, Express, Socket.io, JWT, Twilio SDK, Firebase Admin
- **Database**: Supabase (PostgreSQL)
- **Cache / PubSub**: Upstash Redis
- **AI Service**: Python FastAPI (Scikit-learn)

## Project Structure

```text
/frontend      - Next.js Web App (Student, Driver, Admin dashboards)
/backend       - Node.js Express Server (REST API + WebSockets)
/database      - Supabase PostgreSQL schema and scripts
/ai-service    - Python FastAPI microservice
```

## Setup Instructions

### 1. Database Setup (Supabase)
Create a new project on [Supabase.com](https://supabase.com/).
Go to SQL Editor and run the contents of `/database/schema.sql`.

### 2. Backend Setup
1. Open the `/backend` folder.
2. Ensure you have Node.js installed.
3. Run `npm install`.
4. Copy `.env.example` to `.env` and fill in your Supabase, Redis, and JWT secrets.
5. Run `npm run dev` to start the server on `http://localhost:5000`.

### 3. Frontend Setup
1. Open the `/frontend` folder.
2. Run `npm install` (or `yarn`).
3. Copy `.env.example` to `.env` and configure your `NEXT_PUBLIC_GOOGLE_MAPS_KEY`.
4. Run `npm run dev` to start the client on `http://localhost:3000`.

### 4. AI Microservice Setup
1. Open `/ai-service`.
2. Run `pip install -r requirements.txt`.
3. Run `uvicorn main:app --host 0.0.0.0 --port 8000 --reload`.

## Features
- **Multi-Tenant Architecture**: Supports isolated deployments for many colleges via unique college codes.
- **Glassmorphism UI**: High-end UX design using Tailwind CSS, beautiful gradients, and micro-animations.
- **Real-Time GPS**: Drivers broadcast their coordinates at up to 5hz via `navigator.geolocation` linked to Socket.io and buffered via Redis.
- **Student Dashboard**: Live map view of active trips.
- **Driver Console**: Simple "Start Trip" / "Stop Trip" logic.
- **Admin Analytics**: View active routes and manage fleets.
