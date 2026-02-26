# 8-Week Development Roadmap

**Project:** Tattoondra Management System
**Start Date:** Week of Feb 22, 2026
**Due Date:** 2 months from start
**Team Capacity:** 48 hours/week average

---

## WEEK 1: Foundation & Infrastructure
**Goal:** Working dev environment + deployed Hello World + database ready

### Deliverables
- [ ] GitHub repo created with proper structure
- [ ] Frontend (React+Vite) running locally
- [ ] Backend (Node+Express+Prisma) running locally
- [ ] PostgreSQL database connected
- [ ] Authentication provider integrated (Clerk)
- [ ] Both deployed to production (Vercel + Railway)
- [ ] Database schema designed and migrated

### Tasks
1. Initialize React + Vite project
2. Initialize Node + Express + Prisma backend
3. Set up PostgreSQL on Railway/Supabase
4. Design database schema
5. Run first Prisma migration
6. Integrate Clerk authentication
7. Deploy frontend to Vercel
8. Deploy backend to Railway
9. Test production connection

**Hours Estimate:** 40-48 hours

---

## WEEK 2: Client Booking - Frontend
**Goal:** Clients can see available slots and fill booking form

### Deliverables
- [ ] Landing page for clients
- [ ] Calendar view showing available dates
- [ ] Booking form (name, email, phone, date, time, description)
- [ ] Informed consent checkbox/form
- [ ] Responsive mobile design (PRIORITY)

### Tasks
1. Create landing page layout
2. Implement date picker component
3. Build booking form with validation
4. Add informed consent modal/page
5. Mobile responsiveness testing
6. Form state management

**Hours Estimate:** 40-48 hours

---

## WEEK 3: Client Booking - Backend + Integration
**Goal:** Bookings save to database, Alejandra gets notified

### Deliverables
- [ ] API endpoints for bookings (CRUD)
- [ ] Appointment creation logic
- [ ] Deposit calculation (standard $200 or 30%)
- [ ] Email/SMS notification to Alejandra
- [ ] Booking confirmation to client
- [ ] Frontend-backend integration complete

### Tasks
1. Create booking controller
2. Create booking service layer
3. Implement deposit calculation logic
4. Set up email service (Resend/SendGrid)
5. Set up SMS service (Twilio - optional)
6. Connect frontend to backend APIs
7. Test full booking flow end-to-end

**Hours Estimate:** 40-48 hours

---

## WEEK 4: Admin Dashboard - Appointment Management
**Goal:** Alejandra can manage everything from her phone/laptop

### Deliverables
- [ ] Admin login (protected routes)
- [ ] Dashboard overview (today's appointments, pending confirmations)
- [ ] Appointment list (filter by date, status, client)
- [ ] Appointment detail view (client info, deposit status, edit/cancel)
- [ ] Calendar view for Alejandra
- [ ] Block/unblock dates functionality
- [ ] Mark deposit as received

### Tasks
1. Create admin layout and navigation
2. Build dashboard overview page
3. Implement appointment list with filters
4. Create appointment detail page
5. Add edit/cancel appointment functionality
6. Build admin calendar view
7. Implement date blocking feature
8. Add deposit confirmation toggle
9. Mobile admin UI testing

**Hours Estimate:** 40-48 hours

---

## WEEK 5: Client Management + Finance Basics
**Goal:** Client records organized + basic payment tracking

### Deliverables
- [ ] Client database (all info from bookings)
- [ ] Client detail view (contact info, appointment history, consent status)
- [ ] Payment recording (cash, transfer, amount, date)
- [ ] Session payment status (deposit, fully paid, pending)
- [ ] Basic finance dashboard (total revenue, pending payments)

### Tasks
1. Create client list page
2. Build client detail page
3. Implement payment recording form
4. Create payment tracking logic
5. Build finance dashboard overview
6. Add payment status indicators
7. Calculate totals and summaries

**Hours Estimate:** 40-48 hours

---

## WEEK 6: Finance Reports + Polish
**Goal:** Financial tracking complete + UX improvements

### Deliverables
- [ ] Monthly revenue report
- [ ] Payment method breakdown (cash vs transfer)
- [ ] Export reports (CSV/PDF)
- [ ] UI/UX improvements based on feedback
- [ ] Mobile optimization pass

### Tasks
1. Implement monthly reports
2. Add payment type analytics
3. Build CSV export functionality
4. Add PDF export (optional - use jsPDF)
5. Conduct UX review with Alejandra
6. Implement feedback improvements
7. Mobile UI polish

**Hours Estimate:** 40-48 hours

---

## WEEK 7: Inventory Management (MVP - Simple Approach)
**Goal:** Basic stock tracking operational

**IMPORTANT:** Using simplified inventory approach (Option 4)
- Manual stock updates only (add/remove)
- No per-session tracking (can be added post-MVP if needed)
- Focus on low stock alerts (main value for Alejandra)

### Deliverables
- [ ] Material/tool database (name, quantity, category, threshold, cost)
- [ ] Add/edit/delete materials
- [ ] Manual "Add Stock" button (when purchasing supplies)
- [ ] Manual "Remove Stock" button (adjustments)
- [ ] Low stock alerts (<25%)
- [ ] Inventory dashboard with status indicators

### Tasks
1. Create Material model API endpoints (CRUD)
2. Build materials list view (with filters: all/low stock)
3. Create add/edit material form
4. Implement "Add Stock" modal
5. Implement "Remove Stock" modal
6. Build inventory dashboard widget for main dashboard
7. Implement low stock alert logic
8. Add red/yellow/green status indicators
9. Test full inventory flow

**Hours Estimate:** 25-30 hours (reduced from original 35-40)

**Why Simple?**
- Gets 80% of value (knowing when to restock)
- Zero workflow friction for Alejandra
- Can add session tracking later if she requests it

---

## WEEK 8: Testing, Deployment, Documentation
**Goal:** Production-ready system + thesis documentation

### Deliverables
- [ ] Full system testing (all user flows)
- [ ] Bug fixes
- [ ] Performance optimization
- [ ] Final deployment
- [ ] User guide for Alejandra (PDF/video)
- [ ] Technical documentation for thesis
- [ ] Code documentation (comments, README)
- [ ] Handoff meeting with Alejandra

### Tasks
1. End-to-end testing (client booking flow)
2. End-to-end testing (admin flow)
3. Bug fixing sprint
4. Performance audit (Lighthouse)
5. Optimize images and assets
6. Create user guide document
7. Record tutorial video (optional)
8. Write technical documentation
9. Add code comments and README updates
10. Final deployment to production
11. Training session with Alejandra
12. Gather feedback for post-MVP improvements

**Hours Estimate:** 40-48 hours

---

## Risk Mitigation

### Potential Blockers
1. **Authentication issues** - Mitigate: Use Clerk (handles complexity)
2. **Database hosting limits** - Mitigate: Railway free tier sufficient for MVP
3. **SMS/Email delivery** - Mitigate: Start with email only (Resend free tier)
4. **Scope creep** - Mitigate: Strict MVP adherence, log future features
5. **Mobile responsiveness bugs** - Mitigate: Test on real devices weekly

### Buffer Time
- Each week has 48 hours available
- Tasks estimated at 40-48 hours
- Built-in buffer for blockers

---

## Success Metrics

### Week 4 Checkpoint
- [ ] Client can book appointment end-to-end
- [ ] Alejandra can view and manage bookings
- [ ] System deployed and accessible online

### Week 6 Checkpoint
- [ ] All payments tracked digitally
- [ ] Alejandra has financial visibility
- [ ] No critical bugs

### Week 8 Final
- [ ] All MVP features complete
- [ ] Alejandra actively using system
- [ ] Zero downtime in production
- [ ] Documentation complete for thesis

---

## Post-MVP Roadmap (After 2 Months)

### Future Enhancements
- Multi-artist calendar support
- Receptionist role and permissions
- Automated payment processing (Stripe/PayPal)
- Client portal (view history, rebook)
- Advanced analytics and reporting
- Invoice generation
- SMS reminders (automated)
- Gallery/portfolio integration
- WhatsApp integration
- Mobile app (React Native)

---

## Notes
- Weekly check-ins with Alejandra every Friday
- Daily standups between Luis and Martín
- Deploy to production every Friday (continuous delivery)
- Document blockers immediately in GitHub Issues
- Keep thesis documentation updated weekly
