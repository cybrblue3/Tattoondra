# Database Schema Design

**Last Updated:** February 22, 2026
**Approach:** Simplified MVP (5 tables)

---

## Entity Relationship Diagram (ERD) - MVP

```
┌─────────────┐         ┌──────────────┐
│    User     │────────>│ Appointment  │
│             │ client  │              │
├─────────────┤         ├──────────────┤
│ id (PK)     │         │ id (PK)      │
│ email       │         │ clientId(FK) │
│ name        │         │ artistId(FK) │
│ phone       │         │ date         │
│ role        │         │ status       │
│             │<────────│ depositAmt   │
└─────────────┘ artist  │ totalPrice   │
                        │ consentSigned│
                        └──────────────┘
                              │
                              │
                         ┌────▼────┐
                         │Payment  │
                         ├─────────┤
                         │id (PK)  │
                         │apptId   │
                         │amount   │
                         │type     │
                         │isDeposit│
                         └─────────┘

Independent Tables:

┌──────────────┐       ┌──────────────┐
│  Material    │       │ BlockedDate  │
├──────────────┤       ├──────────────┤
│ id (PK)      │       │ id (PK)      │
│ name         │       │ date         │
│ quantity     │       │ reason       │
│ threshold    │       └──────────────┘
│ costPerUnit  │
└──────────────┘
```

**Note:** Session and MaterialUsage tables are NOT in MVP. They can be added post-launch if Alejandra requests detailed per-session tracking.

---

## Post-MVP Tables (Optional)

If Alejandra later wants detailed material tracking per session, we can add:

```
┌───▼─────┐
│ Session │
├─────────┤
│id (PK)  │
│apptId   │
│artistId │
│notes    │
└─────────┘
     │
     │
┌────▼─────────┐
│MaterialUsage │
├──────────────┤
│ id (PK)      │
│ sessionId(FK)│
│ materialId(FK)│
│ quantity     │
└──────────────┘
```

These are currently commented out in `backend/prisma/schema.prisma`.

---

## Table Descriptions

### User
Stores all users (clients, admin, future artists/receptionist)

**Fields:**
- `id`: Unique identifier (CUID)
- `email`: User email (unique)
- `name`: Full name
- `phone`: Contact number (optional)
- `role`: ADMIN | ARTIST | RECEPTIONIST | CLIENT
- `createdAt`: Account creation timestamp
- `updatedAt`: Last update timestamp

**Relations:**
- `clientAppointments`: Appointments where user is the client
- `artistAppointments`: Appointments where user is the artist
- `payments`: Payments received by this user
- `sessions`: Sessions performed by this user

---

### Appointment
Core entity - represents a tattoo appointment

**Fields:**
- `id`: Unique identifier (CUID)
- `date`: Appointment date and time
- `duration`: Duration in minutes (default 60)
- `description`: Client's tattoo description/request
- `status`: PENDING_CONFIRMATION | CONFIRMED | COMPLETED | CANCELLED | NO_SHOW
- `depositAmount`: Deposit required (default 200.00 MXN)
- `depositReceived`: Boolean flag
- `totalPrice`: Final price (nullable until confirmed)
- `consentSigned`: Boolean - informed consent status
- `consentSignedAt`: Timestamp of consent
- `notes`: Internal notes
- `createdAt`: Booking creation timestamp
- `updatedAt`: Last update timestamp

**Relations:**
- `client`: User who booked (FK to User)
- `artist`: Assigned artist (FK to User, nullable)
- `payments`: All payments for this appointment
- `session`: Work session record (one-to-one)

**Business Logic:**
- If `totalPrice` > 2000 MXN: `depositAmount` = totalPrice * 0.30
- Else: `depositAmount` = 200.00 MXN
- No refunds on deposits

---

### Payment
Tracks all financial transactions

**Fields:**
- `id`: Unique identifier (CUID)
- `amount`: Payment amount
- `type`: CASH | BANK_TRANSFER
- `status`: PENDING | PARTIAL | COMPLETED
- `isDeposit`: Boolean flag
- `notes`: Payment notes/reference number
- `createdAt`: Payment timestamp
- `updatedAt`: Last update timestamp

**Relations:**
- `appointment`: Linked appointment (FK)
- `receivedBy`: User who received payment (FK to User)

**Business Logic:**
- First payment is typically the deposit
- Final payment = totalPrice - depositAmount

---

### Material (MVP)
Inventory items (ink, needles, gloves, etc.)

**Fields:**
- `id`: Unique identifier (CUID)
- `name`: Material name
- `category`: Type (ink, needles, consumables, etc.)
- `quantity`: Current stock level (manually updated by Alejandra)
- `unit`: Unit of measurement (default "unidad")
- `restockThreshold`: Alert when below this percentage (default 25%)
- `costPerUnit`: Cost per unit (optional)
- `createdAt`: Record creation timestamp
- `updatedAt`: Last update timestamp

**Relations:**
- None in MVP (no usage tracking per session)

**Business Logic (MVP - Simplified):**
- Alert when: quantity drops below restockThreshold percentage
- Alejandra manually updates quantity via "Add Stock" / "Remove Stock" buttons
- No automatic deduction based on sessions

---

### Session (POST-MVP - Currently Not Implemented)
**Status:** Commented out in schema - can be enabled if Alejandra requests detailed session tracking

Represents actual work performed (post-appointment)

**Fields:**
- `id`: Unique identifier (CUID)
- `date`: Session date (defaults to now)
- `notes`: Work notes, design details
- `duration`: Actual time spent (minutes)
- `createdAt`: Record creation timestamp
- `updatedAt`: Last update timestamp

**Relations:**
- `appointment`: Linked appointment (FK, unique one-to-one)
- `artist`: Artist who performed work (FK to User)
- `materialsUsed`: Materials consumed in session

---

### MaterialUsage (POST-MVP - Currently Not Implemented)
**Status:** Commented out in schema - can be enabled if Alejandra requests per-session material tracking

Tracks materials consumed per session

**Fields:**
- `id`: Unique identifier (CUID)
- `quantity`: Amount used
- `createdAt`: Usage timestamp

**Relations:**
- `session`: Session where used (FK)
- `material`: Material consumed (FK)

**Business Logic:**
- On creation: Material.quantity -= quantity

---

### BlockedDate
Dates when studio is closed

**Fields:**
- `id`: Unique identifier (CUID)
- `date`: Blocked date
- `reason`: Reason (vacation, holiday, etc.)
- `createdAt`: Record creation timestamp

**Business Logic:**
- Booking calendar excludes these dates

---

## Indexes

**Critical for performance:**

```prisma
// Appointment indexes
@@index([date])           // Calendar queries
@@index([clientId])       // Client history
@@index([status])         // Filter by status

// Payment indexes
@@index([appointmentId])  // Payment lookup
@@index([createdAt])      // Financial reports

// MaterialUsage indexes
@@index([sessionId])      // Session materials
@@index([materialId])     // Material history

// BlockedDate indexes
@@index([date])           // Calendar availability

// Material indexes
@@index([quantity])       // Low stock alerts
```

---

## Initial Data Requirements

### Seed Data (for development)

**Admin User:**
```json
{
  "email": "alejandra@tatoondra.com",
  "name": "Alejandra",
  "phone": "+52...",
  "role": "ADMIN"
}
```

**Test Client:**
```json
{
  "email": "test@example.com",
  "name": "Test Client",
  "phone": "+521234567890",
  "role": "CLIENT"
}
```

**Sample Materials:**
```json
[
  {
    "name": "Black Ink 30ml",
    "category": "Ink",
    "quantity": 10,
    "unit": "bottle",
    "restockThreshold": 25,
    "costPerUnit": 150.00
  },
  {
    "name": "Disposable Needles (Box)",
    "category": "Needles",
    "quantity": 5,
    "unit": "box",
    "restockThreshold": 25,
    "costPerUnit": 200.00
  }
]
```

---

## Migration Strategy

**MVP Approach (Single Migration - Week 1):**

All 5 MVP tables created in initial migration:
- User (admin + clients)
- Appointment (bookings)
- Payment (financial records)
- Material (inventory - simple tracking)
- BlockedDate (vacations/holidays)

**Post-MVP (If Requested):**
- Session table (uncomment in schema)
- MaterialUsage table (uncomment in schema)
- Run: `npx prisma migrate dev --name add-session-tracking`

---

## Data Validation Rules

**Appointment:**
- `date` must be in the future (for new bookings)
- `duration` must be > 0
- `depositAmount` must be > 0
- `totalPrice` must be >= depositAmount (if set)

**Payment:**
- `amount` must be > 0
- Cannot exceed remaining balance

**Material:**
- `quantity` must be >= 0
- `restockThreshold` must be between 0-100

---

## Queries to Prepare

### Dashboard
```sql
-- Today's appointments
SELECT * FROM Appointment
WHERE DATE(date) = CURRENT_DATE
AND status IN ('CONFIRMED', 'PENDING_CONFIRMATION')
ORDER BY date;

-- Pending deposit confirmations
SELECT * FROM Appointment
WHERE depositReceived = false
AND status = 'PENDING_CONFIRMATION';

-- Low stock materials
SELECT * FROM Material
WHERE (quantity::float / COALESCE(
  (SELECT quantity FROM Material m2 WHERE m2.id = Material.id LIMIT 1),
  quantity
)) * 100 < restockThreshold;
```

### Financial Reports
```sql
-- Monthly revenue
SELECT
  DATE_TRUNC('month', createdAt) as month,
  SUM(amount) as total_revenue,
  COUNT(*) as payment_count,
  SUM(CASE WHEN type = 'CASH' THEN amount ELSE 0 END) as cash,
  SUM(CASE WHEN type = 'BANK_TRANSFER' THEN amount ELSE 0 END) as transfer
FROM Payment
WHERE createdAt >= DATE_TRUNC('month', CURRENT_DATE - INTERVAL '6 months')
GROUP BY month
ORDER BY month DESC;
```

---

## Notes for Thesis

- **Normalization:** Schema is in 3NF (Third Normal Form)
- **Scalability:** Indexed on high-query fields
- **Data Integrity:** Foreign key constraints enforced
- **Audit Trail:** All tables have createdAt/updatedAt timestamps
- **Flexibility:** Supports future multi-artist expansion
- **Business Logic:** Embedded constraints match real-world requirements
