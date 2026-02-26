# Tattoondra - Tattoo Studio Management System

**Internal admin dashboard** for Tattoondra tattoo studio, enabling Alejandra to manage appointments, clients, finances, and inventory from her phone or laptop.

## 👥 Team
- **Luis (Wicho)** - Project Lead & Full-Stack Developer
- **Martín** - Full-Stack Developer
- **Alejandra** - Client (Studio Owner)

## 📋 Project Overview

**What it is:** A mobile-first web application (PWA) that Alejandra uses to manage her entire tattoo business.

**Who uses it:** ONLY Alejandra (admin dashboard - not for clients)

**Timeline:** 8 weeks (2 months)

**Tech Stack:**
- Frontend: React + Vite + Material-UI (PWA)
- Backend: Node.js + Express + Prisma
- Database: PostgreSQL
- Auth: Simple JWT (admin only)
- Hosting: Vercel (frontend) + Railway (backend)
- Integration: Google Calendar API

## 🎯 MVP Features (Weeks 1-8)

### Phase 1: Client Management (Weeks 2-3)
- Add/edit/view clients
- Client detail pages with appointment history
- Search and filter clients
- Digital consent form tracking

### Phase 2: Appointment Management (Week 4)
- Alejandra creates appointments manually
- Link appointments to clients
- Deposit tracking ($200 MXN or 30% for >$2000)
- Google Calendar integration (embed + API sync)
- View upcoming appointments

### Phase 3: Finance Tracking (Weeks 5-6)
- Payment recording (cash/bank transfer)
- Track deposits and final payments
- Payment status per appointment
- Monthly revenue reports
- Export to CSV/PDF

### Phase 4: Inventory Management (Week 7)
- **Simple approach:** Manual stock updates only
- Add/edit/delete materials
- "Add Stock" and "Remove Stock" buttons
- Low stock alerts (<25%)
- Inventory dashboard

### Phase 5: Polish & Deploy (Week 8)
- Testing & bug fixes
- Mobile responsiveness optimization
- Performance optimization
- User guide for Alejandra
- Production deployment
- Documentation for thesis

## 🔑 Key Decisions

**Why NOT a client-facing booking system?**
- Alejandra prefers full control over her schedule
- She decides when to work and who to book
- Clients contact her via WhatsApp/social media
- She manually creates appointments in the system

**Why simple inventory (no per-session tracking)?**
- Gets 80% of value (knowing when to restock)
- Takes 2-3 days to build vs. 1 week
- Zero workflow friction
- Can add detailed tracking post-MVP if requested

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL database
- Git

### Installation

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

**Backend:**
```bash
cd backend
npm install
npx prisma generate
npx prisma migrate dev
npm run dev
```

## 📁 Project Structure
```
tattoondra/
├── frontend/          # React + Vite PWA
├── backend/           # Node + Express + Prisma
└── docs/              # Documentation & thesis
```

## 🔗 Links
- **Production URL:** TBD
- **Staging URL:** TBD
- **GitHub:** TBD

## 📝 License
Private - Tattoondra Studio © 2026
