# Tattoondra Setup Instructions

Follow these steps to get your development environment running.

## Prerequisites

Make sure you have installed:
- **Node.js 18+** (check with `node --version`)
- **npm** (comes with Node.js)
- **Git**
- **PostgreSQL** (or use a cloud service like Railway/Supabase)

---

## Step 1: Backend Setup

### 1.1 Install Dependencies

```bash
cd backend
npm install
```

### 1.2 Set Up Database

**Option A: Local PostgreSQL**
1. Install PostgreSQL locally
2. Create a database: `createdb tattoondra`
3. Copy `.env.example` to `.env`
4. Update `DATABASE_URL` in `.env`:
   ```
   DATABASE_URL="postgresql://postgres:password@localhost:5432/tattoondra?schema=public"
   ```

**Option B: Railway (Recommended for beginners)**
1. Go to https://railway.app
2. Sign up (free tier available)
3. Create new project → Add PostgreSQL
4. Copy the DATABASE_URL from Railway
5. Copy `.env.example` to `.env`
6. Paste DATABASE_URL in `.env`

**Option C: Supabase**
1. Go to https://supabase.com
2. Create new project
3. Go to Project Settings → Database
4. Copy Connection String (URI)
5. Copy `.env.example` to `.env`
6. Paste as DATABASE_URL in `.env`

### 1.3 Run Database Migrations

```bash
npx prisma migrate dev --name init
```

This creates all the tables in your database.

### 1.4 (Optional) Open Prisma Studio

To view your database visually:

```bash
npx prisma studio
```

Opens at http://localhost:5555

### 1.5 Start Backend Server

```bash
npm run dev
```

Backend should be running at http://localhost:5000

Test it: http://localhost:5000/health

---

## Step 2: Frontend Setup

### 2.1 Initialize React + Vite

**From the root `Tattoondra/` directory:**

```bash
npm create vite@latest frontend -- --template react
```

When prompted:
- Select: React
- Select: JavaScript

### 2.2 Install Dependencies

```bash
cd frontend
npm install
```

### 2.3 Install Additional Packages

```bash
npm install @mui/material @mui/icons-material @emotion/react @emotion/styled
npm install react-router-dom axios date-fns
npm install -D @vitejs/plugin-react
```

### 2.4 Install PWA Plugin

```bash
npm install -D vite-plugin-pwa
```

### 2.5 Create Environment File

Create `frontend/.env`:

```env
VITE_API_URL=http://localhost:5000
VITE_CLERK_PUBLISHABLE_KEY=your-clerk-key-here
```

### 2.6 Start Frontend

```bash
npm run dev
```

Frontend should be running at http://localhost:5173

---

## Step 3: Authentication Setup (Clerk)

### 3.1 Create Clerk Account

1. Go to https://clerk.com
2. Sign up (free tier available)
3. Create new application
4. Choose: Email + Password for now

### 3.2 Get API Keys

1. In Clerk Dashboard → API Keys
2. Copy **Publishable Key** → paste in `frontend/.env` as `VITE_CLERK_PUBLISHABLE_KEY`
3. Copy **Secret Key** → paste in `backend/.env` as `CLERK_SECRET_KEY`

### 3.3 Install Clerk SDK

**Frontend:**
```bash
cd frontend
npm install @clerk/clerk-react
```

**Backend:**
```bash
cd backend
npm install @clerk/clerk-sdk-node
```

---

## Step 4: Verify Everything Works

### 4.1 Check Backend

1. Backend running: http://localhost:5000/health
2. Should return JSON: `{ "status": "ok", ... }`

### 4.2 Check Frontend

1. Frontend running: http://localhost:5173
2. Should see Vite + React default page

### 4.3 Check Database

```bash
cd backend
npx prisma studio
```

You should see all your tables (User, Appointment, Payment, etc.)

---

## Step 5: First Deployment Test (Week 1 Goal)

### 5.1 Deploy Frontend to Vercel

1. Go to https://vercel.com
2. Sign up with GitHub
3. Import your GitHub repo
4. Select `frontend` folder as root directory
5. Set environment variables:
   - `VITE_API_URL` = your backend URL (from Railway)
   - `VITE_CLERK_PUBLISHABLE_KEY` = your Clerk key
6. Deploy

### 5.2 Deploy Backend to Railway

1. Go to https://railway.app
2. New Project → Deploy from GitHub
3. Select your repo
4. Select `backend` folder
5. Set environment variables (all from `.env`)
6. Deploy

### 5.3 Update CORS

In `backend/src/server.js`, update CORS origin to your Vercel URL:

```javascript
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://your-app.vercel.app'
  ],
  credentials: true
}));
```

---

## Troubleshooting

### Backend won't start
- Check if PostgreSQL is running
- Verify DATABASE_URL in `.env`
- Run `npx prisma generate`

### Frontend won't start
- Delete `node_modules` and run `npm install` again
- Check for port conflicts (5173 already in use)

### Database errors
- Run `npx prisma migrate reset` (WARNING: deletes all data)
- Then `npx prisma migrate dev`

### Prisma errors
- Run `npx prisma generate` after any schema changes
- Restart your dev server

---

## Next Steps

Once everything is running:

1. ✅ Create a GitHub repository
2. ✅ Push your code:
   ```bash
   git init
   git add .
   git commit -m "Initial setup"
   git remote add origin YOUR_GITHUB_URL
   git push -u origin main
   ```
3. ✅ Start Week 2 tasks (Client booking frontend)

---

## Quick Reference

**Backend commands:**
```bash
npm run dev          # Start dev server
npm run start        # Production server
npx prisma studio    # Open database GUI
npx prisma migrate dev  # Run migrations
```

**Frontend commands:**
```bash
npm run dev          # Start dev server
npm run build        # Build for production
npm run preview      # Preview production build
```

---

## Need Help?

- Prisma docs: https://www.prisma.io/docs
- Vite docs: https://vitejs.dev
- Material-UI docs: https://mui.com
- Clerk docs: https://clerk.com/docs
- Express docs: https://expressjs.com

Ask me (Claude) if you get stuck!
