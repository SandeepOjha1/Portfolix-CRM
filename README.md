# Portfolix CRM — Client Lead Management System (Mini CRM)

> A production-quality, responsive Client Lead Management System (Mini CRM) built with the **MERN** stack (MongoDB, Express.js, React + Vite, Node.js). Designed for SaaS businesses and administrative teams to track, qualify, and convert website-generated client inquiries into revenue.

---

## 📸 Design & UI/UX Alignment

The application strictly reflects the modern SaaS dashboard design specifications:

1. **Dashboard Analytics (Image 1)**: Key business KPI gauges ("Month Sales", "Avg monthly conversion"), dynamic lead counter cards with trend pills, horizontal service conversion splits (UI/UX Design, Flutter Development, Digital Marketing, Python Fullstack), customer acquisition source donut chart, monthly sales table, and circular customer report indicators.
2. **CRM Table & Filter Toolbar (Image 2)**: Sleek table layout with avatars, company badges, live status pill selector, lead score rating (`4.5/5`), overdue follow-up flags, instant search, multi-faceted filtering (Status, Source, Priority), CSV download, and pagination controls.
3. **Lead Details & Activity Timeline (Image 3)**: Chronological vertical activity stream with dedicated icon nodes (Phone Calls, Emails Sent, Meetings, Notes, Follow-ups), a `+ Log Activity` dialog, internal team notes manager, deal value progress bar, and primary client contact details.
4. **Public Website Contact Form (Image 4)**: A dedicated public customer-facing contact portal with brand navigation, inquiry form inputs (Name, Email, Phone, Company, Message), anti-spam rate limiting, and instant MongoDB synchronization into the admin dashboard.

---

## 🛠️ Technology Stack

### Frontend
- **Framework**: React.js 18 with Vite
- **Styling**: Tailwind CSS with custom glassmorphism & slate SaaS palette
- **Icons**: Lucide React Icons
- **Data Visualizations**: Recharts (Pie/Donut charts, Area charts, Bar charts)
- **Routing**: React Router DOM (v7) with protected route guards
- **HTTP Client**: Axios with automatic JWT interceptors and 401 redirect handlers
- **State Management**: React Context (`AuthContext`, `ToastContext`)

### Backend
- **Runtime**: Node.js
- **Server Framework**: Express.js (RESTful architecture)
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens) with 30-day persistence
- **Password Security**: bcrypt.js with 10 salt rounds
- **Security & Protection**: `express-rate-limit` (brute-force login protection & contact form anti-spam), CORS, Input sanitization, and centralized error handling middleware
- **Logging**: Morgan HTTP logger

---

## 📂 Project Structure

```text
CRM/
├── package.json               # Root scripts for running client, server & seed
├── README.md                  # Comprehensive setup & API documentation
├── client/                    # React Vite Frontend Application
│   ├── index.html             # HTML5 template with Inter font
│   ├── package.json           # Frontend dependencies
│   ├── vite.config.js         # Vite configuration with /api reverse proxy
│   ├── tailwind.config.js     # Tailwind design system configuration
│   ├── postcss.config.js      # PostCSS setup
│   ├── .env.example           # Client environment template
│   └── src/
│       ├── main.jsx           # App entry point
│       ├── App.jsx            # Routing configuration (Public & Protected)
│       ├── index.css          # Base CSS, custom scrollbars, and badges
│       ├── components/        # Reusable UI components
│       │   ├── Sidebar.jsx          # Dark sidebar navigation (Image 1)
│       │   ├── Header.jsx           # Search bar, notifications, and badges
│       │   ├── PrivateRoute.jsx     # Authentication route guard
│       │   ├── LeadModal.jsx        # Add & Edit Lead modal form
│       │   ├── DeleteModal.jsx      # Confirmation modal dialog
│       │   └── ActivityLogModal.jsx # Log call/meeting/email dialog (Image 3)
│       ├── context/           # Global application state
│       │   ├── AuthContext.jsx      # Authentication & admin session state
│       │   └── ToastContext.jsx     # Modern floating toast notifications
│       ├── layouts/
│       │   └── DashboardLayout.jsx  # Responsive SaaS dashboard shell
│       ├── pages/
│       │   ├── Login.jsx            # Admin login with 1-click demo fill
│       │   ├── Dashboard.jsx        # Analytics & KPIs dashboard (Image 1)
│       │   ├── Leads.jsx            # CRM table with filters & CSV (Image 2)
│       │   ├── LeadDetails.jsx      # Profile & Activity timeline (Image 3)
│       │   ├── FollowUps.jsx        # Follow-up reminders (Overdue, Today)
│       │   ├── Analytics.jsx        # Deep-dive conversion funnel & trends
│       │   ├── Profile.jsx          # Admin profile & security settings
│       │   └── Contact.jsx          # Public website contact page (Image 4)
│       └── services/
│           └── api.js               # Axios instance with auth interceptor
└── server/                    # Node.js Express Backend API
    ├── server.js              # Express app entry point & static file server
    ├── package.json           # Server dependencies & scripts
    ├── test-api.js            # Automated 13-step integration test suite
    ├── .env                   # Environment variables
    ├── .env.example           # Example environment template
    ├── config/
    │   └── db.js              # Mongoose MongoDB connection manager
    ├── controllers/
    │   ├── authController.js        # Login, admin verification, profile
    │   ├── leadController.js        # CRUD, filtering, search, CSV export
    │   ├── noteController.js        # Internal notes CRUD
    │   ├── activityController.js    # Activity timeline logging
    │   ├── dashboardController.js   # DB aggregation & analytics metrics
    │   ├── contactController.js     # Public contact form submission
    │   └── followUpController.js    # Follow-ups schedule categorization
    ├── middleware/
    │   ├── auth.js                  # JWT Bearer token protection
    │   ├── errorHandler.js          # Centralized error handler
    │   └── rateLimiter.js           # Rate limiting for spam & brute force
    ├── models/
    │   ├── Admin.js                 # Admin user schema with bcrypt hook
    │   ├── Lead.js                  # Lead schema with compound indexes
    │   └── Activity.js              # Chronological activity timeline schema
    ├── routes/
    │   ├── authRoutes.js            # /api/auth
    │   ├── leadRoutes.js            # /api/leads
    │   ├── dashboardRoutes.js       # /api/dashboard
    │   ├── contactRoutes.js         # /api/contact
    │   └── followUpRoutes.js        # /api/followups
    └── utils/
        └── seed.js                  # Rich seed dataset with realistic leads
```

---

## 🗄️ Database Architecture

### 1. `Admin` Collection
| Field | Type | Description |
|---|---|---|
| `name` | String | Full name of administrator |
| `email` | String (Unique, Lowercase) | Admin login email address |
| `password` | String (Hashed) | Bcrypt salted hash (min 6 characters) |
| `role` | String | `admin` or `superadmin` |
| `avatar` | String | Profile photo URL |
| `lastLogin` | Date | Timestamp of most recent authentication |
| `createdAt` | Date | Creation timestamp |

### 2. `Lead` Collection
| Field | Type | Description |
|---|---|---|
| `name` | String | Client contact name |
| `email` | String (Indexed) | Client email address |
| `phone` | String | Phone number |
| `company` | String | Organization / Brand name |
| `source` | String (Enum) | `Website`, `Referral`, `Social Media`, `Advertisement`, `Other` |
| `subject` | String | Inquiry topic / project scope |
| `message` | String | Initial client message / requirements |
| `status` | String (Enum) | `New`, `Contacted`, `Qualified`, `Converted`, `Lost` |
| `priority` | String (Enum) | `Low`, `Medium`, `High` |
| `score` | Number | Qualification score (0 - 100) |
| `dealValue` | Number | Estimated deal contract value in USD |
| `assignedTo` | String | Assigned account executive |
| `followUpDate` | Date (Indexed) | Scheduled date for next client touchpoint |
| `followUpStatus`| String (Enum) | `None`, `Scheduled`, `Overdue`, `Completed` |
| `notes` | Subdocuments Array | `[{ content, createdBy, createdAt, updatedAt }]` |
| `createdAt` | Date (Indexed) | Lead capture timestamp |
| `updatedAt` | Date | Record modification timestamp |

*Indexed fields & full-text compound search on `name`, `email`, `company`, and `subject` ensure sub-10ms query execution.*

### 3. `Activity` Collection
| Field | Type | Description |
|---|---|---|
| `leadId` | ObjectId (Ref: Lead) | Foreign key relation to parent lead |
| `action` | String | Event name (e.g. `Lead Created`, `Phone Call`, `Meeting`, `Status Updated`) |
| `description`| String | Human-readable details / summary |
| `type` | String (Enum) | `system`, `call`, `email`, `meeting`, `note`, `followup` |
| `performedBy`| String | Admin or system agent |
| `metadata` | Mixed Object | Optional attributes (duration, participants, oldStatus, newStatus) |
| `createdAt` | Date (Indexed) | Timeline timestamp |

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **MongoDB**: v5.0 or higher running locally on port `27017` or a MongoDB Atlas connection string.

### 1. Installation

Install dependencies for the root, server, and client:

```bash
# In the project root (e:\CRM)
npm install --prefix server
npm install --prefix client
```

### 2. Configuration

Create or verify the `.env` file in `server/.env`:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://127.0.0.1:27017/mini_crm
JWT_SECRET=crm_super_secret_jwt_key_2026_production_ready
JWT_EXPIRE=30d
```

### 3. Seed Database

Populate MongoDB with the administrator account and realistic client leads matching the reference images:

```bash
npm run seed
```

Output:
```text
[Seed] Connected to MongoDB at mongodb://127.0.0.1:27017/mini_crm
[Seed] Admin created: admin@crm.com / admin123
[Seed] Successfully inserted 12 leads
[Seed] Activities seeded successfully
```

---

## 🔑 Default Administrator Credentials

| Role | Email | Password |
|---|---|---|
| Superadmin | **`admin@crm.com`** | **`admin123`** |

*(A 1-click "Fill Demo Credentials" button is also provided directly on the `/login` screen).*

---

## 💻 Running the Application

### Option A: Development Mode (Hot Reloading)

Run the backend Express server on port 5000 and the Vite frontend on port 3000 simultaneously:

**Terminal 1 (Backend API):**
```bash
npm run server
# Runs at http://localhost:5000
```

**Terminal 2 (Frontend Client):**
```bash
npm run client
# Runs at http://localhost:3000
```

### Option B: Production Unified Server

Build the optimized React bundle and serve both the API and client from a single Express instance:

```bash
# 1. Build React application
npm run build:client

# 2. Start unified server
npm start
# Opens unified application at http://localhost:5000
```

---

## 🧪 Integration Testing

An automated 13-step end-to-end integration test is included:

```bash
npm --prefix server test
```

This verifies:
1. API Health Check (`/api/health`)
2. Admin Login (`POST /api/auth/login`)
3. JWT Authentication Verification (`GET /api/auth/me`)
4. Real-time Dashboard Aggregations (`GET /api/dashboard/stats`)
5. Lead Filtering, Search, & Pagination (`GET /api/leads`)
6. Lead Creation (`POST /api/leads`)
7. Status & Priority Updates (`PUT /api/leads/:id`)
8. Internal Notes Management (`POST /api/leads/:id/notes`)
9. Activity Timeline Logging (`POST /api/leads/:id/activities`)
10. Public Website Contact Form Submission with Rate Limiting (`POST /api/contact`)
11. Follow-up Categorization (`GET /api/followups`)
12. RFC 4180 CSV Export (`GET /api/leads/export/csv`)
13. Lead Cascade Deletion (`DELETE /api/leads/:id`)

---

## 📡 REST API Reference

### Authentication
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/auth/login` | Public (Rate-limited) | Authenticate admin, returns JWT token |
| `GET` | `/api/auth/me` | Private | Retrieve authenticated admin profile |
| `PUT` | `/api/auth/profile` | Private | Update name, email, avatar, or change password |

### Leads
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/leads` | Private | List leads with `search`, `status`, `source`, `priority`, `sortBy`, `page`, `limit` |
| `POST` | `/api/leads` | Private | Create new client lead (auto-logs activity) |
| `GET` | `/api/leads/export/csv` | Private | Download all leads as formatted CSV |
| `GET` | `/api/leads/:id` | Private | Get single lead with populated notes and activity timeline |
| `PUT` | `/api/leads/:id` | Private | Update lead details (auto-logs status/priority changes) |
| `DELETE` | `/api/leads/:id` | Private | Delete lead and cascade delete activities |

### Notes & Activities
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/leads/:id/notes` | Private | Add internal note to lead |
| `PUT` | `/api/leads/:id/notes/:noteId` | Private | Update existing note |
| `DELETE` | `/api/leads/:id/notes/:noteId` | Private | Delete note |
| `GET` | `/api/leads/:id/activities` | Private | Fetch chronological activity timeline |
| `POST` | `/api/leads/:id/activities` | Private | Log Call, Meeting, Email, or Note |

### Dashboard & Analytics
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/dashboard/stats` | Private | Computed stats: totals, conversion rates, trends, splits |

### Follow-ups
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/followups` | Private | Retrieve follow-ups grouped into Overdue, Today, Upcoming |
| `PATCH`| `/api/followups/:id` | Private | Update follow-up status (`Completed`, `Scheduled`) or reschedule date |

### Public Contact Form
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/contact` | Public (Rate-limited) | Submit visitor inquiry; creates lead with status `New` |

---

## 🔒 Security Best Practices Implemented

- **Password Encryption**: All passwords hashed using bcrypt with salt rounds.
- **Stateless Authentication**: JWT tokens with expiration; passwords excluded by default from queries (`select: false`).
- **Rate Limiting**: `express-rate-limit` prevents brute force on `/api/auth/login` and spam submissions on `/api/contact`.
- **Validation**: Strict validation with `validator` for emails, inputs sanitized and trimmed.
- **Protected UI Routes**: Frontend `PrivateRoute` validates session before rendering CRM views.
- **Graceful Error Handling**: Centralized error middleware formats errors consistently without leaking stack traces in production.

---

## 📄 License
This project is open-source under the MIT License.

