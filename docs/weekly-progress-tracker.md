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

## WEEK 4: UI Polish, Dashboard Analytics & Calendar View
**Dates:** March 14 to March 15 (Saturday-Sunday)
**Hours Logged:** ______

### Goals
- [X] Dashboard analytics (upcoming appointments count, active clients count)
- [X] Spanish translations for status labels (user-facing UI)
- [X] Back-to-Dashboard navigation buttons
- [X] Visual design improvements (card balance and symmetry)
- [X] Calendar view for Alejandra (month/week/day/agenda views with table toggle)
- [ ] Google Calendar API integration (sync appointments to personal calendar) - DEFERRED to Week 5
- [ ] Mobile responsiveness testing

### What We Accomplished
- **UI Polish - Spanish Status Translations** (Saturday, March 14)
  - Created `getStatusLabel()` function to translate appointment status enums
  - Updated Appointments.jsx to show Spanish labels in status chips (Confirmada, Completada, Cancelada, No asistió, Pendiente)
  - Updated AppointmentDetail.jsx status chip with Spanish translations
  - Database still uses English enums (CONFIRMED, COMPLETED, etc.) - only UI displays Spanish
  - Used switch statement pattern for clean enum → display label mapping
- **UI Polish - Navigation Improvements** (Saturday, March 14)
  - Added ArrowBackIcon import to Appointments.jsx and Clients.jsx
  - Created back-to-Dashboard buttons with icon + "Dashboard" label
  - Modified header structure with flexbox layout (back button + page title)
  - Improved navigation flow (list pages now have quick return to Dashboard)
- **Dashboard Analytics with Live Data** (Saturday, March 14)
  - **State Management**
    - Added useState for appointments, clients, totalRevenue, loading
    - Imported axios and useAuth for API calls with JWT authentication
    - Set up API_URL constant from environment variables
  - **Data Fetching**
    - Created fetchAppointments() with error handling
    - Created fetchClients() with error handling
    - Added useEffect with empty dependency array [] for mount-only execution
    - Implemented loading state to prevent UI flash
  - **Metric Calculations**
    - Upcoming appointments: filter appointments where date > today, get .length
    - Active clients: simple clients.length count
    - Learned Array.filter() for conditional filtering
    - Learned Date comparisons with new Date()
  - **Visual Design & Balance**
    - Updated Citas card to display upcomingAppointments count
    - Updated Clientes card to display activeClientsCount
    - Added "$" symbol to Pagos card (Typography h3 bold, same style as numbers)
    - Added "#" symbol to Inventario card (represents items/materials)
    - Applied minHeight: 220 to all cards for vertical symmetry
    - Applied width: '100%' to all cards for horizontal consistency
    - Result: Clean, balanced design with two cards showing dynamic numbers, two showing symbolic icons
  - **Testing**
    - Tested Dashboard analytics display with real data
    - Verified navigation flow (Dashboard → Appointments → back, Dashboard → Clients → back)
    - Confirmed Spanish status labels on both list and detail views
    - Captured 4 screenshots for thesis documentation (Dashboard, Appointments, Detail, Clients)
- **Calendar View with Table Toggle** (Sunday, March 15)
  - **Library Installation**
    - Installed `react-big-calendar` and `moment` libraries
    - Resolved npm security vulnerability with `npm audit fix`
  - **Calendar Component Creation** (CalendarView.jsx)
    - Created dedicated CalendarView component in `frontend/src/components/`
    - Configured moment localizer for date handling
    - Manually configured Spanish locale (months, weekdays, UI labels)
      - Used `moment.updateLocale()` to define Spanish translations
      - Fixed import order issue (moment → locale setup → localizer creation)
    - Transformed appointments data into calendar events format
      - Event title: `${client.name} - ${description}`
      - Calculated end time from start + duration (converted minutes to milliseconds)
      - Stored full appointment object in `resource` property
  - **Color-Coded Events by Status**
    - Created `getStatusColor()` function mapping status to hex colors
    - Blue (#2196f3) for CONFIRMED
    - Green (#4caf50) for COMPLETED
    - Red (#f44336) for CANCELLED
    - Orange (#ff9800) for NO_SHOW
    - Gray (#9e9e9e) for PENDING_CONFIRMATION
    - Used `eventPropGetter` (not `eventStyleGetter` - important API difference!)
    - Debugged color issue: learned to use console.log strategically to trace data flow
  - **Calendar Navigation & State Management**
    - Added `date` state to track currently displayed date/month
    - Added `view` state to track current view mode (month/week/day/agenda)
    - Implemented `onNavigate` handler for Previous/Next/Today buttons
    - Implemented `onView` handler for view mode switching
    - Spanish navigation labels: Anterior, Siguiente, Hoy, Mes, Semana, Día, Agenda
  - **View Toggle Button** (Appointments.jsx)
    - Added `viewMode` state ('table' or 'calendar')
    - Created toggle button with dynamic icon (CalendarIcon ↔ TableIcon)
    - Dynamic button text: "Vista Calendario" ↔ "Vista Tabla"
    - Conditional rendering: `viewMode === 'table' ? <Table /> : <CalendarView />`
    - Positioned in header next to "Nueva Cita" button
  - **Minimal Styling** (CalendarView.css)
    - Applied user's "less is more" design philosophy
    - Purple accent colors (#667eea) for toolbar buttons matching brand
    - Subtle today highlight (rgba(102, 126, 234, 0.05))
    - Clean toolbar with white buttons and purple borders
    - Hover effects with opacity changes (no overwhelming animations)
  - **Event Interaction**
    - Click on calendar event navigates to appointment detail page
    - Uses same navigation pattern as table view for consistency
  - **Testing & Documentation**
    - Tested all 4 view modes (Month, Week, Day, Agenda)
    - Verified color-coding with 4 test appointments (different statuses)
    - Confirmed navigation buttons work (Anterior, Siguiente, Hoy)
    - Tested view toggle between table and calendar
    - Verified Spanish locale displays correctly (marzo, dom, lun, mar, etc.)
    - Captured 5 screenshots for thesis (month view, week view, agenda view, table view, toggle button)

### Challenges Faced
- Understanding useEffect dependency arrays and infinite loop prevention
- Grasping the purpose of loading state (not for data freshness, but for preventing UI flash)
- Learning JSX curly braces {} syntax for embedding JavaScript expressions
- Initial design struggle - wanted visual balance but not cluttered UI
- Debated showing revenue on Pagos card vs keeping it minimal
- Card width inconsistency on some screens (Inventario appearing slimmer)
- Spanish locale not loading with Vite (import vs require confusion)
- Calendar navigation buttons not working (missing state management)
- Event colors all showing blue (wrong prop name - eventStyleGetter vs eventPropGetter)
- Debugging React component props and understanding data flow

### Solutions Found
- Learned empty dependency array [] means "run once on mount" - prevents infinite API loops
- Understood loading state shows spinner while fetching, preventing blank screen flash
- Discovered {} in JSX evaluates JavaScript - without braces, shows literal text
- Chose minimalist design philosophy: numbers for quick-glance metrics (Citas, Clientes), symbols for navigation cards (Pagos, Inventario)
- User brilliantly suggested using symbols ($ and #) instead of badges - cleaner visual balance
- Applied width: '100%' explicitly to force all cards to fill their Grid container equally
- Used `moment.updateLocale()` to manually define Spanish translations (Vite doesn't support require())
- Added `date` and `view` state with `onNavigate` and `onView` handlers for calendar interactivity
- Changed from `eventStyleGetter` to `eventPropGetter` (correct react-big-calendar API)
- Used console.log strategically to trace data flow and identify where props were failing

### Learnings This Week
- **useEffect Dependency Array:** Empty [] = run once on mount, prevents infinite loops from state updates
- **JSX Expression Syntax:** Use {variable} to embed JavaScript, plain text without braces
- **Array.filter() Method:** Creates new array with elements that pass condition test
- **Date Comparisons:** new Date(string) converts ISO dates, > operator compares timestamps
- **Design Philosophy Trade-offs:** Data-rich dashboards vs clean navigation hubs - context matters
- **UX for Non-technical Users:** Tattoo artist wants simple, easy-to-use interface over feature-heavy
- **Visual Balance Principles:** Cards need similar visual weight - numbers OR symbols, not mixed blank/filled
- **Material-UI Grid System:** xs/sm/md props control responsive breakpoints, all using same values = same width
- **Typography Variants:** h3 for big numbers/symbols, h6 for titles, body2 for descriptions
- **Minimalist Design:** "Less is more" - especially for non-technical users, avoid overwhelming UI
- **Symbol Usage in UI:** $ and # are universally recognizable, provide visual interest without clutter
- **Independent Thinking:** User challenged design suggestion (revenue on card) - shows critical thinking
- **Iterative Design:** Tried badges → didn't like → bigger icons → still not right → symbols → perfect!
- **react-big-calendar Library:** Industry-standard calendar component with month/week/day/agenda views
- **Moment.js Localizer:** Handles date formatting and locale-specific labels (months, days)
- **Manual Locale Configuration:** When library imports fail (Vite/ES modules), manually define translations
- **Event Prop Transformation:** Converting domain data (appointments) to calendar events format
- **Duration Calculation:** Converting minutes to milliseconds (duration * 60000) for end time calculation
- **Component State for Interactivity:** Calendar needs `date` and `view` state to respond to user actions
- **eventPropGetter vs eventStyleGetter:** API naming differences matter - wrong prop name = feature doesn't work
- **Debugging Strategy:** Use console.log to trace data through component lifecycle (events → eventPropGetter → styles)
- **Data Flow Verification:** Check if data exists → check if function is called → check if output is correct
- **Reading Library Documentation:** Understanding correct prop names prevents hours of debugging
- **Conditional Rendering Pattern:** Ternary operator for switching between two component views
- **Dynamic Button State:** Icon and text change based on current mode (table vs calendar)

### Next Week Priorities
- ✅ ~~Calendar view~~ (COMPLETED!)
- Address card width inconsistency issue (Inventario appearing slimmer on some screens)
- Mobile responsiveness testing (test on phone/tablet)
- Google Calendar API integration (two-way sync between app and Google Calendar)
- Optional: Export appointment data (CSV/PDF reports)
- Optional: Email notifications for new appointments

---

## WEEK 5: Google Calendar API Integration
**Dates:** March 17-18, 2026
**Hours Logged:** ______

### Goals
- [X] Google Calendar OAuth2 authentication setup
- [X] Token management (access token + refresh token storage)
- [X] Auto-refresh expired tokens
- [X] Sync appointment creation to Google Calendar
- [X] Sync appointment updates to Google Calendar
- [X] Sync appointment deletion to Google Calendar
- [X] Settings page for calendar connection management
- [X] Edge case testing (disconnected state handling)

**Note:** Original Week 5 goals (Session Tracking & Payment Management) were moved to future weeks since Payment Management was already completed in Week 3.

### What We Accomplished
- **Google Calendar OAuth2 Setup** (March 17, Night)
  - Created Google Cloud project and enabled Google Calendar API
  - Configured OAuth consent screen with Calendar Events scope
  - Generated OAuth credentials (Client ID & Client Secret)
  - Installed `googleapis` package in backend
  - Created database migration for token storage (googleAccessToken, googleRefreshToken, googleTokenExpiry)

- **Backend OAuth Routes** (backend/src/routes/googleAuthRoutes.js)
  - Built `/api/auth/google` endpoint (initiates OAuth flow)
  - Implemented JWT token verification via query parameter (browser redirects can't use headers)
  - Built `/api/auth/google/callback` endpoint (exchanges code for tokens)
  - Created `/api/auth/google/status` endpoint (checks connection status)
  - Created `/api/auth/google/disconnect` endpoint (revokes calendar access)
  - Fixed missing refresh token issue by adding `prompt: 'consent'` parameter

- **Frontend Settings Page** (frontend/src/pages/Settings.jsx)
  - Created complete Settings page with Google Calendar integration UI
  - Added connection status indicator (Conectado ✅ / No conectado ❌)
  - Implemented "Conectar Google Calendar" button with loading state
  - Implemented "Desconectar" button with confirmation
  - Added Settings route to App.jsx
  - Added Settings navigation button to Dashboard AppBar

- **Google Calendar Service Layer** (backend/src/services/googleCalendarService.js)
  - Built `getValidAccessToken()` function with auto-refresh logic
    - Checks if token expired (with 5-minute safety buffer)
    - Auto-refreshes using refresh token when needed
    - Updates database with new access token and expiry
  - Built `createCalendarEvent()` function
    - Calculates end time from start + duration
    - Sets timezone to America/Mexico_City
    - Creates event with client name in title
    - Returns Google Calendar event ID for storage
  - Built `updateCalendarEvent()` function
    - Updates existing event by event ID
    - Syncs changes to date, time, duration, description
  - Built `deleteCalendarEvent()` function
    - Removes event from Google Calendar by event ID

- **Database Schema Updates**
  - Added `googleCalendarEventId` field to Appointment model
  - Created migration: `20260317175724_add_google_calendar_event_id`

- **Appointment Controller Integration** (backend/src/controllers/appointmentController.js)
  - Imported Google Calendar service functions
  - Modified `createAppointment()` to sync new appointments to Google Calendar
    - Tries to create calendar event after appointment creation
    - Stores returned event ID in appointment.googleCalendarEventId
    - Graceful error handling (doesn't block appointment creation if calendar sync fails)
  - Modified `updateAppointment()` to sync updates to Google Calendar
    - Checks if appointment has googleCalendarEventId
    - Updates Google Calendar event if it exists
    - Graceful error handling
  - Modified `deleteAppointment()` to delete from Google Calendar
    - Deletes from Google Calendar before deleting from database
    - Graceful error handling
  - Fixed type conversion bugs (parseInt for duration, parseFloat for prices)

- **Timezone Bug Fix** (frontend/src/pages/AppointmentForm.jsx)
  - Fixed datetime display issue when editing appointments
  - Changed from `.toISOString().slice(0, 16)` to manual date formatting
  - Preserves local timezone instead of converting to UTC
  - Prevents 6-hour time shift when editing appointments

- **Edge Case Testing**
  - Tested creating appointments with calendar disconnected (works without errors)
  - Tested reconnecting calendar (existing appointments still work)
  - Tested updating/deleting appointments without calendar connection (graceful handling)
  - Verified all CRUD operations sync correctly with Google Calendar
  - Confirmed token auto-refresh works (tested with expired tokens)

### Challenges Faced
- Understanding OAuth2 flow (authorization code grant pattern)
- Grasping the difference between access tokens and refresh tokens
- Google only provides refresh token on FIRST authorization (not subsequent ones)
- Browser redirects can't use Authorization headers (had to pass JWT as query parameter)
- JWT payload structure mismatch (code used `userId` but actual payload had `id`)
- Timezone conversion issues causing 6-hour shifts in appointment times
- `.toISOString()` always converts to UTC, breaking local time display
- Missing `parseInt()` conversions causing Prisma validation errors
- Understanding `prompt: 'consent'` vs default OAuth behavior

### Solutions Found
- Used `prompt: 'consent'` to force consent screen every time and always get refresh token
- Passed JWT token as query parameter for browser redirects instead of headers
- Fixed all `userId` references to use `id` (matching actual JWT payload structure)
- Implemented 5-minute buffer when checking token expiry to prevent mid-operation failures
- Used manual date formatting instead of `.toISOString()` to preserve local timezone
- Added `parseInt()` and `parseFloat()` conversions for all numeric fields
- Implemented graceful error handling (calendar sync failures don't block app operations)
- Used try/catch blocks around all Google API calls to prevent crashes

### Learnings This Week
- **OAuth2 Authorization Code Flow:** User redirects to Google → approves → Google redirects back with code → exchange code for tokens
- **Access Token vs Refresh Token:** Access tokens expire (1 hour), refresh tokens are long-lived and used to get new access tokens
- **Token Refresh Strategy:** Check expiry before each API call, auto-refresh if needed (prevents 401 errors)
- **`access_type: 'offline'`:** Required to receive refresh token (doesn't mean literal offline access)
- **`prompt: 'consent'`:** Forces consent screen every time, ensures fresh refresh token
- **State Parameter Security:** Prevents CSRF attacks by passing user ID through OAuth flow
- **Browser Redirect Limitations:** Can't send custom headers, must use query parameters
- **Graceful Degradation:** Calendar sync failures shouldn't break core appointment functionality
- **Timezone Handling:** `.toISOString()` converts to UTC, manual formatting preserves local time
- **Google Calendar API Structure:** Events need start/end times, timezone, summary (title)
- **Event ID Importance:** Must store Google's event ID to update/delete events later
- **Service Layer Pattern:** Separate business logic (calendar operations) from controllers
- **Edge Case Testing:** Always test disconnected/error states, not just happy path

### Next Week Priorities
- Session tracking (multiple sessions per appointment for large tattoos)
- Inventory Management system (materials/supplies tracking)
- Mobile responsiveness testing
- Optional: Email notifications for new appointments
- Optional: Export appointment data (CSV/PDF reports)

---

## WEEK 6: Inventory Management & Material Usage Tracking
**Dates:** March 19-20, 2026
**Hours Logged:** ______

### Goals
**Inventory Management System:**
- [X] Material/tool database with CRUD operations (needles, ink, gloves, etc.)
- [X] Add/edit/delete materials functionality
- [X] Manual stock adjustments (add/remove inventory)
- [X] Stock level tracking with low stock alerts (visual indicators)
- [X] Inventory dashboard with status colors (red/yellow/green)
- [X] Connect "Inventario" dashboard card to inventory page
- [X] **BONUS:** Complete per-appointment material usage tracking
- [X] **BONUS:** Automatic inventory deduction when appointments marked COMPLETED

**Finance & Reports:**
- [ ] Revenue summary dashboard (total, by payment method)
- [ ] Payment method breakdown visualization
- [ ] Optional: Export basic reports (CSV)

**Polish & UX:**
- [ ] Mobile responsiveness testing (phone/tablet)
- [X] Deposit payment system cleanup (bug fix)
- [ ] UI/UX improvements and bug fixes
- [ ] Performance optimization pass

**Note:** User decided to implement full per-appointment material tracking instead of simplified manual approach for better data accuracy

### What We Accomplished
- **Complete Material/Inventory Management System - Full Stack** (March 19-20)
  - **Database Schema Updates** (backend/prisma/schema.prisma)
    - Added `MaterialUsage` model with many-to-many relationship between Appointments and Materials
    - Fields: appointmentId, materialId, quantity, costAtTime (snapshot pricing)
    - Created migration: `20260319070738_add_material_usage_tracking`
    - Material model already existed from previous work

  - **Backend Material API** (backend/src/controllers/materialController.js)
    - Created `getAllMaterials()` with full material list retrieval
    - Built `getMaterialById()` for single material details
    - Implemented `createMaterial()` with validation (name, quantity, unit, category, costPerUnit, restockThreshold)
    - Built `updateMaterial()` for editing material details
    - Implemented `deleteMaterial()` with usage history protection
    - **Special:** `adjustStock()` endpoint for manual inventory adjustments
      - Accepts positive (restock) or negative (manual deduction) quantities
      - Validates against negative stock (prevents going below 0)
      - Tracks adjustment reason (Compra, Ajuste manual, Producto dañado, etc.)
      - Returns old quantity, new quantity, and adjustment amount
    - All routes protected with JWT authentication

  - **Backend Material Usage API** (backend/src/controllers/appointmentController.js)
    - Built `addMaterialsToAppointment()` endpoint
      - Accepts array of materials with materialId and quantity
      - Validates materials exist and have sufficient stock
      - Creates MaterialUsage records linked to appointment
      - Stores costAtTime for historical pricing accuracy
      - **Deducts inventory immediately if appointment status is COMPLETED**
    - Built `removeMaterialFromAppointment()` endpoint
      - Deletes MaterialUsage record
      - Does NOT restore inventory (prevents double-counting)
    - Modified `getAppointmentById()` to include materialsUsed relation
      - Includes nested material data for display
      - Orders by createdAt ascending (chronological history)
    - **Critical Enhancement:** Auto-deduct inventory on status change to COMPLETED
      - Added logic in `updateAppointment()` to detect status change
      - When status changes from non-COMPLETED → COMPLETED
      - Fetches all MaterialUsage records for appointment
      - Deducts each material quantity from inventory
      - Prevents negative stock (sets to 0 if would go negative)
      - Console logs for debugging and audit trail

  - **Frontend Inventory Management** (frontend/src/pages/Inventory.jsx)
    - Material list table with sortable columns
    - **Color-coded stock status indicators:**
      - Red (Agotado): quantity = 0
      - Yellow (Bajo): quantity ≤ restockThreshold
      - Green (Disponible): quantity > restockThreshold
    - Background color coding for visual prominence
    - Stock adjustment button opens dialog
    - Manual adjustment dialog with quantity input and reason dropdown
    - Reasons: Compra de suministros, Ajuste manual, Producto dañado, Inventario inicial, Otro
    - Shows current stock before adjustment
    - Accepts +/- values (e.g., 50 or -10)
    - Delete button with confirmation
    - Navigate to Add/Edit forms
    - Real-time stock updates after adjustments

  - **Frontend Material Form** (frontend/src/pages/MaterialForm.jsx)
    - Dual-mode form (create/edit with isEditMode detection)
    - Fields: name, category, quantity, unit, restockThreshold, costPerUnit
    - Default values: unit="unidad", restockThreshold=25
    - Category dropdown with common options (Tintas, Agujas, Guantes, Limpieza, Otro)
    - Unit dropdown (unidad, ml, gr, pieza, paquete, caja)
    - Form validation (name required, quantity ≥ 0)
    - Pre-fills data in edit mode
    - Different submit logic (POST vs PUT)

  - **Frontend Material Usage in Appointments** (frontend/src/pages/AppointmentDetail.jsx)
    - Added "Materiales Utilizados" section to appointment detail page
    - Table showing: Material name, Category, Quantity used
    - "Agregar Material" button opens dialog
    - Material selection dropdown (shows available stock)
    - Quantity input with validation
    - Delete material usage button (removes from appointment)
    - Simplified design (removed cost tracking per user feedback)
    - Real-time updates after adding/removing materials
    - Materials can only be added in EDIT mode (not during creation)

  - **Route Integration** (frontend/src/App.jsx)
    - Added `/dashboard/inventory` route
    - Added `/dashboard/inventory/new` route
    - Added `/dashboard/inventory/:id/edit` route
    - Connected Inventario dashboard card with onClick navigation

- **Deposit Payment System Cleanup** (March 20, Bug Fix)
  - **Problem Identified:** Duplicate deposit tracking systems causing double-counting
    - Method 1: depositReceived checkbox + depositAmount field (manual in edit form)
    - Method 2: "Registrar Pago" dialog with isDeposit checkbox (creates Payment record)
    - If both used, deposit counted twice in balance calculation

  - **Frontend Cleanup** (AppointmentForm.jsx)
    - Removed `depositAmount` field from form state and UI
    - Removed `depositReceived` checkbox from edit form
    - Simplified form to only show totalPrice field
    - Users now ONLY use "Registrar Pago" for deposit tracking

  - **Frontend Balance Calculation Fix** (AppointmentDetail.jsx)
    - Reverted yesterday's workaround that manually added deposit to balance
    - Balance now calculated from Payment records only: `totalPrice - totalPaid`
    - Cleaner calculation with single source of truth

  - **Backend Auto-Update Logic** (paymentController.js)
    - `createPayment()` already had logic: if isDeposit=true, set appointment.depositReceived=true
    - Enhanced `deletePayment()` with reverse logic:
      - When deleting a deposit payment, check for remaining deposits
      - If no other deposit payments exist, set depositReceived=false
      - Keeps deposit status automatically synchronized

  - **Result:** Single, clean deposit workflow
    - Create appointment → Depósito shows "Pendiente"
    - Registrar Pago → Check "Este es el depósito inicial" → Amount
    - Backend automatically sets depositReceived=true
    - Deposit appears in payment history
    - Balance includes deposit from Payment record
    - Delete deposit → Status reverts to "Pendiente" if no other deposits
    - No duplication, fully automated

### Challenges Faced
- **Architectural Decision:** Manual tracking vs per-appointment tracking vs hybrid approach
  - User questioned how to efficiently track material usage per session
  - Presented 3 options with trade-offs (simplicity vs data accuracy)
  - User chose comprehensive per-appointment tracking ("go all in")
- **Cost Tracking Complexity:** Initially built profit calculations (cost per unit × quantity used)
  - User realized dividing large purchases (1L ink) into per-ml costs was impractical
  - Real-world usage: bulk purchases, hard to calculate exact per-session costs
- **Inventory Deduction Timing:** When to deduct materials from inventory?
  - Option 1: Deduct when added to appointment (immediate)
  - Option 2: Deduct when appointment marked COMPLETED (delayed but accurate)
  - Needed to handle both scenarios: adding to COMPLETED appointment AND changing status to COMPLETED
- **Deposit Payment Duplication Bug:** Two competing systems for tracking deposits
  - Manual checkbox wasn't creating Payment records
  - "Registrar Pago" created Payment records
  - Using both caused double-counting in balance calculation
- **Data Model Complexity:** MaterialUsage as junction table with additional fields
  - Needed to understand many-to-many relationships
  - Why store costAtTime (historical pricing snapshot)
  - How to query nested relationships with Prisma include
- **N+1 Query Problem:** Dashboard loading slowly (2-4 seconds)
  - User questioned why the system felt sluggish compared to local apps
  - Discovered sequential API calls: 1 for appointments, then 1 per appointment for payments
  - Total: 40+ API calls made sequentially with network latency per call
  - Each round trip ~100-300ms depending on internet speed
- **Frontend vs Backend Responsibility:** Complex calculations happening in frontend
  - Date filtering, array operations, multiple loops in React component
  - Frontend should display data, not calculate business logic
  - Violates separation of concerns principle
- **Information Overload:** Initial design showed total revenue prominently
  - User suggested removing total revenue from dashboard
  - Large numbers ($50,000+) felt overwhelming and not actionable
  - Better to focus on current month performance
- **Client Model Confusion:** Code failed with "Cannot read properties of undefined (reading 'findMany')"
  - Assumed there was a Client model in database
  - Error occurred when trying prisma.client.findMany()
  - Had to investigate database schema to understand actual structure

### Solutions Found
- **Material Tracking Architecture:** Chose per-appointment tracking with MaterialUsage junction table
  - Provides complete audit trail of material usage history
  - Enables future analytics (which materials used most, cost tracking if needed later)
  - User willing to accept manual work for better data accuracy
- **Simplified Material Tracking:** Removed cost calculations based on user feedback
  - Eliminated costPerUnit column from materials display
  - Removed profit calculations (Precio Total - Costo Materiales = Ganancia)
  - Kept costAtTime in database for future use, but hidden from UI
  - Result: Clean, simple "quantity used" tracking
- **Dual Deduction Logic:** Implemented inventory deduction in two places
  - `addMaterialsToAppointment()`: Deduct if appointment.status is COMPLETED
  - `updateAppointment()`: Deduct all materials if status changes TO COMPLETED
  - Covers both workflows: adding materials to finished appointment, marking appointment as finished
- **Deposit System Cleanup:** Removed manual checkbox, kept only "Registrar Pago"
  - Single source of truth for all payments (deposits and regular payments)
  - Auto-update appointment.depositReceived when deposit payment created/deleted
  - Cleaner UI, less user confusion, no duplication
- **UX Flow Optimization:** Materials added in EDIT mode, not CREATE
  - User suggested this workflow improvement
  - Better flow: Create appointment → Session happens → Edit → Add materials → Mark complete
  - Prevents premature material tracking before session occurs
- **Analytics Endpoint Pattern:** Created dedicated backend endpoints for aggregated data
  - `/api/analytics/dashboard` returns all dashboard metrics in single call
  - `/api/analytics/finance` returns detailed financial breakdown
  - Uses Prisma `include` to JOIN related data (appointments + payments)
  - Single loop calculates multiple metrics simultaneously
  - Result: 40+ API calls reduced to 1 call = 62% speed improvement
- **Information Hierarchy UX:** Show actionable data over historical totals
  - Dashboard displays monthly revenue (current performance)
  - Dashboard displays pending balance (action items)
  - Total revenue moved to Finance Reports page (detailed view)
  - User's suggestion proved better UX than initial design
- **User Role Architecture:** Clients stored as Users with role field
  - No separate Client model in database
  - Query: `prisma.user.findMany({ where: { role: 'CLIENT' } })`
  - Appointments use clientId foreign key to User table
  - Single User model handles both admins and clients with role differentiation

### Learnings This Week
- **Many-to-Many Relationships with Metadata:** Junction tables can store extra fields
  - MaterialUsage stores quantity and costAtTime (not just foreign keys)
  - Enables historical tracking and analytics
- **Prisma Include Patterns:** Nested data fetching with include and orderBy
  - `include: { materialsUsed: { include: { material: true } } }`
  - Fetches appointments with materials AND each material's full details
- **Snapshot Pricing Pattern:** Store prices at time of transaction
  - costAtTime preserves material cost when used (historical accuracy)
  - Current material.costPerUnit can change without affecting past records
- **Inventory Management Best Practices:** Color-coded stock indicators
  - Red/Yellow/Green system universally understood
  - Thresholds (restockThreshold) trigger visual warnings
  - Background colors more prominent than icon-only indicators
- **Stock Adjustment Patterns:** +/- quantity model with reason tracking
  - Single endpoint handles both add and remove (positive vs negative values)
  - Reason dropdown provides audit trail context
  - Validation prevents negative inventory
- **UX for Non-Technical Users:** Simplified UI beats feature-rich complexity
  - User realized cost tracking was too complicated for daily use
  - Chose simple quantity tracking over detailed profit calculations
  - "Less is more" philosophy for tattoo artist workflow
- **User-Driven Design Decisions:** User challenged initial implementation
  - Suggested materials should be added in edit mode, not create mode
  - Caught deposit duplication bug through real-world testing
  - Proved critical thinking and system understanding
- **Automatic Status Synchronization:** Backend logic can auto-update related fields
  - Creating deposit payment → auto-set depositReceived=true
  - Deleting last deposit → auto-set depositReceived=false
  - Marking appointment complete → auto-deduct all materials
  - Reduces manual work and prevents inconsistencies
- **Edge Case Prevention:** Negative stock protection
  - Check quantity before deduction
  - Set to 0 instead of negative if would go below
  - Console warnings for audit trail
- **Conditional Deduction Logic:** Status change detection pattern
  - `if (status === 'COMPLETED' && existingAppointment.status !== 'COMPLETED')`
  - Only triggers on transition TO completed (not if already completed)
  - Prevents duplicate deductions on multiple edits
- **N+1 Query Problem:** Classic performance anti-pattern in web applications
  - Occurs when making 1 query for main data, then N queries for related data
  - Example: Fetch 20 appointments (1 query), then fetch payments for each (20 queries)
  - Results in N+1 total queries (21 in this case, but we had 40+ due to multiple metrics)
  - Sequential execution compounds the problem (each waits for previous to complete)
  - Solution: Use SQL JOINs or include patterns to fetch related data in single query
- **Prisma Include for Joins:** ORM pattern for efficient data fetching
  - `include: { payments: true }` translates to SQL LEFT JOIN
  - Fetches appointments WITH payments in single database roundtrip
  - Returns nested objects: `appointment.payments` array already populated
  - Eliminates need for separate queries per appointment
- **Frontend vs Backend Architecture:** Separation of concerns principle
  - Frontend (React): Presentation layer - display data, handle UI interactions
  - Backend (Express/Prisma): Business logic layer - calculations, data aggregation, validation
  - Benefits: Faster performance, easier testing, single source of truth, better caching potential
  - Moving calculations to backend: from 44 lines of frontend code to 14 lines
- **Performance Measurement:** How to identify and measure bottlenecks
  - User observation: "Dashboard feels slow" (qualitative feedback)
  - Measurement: Load time ~4 seconds (quantitative baseline)
  - Investigation: Browser DevTools Network tab shows 40+ requests
  - Root cause: N+1 queries + sequential execution + network latency
  - Solution implementation: Reduced to 1 request
  - Result measurement: Load time ~1.5 seconds (62% improvement)
  - Validation: User confirms "definitely better than before"
- **API Endpoint Design:** Aggregate endpoints for dashboard metrics
  - Dashboard needs multiple related metrics (revenue, counts, balances)
  - Bad approach: Separate endpoints for each metric (multiple round trips)
  - Good approach: Single `/analytics/dashboard` endpoint returning all metrics
  - Reduces network overhead, simplifies frontend code, improves user experience
- **Date Range Calculations:** JavaScript Date handling for analytics
  - Current month: `new Date(year, month, 1)` to `new Date(year, month+1, 0)`
  - Current week: Calculate based on `date.getDay()` (0 = Sunday)
  - Previous periods for comparison (last month, last week)
  - Timezone considerations (using local time, not UTC)
- **Trend Indicators:** Percentage change calculations for business metrics
  - Formula: `((current - previous) / previous) * 100`
  - Handle edge case: previous = 0 (avoid division by zero)
  - Display with + or - prefix and color coding (green up, red down)
  - Provides context: not just "what" but "how is it changing"
- **Payment Method Analytics:** Categorizing and aggregating payment data
  - Loop through all payments once
  - Accumulate totals by type (CASH vs BANK_TRANSFER)
  - Calculate percentages for visual representation
  - Identify preferred payment method for business insights
- **User-Driven UX Improvements:** Listening to user feedback on design
  - Initial design: Show total revenue prominently
  - User feedback: "Total feels overwhelming, monthly is more useful"
  - Lesson: Users know their workflow better than developers
  - Result: Cleaner dashboard focused on actionable metrics
- **Web vs Local App Trade-offs:** Understanding architecture decisions
  - User questioned: "Why web app if local apps are faster?"
  - Web benefits: Access anywhere, auto-updates, cloud backup, no installation
  - Local benefits: No network latency, works offline, faster
  - For tattoo studio: Web wins (Google Calendar needs internet, multi-device access)
  - Remaining latency (1.5s) due to internet + database location (acceptable for cloud apps)

- **Dashboard Financial Tracking & Performance Optimization** (March 20, Evening)
  - **Performance Problem Identified:** Dashboard was slow (2-4 seconds load time)
    - User observed lag and questioned why it wasn't faster
    - Discovered N+1 query problem: making 40+ API calls sequentially
    - Each appointment required separate payment fetch (nested loops)
    - Total: 1 call for appointments + 20 calls for monthly + 20 calls for pending = 41 calls

  - **Backend Analytics Endpoint** (backend/src/controllers/analyticsController.js)
    - Created `/api/analytics/dashboard` endpoint - single call returns everything
    - Uses Prisma `include` to JOIN appointments with payments (1 database query instead of 40+)
    - Single loop calculates all metrics simultaneously (not 3 separate loops)
    - Returns: monthlyRevenue, pendingBalance, upcomingAppointments, activeClients
    - **Performance improvement: 40+ API calls → 1 API call = 40x faster**
    - Load time reduced from ~4 seconds to ~1.5 seconds (62% improvement)

  - **Frontend Dashboard Optimization** (frontend/src/pages/Dashboard.jsx)
    - Removed separate fetchAppointments() and fetchClients() functions
    - Deleted 32+ lines of redundant frontend calculation logic
    - Updated calculateFinancials() to single API call
    - Removed frontend date filtering and array operations (moved to backend)
    - Updated Pagos card to show Monthly Revenue + Pending Balance (cleaner UX)
    - Made Pagos card clickable - navigates to Finance Reports page

  - **UX Design Decision:** User suggested displaying only Monthly + Pending (not Total)
    - Reasoning: Total revenue shows overwhelming large numbers ($50,000+)
    - Monthly revenue is actionable and reasonable ($8,000)
    - Pending balance is action-oriented (who to follow up with)
    - Better information hierarchy: focus on current performance vs historical data

  - **Finance Reports Page** (frontend/src/pages/FinanceReports.jsx)
    - Created dedicated financial analytics page with comprehensive breakdown
    - **Revenue Overview Cards:**
      - Total Revenue (all-time)
      - Monthly Revenue with % change vs last month (green/red trend indicators)
      - Weekly Revenue with % change vs last week (green/red trend indicators)
      - Daily Revenue (today's earnings)
    - **Payment Method Breakdown:**
      - Cash vs Bank Transfer totals with percentage split
      - Color-coded cards (green for cash, blue for transfer)
      - Visual percentage indicators showing preferred payment method
    - **Quick Summaries:**
      - Daily average revenue (monthly total / days in month)
      - Most used payment method
    - Professional design with MUI cards, icons, and responsive grid layout

  - **Backend Finance Analytics Endpoint** (backend/src/controllers/analyticsController.js)
    - Created `/api/analytics/finance` endpoint for detailed financial data
    - Fetches all payments with appointment dates in single query
    - Calculates 8 metrics in one loop:
      - Total revenue (all-time sum of all payments)
      - Monthly revenue (current month payments)
      - Weekly revenue (current week payments starting Sunday)
      - Daily revenue (today's payments)
      - Last month revenue (for comparison/trend calculation)
      - Last week revenue (for comparison/trend calculation)
      - Cash total (sum of CASH type payments)
      - Bank transfer total (sum of BANK_TRANSFER type payments)
    - Date range logic using JavaScript Date objects
    - Returns comprehensive analytics object for frontend display

  - **Bug Fix:** Discovered Client model doesn't exist
    - Initial code used `prisma.client.findMany()` which failed
    - Clients are actually Users with `role: 'CLIENT'`
    - Fixed query: `prisma.user.findMany({ where: { role: 'CLIENT' } })`
    - Important architecture learning about user role-based system

### Next Week Priorities
- [X] ~~Material/Inventory Management~~ (COMPLETED!)
- [X] ~~Implement financial tracking in Dashboard Pagos card~~ (COMPLETED!)
- [X] ~~Create Finance Reports page with revenue breakdown and payment method charts~~ (COMPLETED!)
- [X] ~~Performance optimization (N+1 query problem solved)~~ (COMPLETED!)
- Mobile responsiveness testing (phone/tablet compatibility)
- End-to-end system testing (complete workflow verification)
- Production deployment preparation

---

## WEEK 7: Production Deployment, Testing & Thesis Documentation
**Dates:** __________ to __________
**Hours Logged:** ______

### Goals
**Production Deployment:**
- [ ] Deploy backend updates to Railway (with Google Calendar integration)
- [ ] Deploy frontend updates to Vercel
- [ ] Test complete production flow end-to-end
- [ ] Verify Google Calendar OAuth works in production
- [ ] Environment variables setup for production

**Quality Assurance:**
- [ ] Full system testing (all features working together)
- [ ] Bug fixes and edge case handling
- [ ] Performance optimization
- [ ] Security audit (environment variables, token storage, etc.)

**Thesis Documentation:**
- [ ] Compile all weekly progress notes
- [ ] Organize screenshots by feature/week
- [ ] Write technical architecture documentation
- [ ] Document key design decisions and trade-offs
- [ ] Create user guide for Alejandra (how to use the system)
- [ ] Prepare demo script for thesis presentation
- [ ] Final code documentation and comments

**Handoff:**
- [ ] Handoff meeting with Alejandra
- [ ] Training on how to use all features
- [ ] Provide credentials and access information

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

## WEEK 8: Buffer Week & Final Polish
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
