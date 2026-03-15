# Weekly Progress Tracker

Use this document to track your progress each week. This will be valuable for your thesis documentation.

---

## WEEK 1: Foundation & Infrastructure
**Dates:** _feb 22 ___ to _feb28__
**Hours Logged:** _8 hours_

### Goals
- [x] GitHub repo created with proper structure
- [x] Frontend (React+Vite) running locally
- [x] Backend (Node+Express+Prisma) running locally
- [x] PostgreSQL database connected
- [x] Backend deployed to production (Railway) ✅ DONE TODAY!
- [x] Frontend deployed to production (Vercel)
- [x] Database schema designed and migrated

### What We Accomplished
- Fixed project naming (Tatoondra → Tattoondra) across 15 files
- Initialized Git repository and pushed to GitHub
- Tested backend locally - health endpoint working
- **Deployed backend to Railway successfully**
- **Deployed frontend to Vercel successfully**
- Production Frontend URL: https://tattoondra.vercel.app
- Both applications running in production environment
- Production URL: https://tattoondra-production.up.railway.app
- Verified production health check endpoint

### Challenges Faced
- Initial confusion about Railway's interface (environments vs services)
- Windows filename restrictions for screenshot names

### Solutions Found
- Found correct "New Service" → "Git Repo" flow in Railway
- Used simpler, Windows-safe filenames for screenshots
- Railway auto-detected PostgreSQL connection

### Learnings This Week
- Git workflow: init, add, commit, push, remote
- Difference between fetch and pull
- Railway deployment process from GitHub
- Production vs development environments
- Importance of documenting work as you go

### Next Week Priorities
- Implement JWT authentication system
- Begin client management features
- Start building appointment management (admin-only)

---

## WEEK 2: Authentication & Client Management
**Dates:** _____mar 02_____ to _____mar 10___
**Hours Logged:** ______

### Goals
- [X] JWT authentication implementation (backend + frontend)
- [X] Protected routes and auth middleware
- [X] Admin login functionality
- [X] Client management CRUD (backend + frontend)
- [X] Client list with search and autocomplete
- [X] Client create/edit/delete functionality
- [X] Supabase migration (URGENT)
- [ ] Appointment management system (admin creates/manages appointments)
- [ ] Optional: Marketing landing page (informational only, no booking)

### What We Accomplished
- **Migrated database from Railway to Supabase** (March 1-3)
  - Configured dual connection URLs (pooled + direct)
  - Created password field migration for User model
  - Verified database schema sync with 2 migrations
- **Built complete JWT authentication system - Backend** (March 8, Night)
  - Created authController.js with register and login endpoints
  - Implemented password hashing with bcrypt (10 salt rounds = 1,024 iterations)
  - Generated JWT tokens with 7-day expiration
  - Created authMiddleware.js for token verification
  - Built protected route pattern (/api/auth/me)
  - Tested all endpoints with Thunder Client
  - Verified user registration (Alejandra admin account created)
  - Confirmed login with JWT token generation
  - Validated protected route access with Bearer token
  - Tested security with invalid tokens (401 responses working)
- **Built complete authentication system - Frontend** (March 8, Day)
  - Installed axios and react-router-dom dependencies
  - Created AuthContext.jsx for global authentication state management
  - Implemented auto-login using localStorage (checks token on app initialization)
  - Built Login page with Material-UI (purple gradient design)
  - Created ProtectedRoute component for route security
  - Built Dashboard layout with welcome message and feature cards (Citas, Clientes, Pagos, Inventario)
  - Connected frontend to backend JWT API endpoints
  - Implemented logout functionality (clears localStorage and redirects)
  - Fixed CSS layout issues (removed Vite template constraints for fullscreen)
  - Tested complete end-to-end auth flow (login → dashboard → logout → refresh)
  - Captured 6 screenshots for thesis documentation
- **Built complete Client Management system - Full Stack** (March 10, Monday)
  - **Backend CRUD API** (clientController.js, clientRoutes.js)
    - Created getAllClients with search support (OR conditions for name/email/phone)
    - Implemented getClientById with appointment history inclusion
    - Built createClient (sets password to "N/A" - clients don't need login)
    - Built updateClient with validation
    - Implemented deleteClient with foreign key protection (blocks if appointments exist)
    - Protected all routes with JWT authentication middleware
    - Tested all 5 endpoints with Thunder Client successfully
  - **Frontend Client List Page** (Clients.jsx)
    - Built table view with Material-UI components
    - Implemented professional autocomplete search (Facebook/Instagram style)
    - Added debouncing (500ms delay) to prevent API spam
    - Created dropdown with absolute positioning (doesn't push content)
    - Implemented keyboard navigation (ArrowUp, ArrowDown, Enter, Escape)
    - Added wrap-around navigation (top ↔ bottom)
    - Limited autocomplete to 5 results for performance
    - Used useRef to maintain focus after results load
    - Added custom highlight color (light blue rgba(102, 126, 234, 0.15))
    - Implemented delete confirmation dialog
    - Fixed loading states (initial load vs search)
  - **Frontend Client Detail Page** (ClientDetail.jsx)
    - Shows complete client information (name, email, phone, registration date)
    - Displays appointment history
    - Edit and Delete buttons with navigation
    - Delete confirmation dialog with foreign key error handling
  - **Frontend Client Form** (ClientForm.jsx)
    - Single reusable component for both create and edit modes
    - Auto-detects mode via URL params (isEditMode = !!id)
    - Pre-fills form data in edit mode
    - Form validation (required fields, email regex)
    - Real-time error clearing on input
    - Different submit logic (POST vs PUT) based on mode
  - **Route Organization** (App.jsx)
    - Added 4 client routes in critical order:
      1. /dashboard/clients (list)
      2. /dashboard/clients/new (create - must be before :id)
      3. /dashboard/clients/:id/edit (edit)
      4. /dashboard/clients/:id (detail)
    - Made Dashboard Clients card clickable with hover effect
  - **Testing & Documentation**
    - Created 3 test clients (Maria Lopez, Juan Perez, Sofia Garcia)
    - Tested all 9 CRUD scenarios successfully
    - Captured 8 screenshots for thesis documentation
    - Committed: "feat: Complete client management system with CRUD, autocomplete search, and keyboard navigation"
    - Pushed to GitHub (257.57 KiB, 29 objects)

### Challenges Faced
- Understanding bcrypt salt rounds and hashing iterations
- Grasping JWT token structure (header, payload, signature)
- Learning Bearer token authentication standard format
- Understanding middleware execution flow and next() function
- Supabase dual-URL configuration (pooled vs direct connection)
- Understanding React Context vs localStorage (memory vs persistence)
- Grasping the complete refresh flow (how auto-login works step-by-step)
- Understanding why ProtectedRoute needs loading state (prevents flash of login page)
- Debugging layout issues (Vite template CSS constraining width to 1280px)
- Windows CMD multi-line commit message errors
- Search felt slow with immediate API calls (every keystroke triggered loading spinner)
- White screen blocking entire page during search (loading state too aggressive)
- Arrow keys stopped working after autocomplete results loaded (input lost focus)
- Missing comma in imports caused syntax error (Delete as DeleteIcon, People)
- Gray highlight in autocomplete dropdown was barely visible (#f0f0f0)
- Understanding React Router route order (why /new must come before /:id)
- Grasping debouncing concept (delaying API calls until user stops typing)
- Understanding autocomplete architecture (dropdown positioning, keyboard navigation)
- Learning how useRef maintains values between renders without causing re-renders
- Understanding wrap-around navigation logic (top ↔ bottom with modulo arithmetic)

### Solutions Found
- Learned that salt rounds = 2^n iterations (10 rounds = 1,024 hashes for security)
- Understood JWT payload is base64 encoded (readable) but signature provides security
- Discovered "Bearer <token>" is HTTP standard (RFC 6750) for token-based auth
- Realized middleware is like airport security - checks credentials before allowing access
- Configured DATABASE_URL for app queries, DIRECT_URL for migrations (PgBouncer limitation)
- Understood AuthContext = in-memory state (cleared on refresh), localStorage = persistent storage
- Learned complete refresh flow: localStorage → verify with backend → populate AuthContext → show dashboard
- Discovered ProtectedRoute loading state prevents UI flash while checking authentication
- Fixed layout by removing max-width constraint and centering styles from #root
- Used single-line commit messages for Windows CMD compatibility
- Implemented debouncing with setTimeout (500ms delay) and cleanup function
- Added isInitialLoad parameter to only show full-page loading on first fetch
- Used useRef to maintain input focus after state updates (searchInputRef.current.focus())
- Fixed import syntax by adding comma between imported items
- Changed highlight to brand-matching light blue rgba(102, 126, 234, 0.15)
- Learned route order matters: exact paths (/new) must come before dynamic params (/:id)
- Understood debouncing pattern: setTimeout + cleanup with return () => clearTimeout(timer)
- Learned autocomplete uses absolute positioning (position: absolute, top: '100%', zIndex: 1000)
- Discovered useRef persists values without triggering re-renders (perfect for focus management)
- Implemented wrap-around with modulo: next = (prev + 1) % length, previous = (prev - 1 + length) % length
- Realized single reusable form is better than separate create/edit components (DRY principle)

### Learnings This Week
- **Password Security:** Never store plain text passwords; bcrypt creates one-way hashes
- **Salt Rounds Trade-off:** More rounds = more secure but slower (10 is sweet spot)
- **JWT Structure:** Header (algorithm) + Payload (user data) + Signature (verification)
- **Token Expiration:** iat (issued at) and exp (expires) timestamps in Unix format
- **Middleware Pattern:** Code that runs between request and route handler
- **Supabase Architecture:** Connection pooling improves performance but requires direct URL for migrations
- **Bearer Token Standard:** Industry standard format for API authentication
- **Destructuring Trick:** Removing sensitive data from responses (password exclusion)
- **bcrypt.compare():** Why you can't use === to compare plain text vs hashed passwords
- **React Context API:** Global state management for sharing data across components
- **localStorage Persistence:** Survives page refreshes and browser restarts (unlike memory)
- **Auto-login Mechanics:** Check localStorage → verify token → populate state → render protected content
- **Protected Route Pattern:** Wrapper component that checks authentication before rendering children
- **Environment Variables in Vite:** Must prefix with VITE_ to expose to client-side code
- **AuthContext vs localStorage:** Context = temporary in-memory sharing, localStorage = permanent browser storage
- **Complete Auth Flow:** Login → save token → refresh → check localStorage → verify backend → stay logged in
- **Debouncing Pattern:** Delay action until user stops activity (wait 500ms after last keystroke before API call)
- **useRef Hook:** Maintains reference to DOM element or value without causing re-renders (unlike useState)
- **Cleanup Functions in useEffect:** Return function runs before next effect or unmount (clearTimeout prevents memory leaks)
- **Absolute Positioning:** Removes element from normal document flow (perfect for dropdowns that shouldn't push content)
- **Keyboard Event Handling:** preventDefault() stops default behavior (like scrolling on arrow keys)
- **Wrap-around Navigation:** Use modulo arithmetic for circular navigation (array indices loop from end to start)
- **React Router Route Order:** More specific routes must come before generic dynamic routes
- **Component Reusability:** Single component with conditional logic beats duplicate components (edit mode vs create mode)
- **Foreign Key Constraints:** Database prevents deleting records with related data (client with appointments)
- **Prisma OR Conditions:** Search multiple fields with { OR: [{ field1 }, { field2 }] } syntax
- **selectedIndex State:** Track keyboard navigation position independent of mouse hover
- **Form Validation Patterns:** Email regex /\S+@\S+\.\S+/, required field checks, real-time error clearing
- **HTTP Status Codes:** 409 Conflict for duplicate email, 400 Bad Request for foreign key violations

### Next Week Priorities
- ✅ ~~Client management features~~ (COMPLETED!)
- Implement appointment management system (CRUD - admin only)
- Build appointment list page with filters (date range, status, client)
- Create appointment detail view
- Design appointment creation/edit form (Alejandra creates appointments manually)
- Research Google Calendar API integration (sync appointments to Alejandra's calendar)
- Optional: Consider marketing landing page (informational only, no booking functionality)

---

## WEEK 3: Appointment Management & Payment Tracking
**Dates:** March 11 to March 15
**Hours Logged:** ______

### Goals
- [X] API endpoints for appointments (CRUD - admin only)
- [X] Appointment creation logic (Alejandra manually creates appointments)
- [X] Appointment status management (pending, confirmed, completed, cancelled)
- [X] Payment tracking (deposit received, balance paid, payment method)
- [X] Appointment list page with filters (date range, status, client)
- [X] Appointment detail view
- [X] Appointment creation/edit form

### What We Accomplished
- **Built complete Appointment Management system - Full Stack** (March 11-12, Wednesday-Thursday)
  - **Backend Appointment API** (appointmentController.js, appointmentRoutes.js)
    - Created getAllAppointments with multi-filter support (search, status, date range, clientId)
    - Implemented getAppointmentById with full relations (client, artist, payments)
    - Built createAppointment with client/artist validation and role checking
    - Built updateAppointment with conditional field updates and auto-timestamp for consent
    - Implemented deleteAppointment with payment protection (foreign key check)
    - Default status set to CONFIRMED (not PENDING - admin creates directly)
    - All routes protected with JWT authentication
    - Fixed type conversion bug (duration, depositAmount, totalPrice string → number with parseInt/parseFloat)
  - **Frontend Appointment List** (Appointments.jsx)
    - Table view with sortable columns
    - Multi-filter system (status dropdown, search bar with debouncing)
    - Status badges with color coding (CONFIRMED=blue, COMPLETED=green, CANCELLED=red, NO_SHOW=orange)
    - Deposit status indicators (Pagado/Pendiente chips)
    - Date formatting with Spanish locale (toLocaleString 'es-MX')
    - Currency formatting with Intl.NumberFormat
    - Delete confirmation dialog
    - Clickable rows navigate to detail page
  - **Frontend Appointment Detail** (AppointmentDetail.jsx)
    - Complete appointment information display
    - Client information with link to client profile
    - Payment summary cards (Total, Pagado, Balance Pendiente)
    - Balance calculation (totalPrice - totalPaid)
    - Color-coded balance (red if pending, green if paid)
    - Edit/Delete action buttons
    - Consent signed indicator
  - **Frontend Appointment Form** (AppointmentForm.jsx)
    - Single reusable component for create/edit modes
    - Client selector dropdown (fetches all clients)
    - Date/time picker (HTML5 datetime-local input)
    - Duration, description, deposit, total price inputs
    - Status selector (edit mode only)
    - Deposit received checkbox (edit mode only)
    - Consent signed checkbox (edit mode only)
    - Form validation (required fields, duration > 0)
    - Date format conversion (ISO with timezone ↔ datetime-local format)
    - Client field disabled in edit mode (can't change client after creation)
  - **Route Integration** (App.jsx)
    - Added 4 appointment routes in critical order (list, new, :id/edit, :id)
    - Made Dashboard "Citas" card clickable
  - **Testing & Bug Fixes**
    - Tested all CRUD operations end-to-end
    - Fixed AuthContext import path (context → contexts folder typo)
    - Fixed useAuth hook usage (was incorrectly using useContext + AuthContext)
    - Fixed type conversion for duration/prices (HTML returns strings, DB needs numbers)
    - All filters working (status, search, navigation)
- **Built complete Payment Management system - Full Stack** (March 14-15, Friday-Saturday)
  - **Backend Payment API** (paymentController.js, paymentRoutes.js)
    - Created createPayment with appointment validation and auto-tracking receivedById
    - Auto-update appointment.depositReceived when isDeposit=true
    - Implemented getPaymentsByAppointment with totalPaid calculation (Array.reduce)
    - Built updatePayment with conditional field updates
    - Implemented deletePayment
    - Payment type validation (CASH or BANK_TRANSFER enum)
    - All routes protected with JWT authentication
  - **Frontend Payment UI** (integrated into AppointmentDetail.jsx)
    - "Registrar Pago" button opens modal dialog
    - Payment form with amount, method selector, isDeposit checkbox, notes
    - Payment history table showing all payments chronologically
    - Displays: date, amount, method (Efectivo/Transferencia), type (Depósito/Pago), received by, notes
    - Delete payment functionality with confirmation
    - Real-time total calculation from API
    - Auto-refresh after creating/deleting payments
    - Payment cards showing Total, Total Pagado, Balance Pendiente
  - **Testing**
    - Tested all payment CRUD operations with Thunder Client
    - Tested end-to-end payment flow in browser
    - Verified totalPaid calculation with multiple payments
    - Captured 7-8 screenshots for thesis documentation

### Challenges Faced
- Understanding date/time format conversion between database (ISO 8601) and HTML datetime-local input
- Grasping route order importance in React Router (exact routes before dynamic params)
- Type conversion bugs (HTML form inputs return strings, database expects numbers)
- AuthContext import path confusion (context vs contexts folder)
- useAuth hook vs useContext pattern (choosing correct import method)
- Understanding foreign key protection and cascading deletes
- Learning Array.reduce() for calculating totals
- Managing multiple related data fetches (appointments + payments)
- Keeping frontend state in sync after mutations (create/delete payments)

### Solutions Found
- Used `.slice(0, 16)` to convert ISO 8601 to datetime-local format (removes seconds/timezone)
- Used `new Date(input).toISOString()` to convert back to full ISO format for database
- Established route order pattern: exact paths (/new) before dynamic params (/:id)
- Applied parseInt() for whole numbers (duration), parseFloat() for decimals (prices/amounts)
- Fixed import to use useAuth hook instead of raw AuthContext + useContext
- Implemented pre-delete checks (if payments exist, block appointment deletion)
- Learned reduce pattern: `payments.reduce((sum, p) => sum + parseFloat(p.amount), 0)`
- Created separate fetch functions (fetchAppointment, fetchPayments) for independent refresh
- Called both fetch functions after mutations to keep all data synchronized

### Learnings This Week
- **HTML5 datetime-local Input:** Format is `YYYY-MM-DDTHH:mm` (no seconds, no timezone)
- **ISO 8601 Full Format:** Database stores `YYYY-MM-DDTHH:mm:ss.sssZ` (with milliseconds and UTC timezone)
- **Date Format Conversion:** slice(0, 16) removes unwanted parts for input compatibility
- **React Router Route Order:** More specific routes MUST come before generic dynamic routes
- **Type Coercion in Forms:** All HTML inputs return strings, even type="number"
- **parseInt vs parseFloat:** parseInt for integers (duration), parseFloat for decimals (money)
- **Foreign Key Protection:** Database prevents orphaned data (can't delete parent with children)
- **Array.reduce() Pattern:** Accumulator pattern for summing values `(sum, item) => sum + item.value`
- **Modal Dialogs vs Inline Forms:** Dialogs are less invasive, focus user attention, easier to dismiss
- **Auto-refresh Strategy:** After mutations, refetch all related data to keep UI synchronized
- **Payment Audit Trail:** Track who recorded payment (receivedById) for accountability
- **Conditional Updates:** Only update fields that were provided (check !== undefined, not just truthy)
- **Enum Validation:** Validate against specific allowed values to prevent typos/invalid data
- **Dual-mode Components:** Single component can handle create/edit with isEditMode detection
- **Balance Calculation:** totalPrice - totalPaid (calculated in real-time, not stored)
- **Status Color Mapping:** Use switch statements to map database values to UI colors/labels
- **Real-time Calculations:** Fetch totalPaid from backend instead of calculating in frontend (single source of truth)

### Next Week Priorities
- ✅ ~~Appointment Management~~ (COMPLETED!)
- ✅ ~~Payment Tracking~~ (COMPLETED!)
- Polish UI (Spanish translations for status labels, back buttons, mobile responsiveness)
- Dashboard analytics (upcoming appointments count, revenue summary, recent activity)
- Calendar view (visual calendar to see appointments by date)
- Optional: Google Calendar API integration research

---

## WEEK 4: Calendar Integration & Advanced Features
**Dates:** __________ to __________
**Hours Logged:** ______

### Goals
- [ ] Calendar view for Alejandra (month/week view of appointments)
- [ ] Google Calendar API integration (sync appointments to personal calendar)
- [ ] Block/unblock dates functionality (mark days as unavailable)
- [ ] Dashboard analytics (upcoming appointments, revenue this month, clients this month)
- [ ] Email notifications (optional - notify Alejandra of new appointments)
- [ ] Export appointment data (CSV/PDF reports)

### What We Accomplished
-
-

### Challenges Faced
-
-

### Solutions Found
-
-

### Learnings This Week
-
-

### Next Week Priorities
-
-

---

## WEEK 5: Payment Management & Session Tracking
**Dates:** __________ to __________
**Hours Logged:** ______

### Goals
- [ ] Session tracking (multiple sessions per appointment for large tattoos)
- [ ] Session detail view (date, duration, work completed, photos)
- [ ] Payment recording (deposit, session payments, final payment)
- [ ] Payment method tracking (cash, card, transfer)
- [ ] Session payment status (paid, pending, partial)
- [ ] Basic finance dashboard (total revenue, pending payments)

### What We Accomplished
-
-

### Challenges Faced
-
-

### Solutions Found
-
-

### Learnings This Week
-
-

### Next Week Priorities
-
-

---

## WEEK 6: Finance Reports + Polish
**Dates:** __________ to __________
**Hours Logged:** ______

### Goals
- [ ] Monthly revenue report
- [ ] Payment method breakdown
- [ ] Export reports (CSV/PDF)
- [ ] UI/UX improvements
- [ ] Mobile optimization pass

### What We Accomplished
-
-

### Challenges Faced
-
-

### Solutions Found
-
-

### Learnings This Week
-
-

### Next Week Priorities
-
-

---

## WEEK 7: Inventory Management (Simple Approach)
**Dates:** __________ to __________
**Hours Logged:** ______

### Goals
- [ ] Material/tool database (CRUD operations)
- [ ] Add/edit/delete materials
- [ ] Manual "Add Stock" functionality (when purchasing supplies)
- [ ] Manual "Remove Stock" functionality (adjustments)
- [ ] Low stock alerts (<25%)
- [ ] Inventory dashboard with status indicators (red/yellow/green)

**Note:** Using simplified approach - no per-session tracking for MVP

### What We Accomplished
-
-

### Challenges Faced
-
-

### Solutions Found
-
-

### Learnings This Week
-
-

### Next Week Priorities
-
-

---

## WEEK 8: Testing, Deployment, Documentation
**Dates:** __________ to __________
**Hours Logged:** ______

### Goals
- [ ] Full system testing
- [ ] Bug fixes
- [ ] Performance optimization
- [ ] Final deployment
- [ ] User guide for Alejandra
- [ ] Technical documentation
- [ ] Code documentation
- [ ] Handoff meeting

### What We Accomplished
-
-

### Challenges Faced
-
-

### Solutions Found
-
-

### Learnings This Week
-
-

---

## Project Summary

### Total Hours: ______

### Key Technical Learnings
1.
2.
3.

### Key Business Learnings
1.
2.
3.

### Most Challenging Aspect
-

### Most Rewarding Aspect
-

### What We'd Do Differently
-

### Impact on Alejandra's Business
-

---

## Notes for Thesis

### Technical Decisions Made
-
-

### Architecture Justifications
-
-

### Scalability Considerations
-
-

### Security Implementations
-
-

### User Experience Choices
-
-
