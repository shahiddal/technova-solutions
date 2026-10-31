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
| `ADMIN_AUTH_SECRET` | Secret that signs admin sessions (32+ random characters); admin login is off without it |
| `ADMIN_EMAIL` | Optional default email for `npm run create-admin` |
| `ADMIN_PROXY_SECRET` | Production only, same value on Render and Vercel: locks `/api/admin` to the Vercel proxy |
| `NODE_ENV` | Set to `production` on the server so the admin cookie is always `Secure` |

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

## Admin

A single admin signs in at `/admin/login` and lands on `/admin/dashboard`. There is no
public signup.

**Setup**

1. Set `ADMIN_AUTH_SECRET` in `server/.env` (at least 32 random characters):
   `node -e "console.log(require('crypto').randomBytes(48).toString('base64url'))"`
2. Create the admin (or reset its password) from `server/`:
   `npm run create-admin`. It shows the target database and asks you to type its name
   to confirm, then asks for the email (default `ADMIN_EMAIL`) and the password twice
   without echoing it. Passwords need at least 12 characters. Only one admin account
   can exist.

**How it works**

- Passwords are stored as bcrypt hashes (cost 12).
- Login sets `technova_admin`: a signed JWT (HS256, 8 hours) holding only the admin id
  and a session version, in an `httpOnly`, `SameSite=Strict` cookie limited to
  `/api/admin`. It is `Secure` over HTTPS and always when `NODE_ENV=production`.
- Logout clears the cookie and bumps the session version, so old tokens stop working.
  Resetting the password does the same.
- Failed logins are limited to 5 per visitor IP and 20 in total per 15 minutes.
- `requireAdmin` (server/middleware/requireAdmin.js) protects admin APIs and returns
  JSON 401 when there is no valid session.
- The browser always calls `/api/admin` on the site's own origin: the Vite dev/preview
  proxy forwards it to `VITE_API_URL` locally, and the Vercel rewrite in
  `client/vercel.json` forwards it to Render in production. That keeps the cookie
  first-party (Safari and Firefox block third-party cookies), and CORS never needs
  credentials. The public API is still called directly at `VITE_API_URL`.
- In production, set the same `ADMIN_PROXY_SECRET` on Render and Vercel. The Vercel
  route sets it as the `x-technova-proxy-secret` header (a transform in `vercel.json`),
  and the API answers `403` to admin requests without it, so nobody can reach the admin
  API around Vercel. Only for those verified requests is the first `X-Forwarded-For`
  entry (written by Vercel) used as the visitor IP for login limits; otherwise `req.ip`.
  Leave it unset locally.

| Method | Endpoint               | Auth     |
| ------ | ---------------------- | -------- |
| `POST` | `/api/admin/login`     | Public   |
| `POST` | `/api/admin/logout`    | Public   |
| `GET`  | `/api/admin/me`        | Admin    |
| `GET`  | `/api/admin/dashboard` | Admin    |

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
