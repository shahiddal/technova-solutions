# TechNova Solutions

A responsive IT company website built with the MERN stack (MongoDB, Express, React, Node.js).

## Tech Stack

- **Frontend:** React 19, React Router, Tailwind CSS, Axios, Vite
- **Backend:** Node.js, Express 5, Mongoose
- **Database:** MongoDB

## Features

- Responsive dark UI (mobile, tablet, desktop)
- Pages: Home, About, Services, Portfolio, Blog, Contact
- Detail pages for each service, project and blog post
- 404 page for unknown URLs
- Contact form saved to MongoDB through a REST API
- Server-side validation (required fields, email format, length limits)
- Rate limiting on the contact API (5 requests per IP every 15 minutes)
- CORS restricted to the frontend URL

## Project Structure

```
technova-solutions/
├── client/                # React frontend (Vite)
│   └── src/
│       ├── components/    # Navbar, Footer
│       └── Pages/         # Page components
└── server/                # Express backend
    ├── config/            # MongoDB connection
    ├── controllers/       # Request handlers
    ├── models/            # Mongoose models
    ├── routes/            # API routes
    └── server.js          # App entry point
```

## Run Locally

### 1. Backend

```bash
cd server
npm install
cp .env.example .env   # then fill in MONGO_URI
npm run dev
```

The API runs on `http://localhost:5000`.

### 2. Frontend

```bash
cd client
npm install
cp .env.example .env   # optional, defaults to http://localhost:5000
npm run dev
```

The site runs on `http://localhost:5173`.

## Environment Variables

**server/.env**

| Variable      | Description                                         |
| ------------- | --------------------------------------------------- |
| `PORT`        | API port (default `5000`)                           |
| `MONGO_URI`   | MongoDB connection string                           |
| `CLIENT_URL`  | Allowed frontend URL(s) for CORS, comma-separated (default `http://localhost:5173`) |
| `DNS_SERVERS` | Optional DNS servers if SRV lookups fail on your network |

**client/.env**

| Variable       | Description                                  |
| -------------- | -------------------------------------------- |
| `VITE_API_URL` | Backend URL (default `http://localhost:5000`) |

## API

### `POST /api/contact`

Request body:

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "subject": "New project",
  "message": "I would like to discuss a website."
}
```

| Status | Meaning                                   |
| ------ | ----------------------------------------- |
| `201`  | Message saved                             |
| `400`  | Missing, invalid or too-long fields       |
| `429`  | Too many requests                         |
| `500`  | Server or database error                  |
