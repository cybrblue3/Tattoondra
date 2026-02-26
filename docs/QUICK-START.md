# Quick Start Guide

Welcome to Tattoondra! Here's everything you need to get started TODAY.

---

## 📁 Project Structure

```
Tattoondra/
│
├── README.md                    # Project overview
├── SETUP-INSTRUCTIONS.md        # Detailed setup steps
├── .gitignore                   # Git ignore rules
│
├── frontend/                    # React + Vite PWA
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   ├── pages/              # Page components
│   │   ├── services/           # API calls
│   │   ├── hooks/              # Custom React hooks
│   │   └── utils/              # Helper functions
│   ├── public/                 # Static assets
│   ├── .env                    # Frontend environment variables
│   └── package.json
│
├── backend/                     # Node.js + Express + Prisma
│   ├── src/
│   │   ├── routes/             # API route definitions
│   │   ├── controllers/        # Request handlers
│   │   ├── middleware/         # Auth, validation, etc.
│   │   └── services/           # Business logic
│   ├── prisma/
│   │   ├── schema.prisma       # Database schema (ALREADY DONE ✅)
│   │   └── migrations/         # Database migrations
│   ├── .env                    # Backend environment variables
│   └── package.json
│
└── docs/                        # Documentation
    ├── 8-week-roadmap.md       # Week-by-week plan
    ├── database-schema.md      # ERD and schema details
    ├── tech-stack-rationale.md # Why we chose each tech
    ├── weekly-progress-tracker.md  # Log your progress
    └── QUICK-START.md          # This file
```

---

## 🚀 Your First 3 Hours (TODAY)

### Hour 1: Environment Setup

1. **Install Node.js** (if not already)
   ```bash
   node --version  # Should be 18 or higher
   ```

2. **Create PostgreSQL database**
   - Option A: Sign up for Railway → Create PostgreSQL
   - Option B: Sign up for Supabase → Create project
   - Copy the DATABASE_URL

3. **Set up backend**
   ```bash
   cd backend
   npm install
   cp .env.example .env
   # Edit .env and paste your DATABASE_URL
   ```

### Hour 2: Database Setup

1. **Run migrations**
   ```bash
   npx prisma migrate dev --name init
   ```

2. **Open Prisma Studio** (view your database)
   ```bash
   npx prisma studio
   ```
   Opens at http://localhost:5555 - you should see your tables!

3. **Start backend**
   ```bash
   npm run dev
   ```
   Visit http://localhost:5000/health - should see JSON response

### Hour 3: Frontend Setup

1. **Create React app**
   ```bash
   cd ..  # Back to Tattoondra root
   npm create vite@latest frontend -- --template react
   cd frontend
   npm install
   ```

2. **Install Material-UI**
   ```bash
   npm install @mui/material @mui/icons-material @emotion/react @emotion/styled
   npm install react-router-dom axios date-fns
   ```

3. **Start frontend**
   ```bash
   npm run dev
   ```
   Visit http://localhost:5173 - should see React + Vite page

---

## ✅ Week 1 Checklist

**By end of Week 1, you should have:**

- [ ] GitHub repo created
- [ ] Backend running locally (http://localhost:5000/health works)
- [ ] Frontend running locally (http://localhost:5173 works)
- [ ] Database connected (Prisma Studio shows tables)
- [ ] Clerk account created (get API keys)
- [ ] Backend deployed to Railway
- [ ] Frontend deployed to Vercel
- [ ] Production URLs working

**If all checked ✅ → You're AHEAD OF SCHEDULE!**

---

## 🔗 Important Links

### Services You Need to Sign Up For

1. **Railway** (database + backend hosting)
   - https://railway.app
   - Free tier: $5 credit/month

2. **Vercel** (frontend hosting)
   - https://vercel.com
   - Free tier: Unlimited

3. **Clerk** (authentication)
   - https://clerk.com
   - Free tier: 5,000 users

4. **Resend** (email notifications - Week 3)
   - https://resend.com
   - Free tier: 100 emails/day

### Documentation

- React: https://react.dev
- Vite: https://vitejs.dev
- Prisma: https://prisma.io/docs
- Express: https://expressjs.com
- Material-UI: https://mui.com

---

## 🆘 Common Issues & Fixes

### "npx: command not found"
**Fix:** Install Node.js from https://nodejs.org

### "Cannot connect to database"
**Fix:**
1. Check DATABASE_URL in `.env`
2. Make sure PostgreSQL is running
3. Try `npx prisma generate`

### "Port 5000 already in use"
**Fix:** Change PORT in `backend/.env` to 5001

### "Module not found"
**Fix:**
```bash
rm -rf node_modules
npm install
```

### Prisma errors after schema changes
**Fix:**
```bash
npx prisma generate
npx prisma migrate dev
```

---

## 📋 Daily Workflow

### Starting Work Each Day

```bash
# Terminal 1: Backend
cd backend
npm run dev

# Terminal 2: Frontend
cd frontend
npm run dev

# Terminal 3: Database GUI (optional)
cd backend
npx prisma studio
```

### Before Committing Code

```bash
# Make sure everything works
cd backend
npm run dev  # Test backend

cd frontend
npm run build  # Test if production build works
```

### End of Day Commit

```bash
git add .
git commit -m "Day X: [what you accomplished]"
git push
```

---

## 💡 Pro Tips

### For Luis (Project Lead)
- Review Martín's pull requests before merging
- Keep `docs/weekly-progress-tracker.md` updated every Friday
- Schedule 15min daily sync with Martín
- Test on real phone weekly (not just browser)

### For Both Developers
- **Never commit `.env` files** (they're gitignored)
- **Test on mobile viewport** in Chrome DevTools
- **Comment complex code** - you'll forget why you wrote it
- **Deploy every Friday** - catch issues early
- **Ask me (Claude) when stuck** - don't waste hours debugging alone

### Debugging Tricks
```javascript
// Backend debugging
console.log('DEBUG:', JSON.stringify(data, null, 2));

// Frontend debugging
console.log('%c DEBUG', 'color: red; font-size: 20px;', data);

// Database debugging
npx prisma studio  // Visual database browser
```

---

## 🎯 Success Metrics

### Week 1 Success =
✅ Both frontend + backend deployed and accessible online

### Week 4 Success =
✅ You can book an appointment end-to-end (client form → database)

### Week 8 Success =
✅ Alejandra is using the system daily

---

## 📞 When to Ask for Help

**Ask me (Claude) immediately if:**
- Stuck on same issue > 30 minutes
- Production is broken
- Don't understand a concept
- Need architecture guidance
- Security concerns

**Ask Alejandra if:**
- Unclear requirements
- Need design feedback
- Business logic questions
- Testing with real data

---

## 🔥 Week 1 TODO (Start NOW)

### Today (Day 1)
- [ ] Set up Railway PostgreSQL
- [ ] Install backend dependencies
- [ ] Run database migrations
- [ ] Test backend health endpoint

### Tomorrow (Day 2)
- [ ] Create React app
- [ ] Install Material-UI
- [ ] Deploy backend to Railway
- [ ] Get Clerk API keys

### Day 3
- [ ] Deploy frontend to Vercel
- [ ] Connect frontend to backend API
- [ ] Test production deployment

### Day 4-5
- [ ] Integrate Clerk authentication
- [ ] Create GitHub repo
- [ ] Add Martín as collaborator
- [ ] Set up CI/CD

### Weekend
- [ ] Review Week 2 roadmap
- [ ] Plan first feature (landing page)
- [ ] Rest! 😄

---

## 🎓 Learning Resources (Bookmark These)

### React Basics
- Official Tutorial: https://react.dev/learn
- YouTube: Traversy Media - React Crash Course

### Express API
- YouTube: Web Dev Simplified - Express Tutorial
- Docs: https://expressjs.com/en/starter/hello-world.html

### Prisma
- Get Started: https://www.prisma.io/docs/getting-started
- Schema Reference: https://www.prisma.io/docs/reference/api-reference/prisma-schema-reference

### Material-UI Components
- Component Demos: https://mui.com/material-ui/getting-started/
- Templates: https://mui.com/material-ui/getting-started/templates/

---

## 🚨 Red Flags to Avoid

**DON'T:**
- ❌ Commit `.env` files
- ❌ Store passwords in code
- ❌ Skip testing before deploying
- ❌ Work on `main` branch (use feature branches)
- ❌ Copy-paste code you don't understand
- ❌ Ignore errors ("it works on my machine")
- ❌ Skip comments on complex logic

**DO:**
- ✅ Test on mobile viewport constantly
- ✅ Commit small, focused changes
- ✅ Write descriptive commit messages
- ✅ Keep Alejandra updated weekly
- ✅ Document decisions in thesis notes
- ✅ Celebrate small wins with Martín!

---

## 🎉 You Got This!

Remember:
- **Perfect is the enemy of done** - Ship MVP, iterate later
- **Ask questions** - No such thing as a dumb question
- **Help each other** - You and Martín are a team
- **Learn deeply** - This is YOUR portfolio project
- **Have fun** - You're building something REAL!

**Let's build something amazing for Alejandra! 🚀**

---

**Next Step:** Open `SETUP-INSTRUCTIONS.md` and start Step 1.

Good luck, Wicho! 💪
