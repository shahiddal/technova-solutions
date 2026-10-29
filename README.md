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
- Enquiry form (name, email, phone, company, service, message) saved to MongoDB, with optional email notification
- "Enquire Now" buttons on service and project pages preselect the service/project
- Server-side validation (required fields, email format, length limits)
- Rate limiting on the contact and enquiry APIs (5 requests per IP every 15 minutes)
- Spam honeypot and duplicate-submit protection on enquiries
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
| `RESEND_API_KEY` | [Resend](https://resend.com) API key for enquiry emails (server only, never in the client) |
| `MAIL_FROM` | Sender address for enquiry emails; its domain must be verified in Resend |
| `ENQUIRY_EMAIL_TO` | Inbox that receives new enquiry notifications |

Email notifications are sent only when `RESEND_API_KEY`, `MAIL_FROM` and `ENQUIRY_EMAIL_TO` are all set; otherwise enquiries are just saved to MongoDB. The email is sent after the enquiry is saved; if it fails, the failure is logged and the visitor still gets the normal success response.

**client/.env**

| Variable       | Description                                  |
| -------------- | -------------------------------------------- |
| `VITE_API_URL` | Backend URL (default `http://localhost:5000`) |

## Content (services, projects, blogs)

Content lives in MongoDB and the site reads it from the public API. The files in
`client/src/data/` (`services.js`, `projects.js`, `blogs.js`) are the seed source:
the frontend no longer imports them.

```bash
cd server
npm run seed   # imports client/src/data into the database from MONGO_URI
```

The seed upserts by `slug`, so it is safe to run again: it never creates duplicates,
never deletes anything and only touches the `services`, `projects` and `blogs`
collections. New items are created as published; re-seeding doesn't re-publish an
item that was unpublished later.

| Method | Endpoint                  | Returns                                   |
| ------ | ------------------------- | ----------------------------------------- |
| `GET`  | `/api/services`           | Published services (card fields), in order |
| `GET`  | `/api/services/:slug`     | One published service                      |
| `GET`  | `/api/projects`           | Published projects (card fields), in order |
| `GET`  | `/api/projects/:slug`     | One published project                      |
| `GET`  | `/api/blogs`              | Published articles (card fields), in order |
| `GET`  | `/api/blogs/:slug`        | One published article                      |

Responses are `{ "success": true, "data": ... }`; an unknown or unpublished slug returns
`404 { "success": false, "message": "Service not found" }` (or Project / Article).

## API

### `POST /api/enquiries`

Request body:

```json
{
  "name": "Asha Patel",
  "email": "asha@example.com",
  "phone": "+91 98765 43210",
  "company": "Clinic Co",
  "service": "web-development",
  "project": "company-website",
  "message": "We need a new website for our clinic."
}
```

`company` and `project` are optional. `service` must be the slug of a published service (from the `services` collection) or `other`. `message` needs at least 20 characters.

| Status | Meaning                                                     |
| ------ | ----------------------------------------------------------- |
| `201`  | Enquiry saved (status `new`)                                |
| `200`  | Same email + message within 10 minutes, not saved again     |
| `400`  | Invalid fields; `errors` maps each field to a message       |
| `429`  | Too many requests                                           |
| `500`  | Server or database error                                    |

Run the backend tests with `npm test` in `server/`. The content API and seed tests need a
throwaway database whose name ends in `_test`:

```bash
TEST_MONGO_URI=mongodb://127.0.0.1:27017/technova_test npm test
```


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
