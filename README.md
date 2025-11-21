# Housing Management Platform - Frontend

**Direct Landlord-to-Tenant Platform** - Eliminating agent fees to make housing more affordable in Nigeria.

## 🎯 Project Vision

A platform that connects property owners (landlords) directly with tenants, removing the middleman (agents) and their associated costs, thereby making housing more accessible and affordable.

## Features

### 🏢 For Landlords (ADMIN Role)
- ✅ **Property Management:** Create and manage properties with multiple buildings
- ✅ **Building Management:** Add buildings with addresses, GPS coordinates, and floor plans
- ✅ **Unit Management:** Create units, set rent amounts, track occupancy status
- ✅ **Lease Management:** Create and manage leases, track lease status and history
- ✅ **Tenant Management:** View tenant profiles, lease history, and contact information
- 🚧 **Invoice & Payment Tracking:** Create invoices, track payments for all properties
- 🚧 **Maintenance Management:** View and resolve maintenance requests from tenants

### 🏠 For Tenants (USER Role)
- **Browse Units:** Search and filter available units across Nigeria
- **Apply for Lease:** Submit lease applications directly to landlords
- **Payment Management:** Pay rent and invoices, view payment history
- **Maintenance Requests:** Submit and track maintenance requests with photos
- **Lease Renewals:** Request lease renewals when approaching end date
- **Profile Management:** Update profile, emergency contacts

## Tech Stack

- **Framework:** React 19 with TypeScript
- **Build Tool:** Vite 7
- **Routing:** React Router v7
- **Styling:** Tailwind CSS v4 with CSS Variables
- **Component Library:** shadcn/ui (Radix UI primitives)
- **State Management:** TanStack React Query v5
- **Form Handling:** React Hook Form + Zod validation
- **Icons:** Lucide React
- **Notifications:** Sonner
- **Theme:** next-themes (dark/light mode)
- **HTTP Client:** Axios
- **Package Manager:** Bun

## Data Model

The platform follows this hierarchy:

```
Property → Building → Unit ──────┐
              ↓                   │
          Address                 ├─ Lease ──────┐
                                  │              │
User (role: USER) ────────────────┘              │
    │                                            │
    └─ Tenant ───────────────────────────────────┘
```

- **Property:** Top-level entity (e.g., "Sunrise Apartments") ✅
- **Building:** Physical structure with address and GPS coordinates ✅
- **Unit:** Individual rentable space (bedrooms, bathrooms, rent, status) ✅
- **Lease:** Agreement between landlord and tenant for a specific unit ✅
- **Tenant:** Extended user profile with emergency contacts and move dates ✅

### Entity Features

**Property**
- Title, description, type (APARTMENT, HOUSE, HOSTEL)
- Linked to multiple buildings
- Owner relationship

**Building**
- Name, number of floors
- Full address (street, city, state, postal code, country)
- GPS coordinates (latitude, longitude) with geolocation button
- Belongs to one property

**Unit**
- Unit number, floor
- Bedrooms, bathrooms, square footage
- Rent amount, deposit amount
- Status: AVAILABLE, OCCUPIED, MAINTENANCE, RESERVED
- Belongs to one property and optionally one building

**Lease**
- Start date, end date
- Rent amount, security deposit
- Status: ACTIVE, PENDING, TERMINATED, EXPIRED
- Links one unit to one tenant

**Tenant**
- Linked to user account (role: USER)
- Emergency contact
- Move-in/move-out dates
- Lease history

## User Roles

| Role | Description |
|------|-------------|
| **ADMIN** | Property owners/landlords who list and manage their properties |
| **USER** | Tenants who search for, rent, and manage their leases |

## Prerequisites

- [Bun](https://bun.sh) v1.2+ installed
- Node.js v20+ (for compatibility)
- Git

## Getting Started

### 1. Clone the repository

```bash
git clone <repository-url>
cd hm-web
```

### 2. Install dependencies

```bash
bun install
```

### 3. Configure environment variables

Copy the example environment file:

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```env
VITE_API_BASE_URL=http://localhost:3000/api/v1
VITE_APP_NAME=Housing Management Platform
VITE_APP_VERSION=1.0.0
VITE_TOKEN_EXPIRY_MINUTES=15
VITE_REFRESH_TOKEN_EXPIRY_DAYS=7
VITE_ENABLE_NOTIFICATIONS=true
VITE_ENV=development
```

### 4. Run the development server

```bash
bun run dev
```

The application will be available at [http://localhost:5173](http://localhost:5173)

## Available Scripts

- `bun run dev` - Start development server
- `bun run build` - Build for production
- `bun run preview` - Preview production build
- `bun run lint` - Run ESLint

## Project Structure

```
hm-web/
├── src/
│   ├── assets/          # Static assets
│   ├── components/      # React components
│   │   ├── ui/         # shadcn/ui components (14 installed) ✅
│   │   ├── layout/     # Layout components ✅
│   │   ├── admin/      # AdminSidebar ✅
│   │   └── shared/     # Shared components
│   ├── pages/          # Page components
│   │   ├── auth/       # Login, Register, Reset Password ✅
│   │   ├── admin/      # Landlord pages ✅
│   │   │   ├── Dashboard.tsx           ✅
│   │   │   ├── properties/             ✅
│   │   │   ├── buildings/              ✅
│   │   │   ├── units/                  ✅
│   │   │   ├── leases/                 ✅
│   │   │   └── tenants/                ✅
│   │   ├── user/       # Tenant pages (upcoming)
│   │   └── public/     # Public browse, landing page
│   ├── hooks/
│   │   └── queries/    # React Query hooks ✅
│   │       ├── useProperties.ts        ✅
│   │       ├── useBuildings.ts         ✅
│   │       ├── useUnits.ts             ✅
│   │       ├── useLeases.ts            ✅
│   │       └── useTenants.ts           ✅
│   ├── contexts/       # AuthContext ✅
│   ├── lib/
│   │   ├── api/        # API service layer ✅
│   │   │   ├── properties.ts           ✅
│   │   │   ├── buildings.ts            ✅
│   │   │   ├── units.ts                ✅
│   │   │   ├── leases.ts               ✅
│   │   │   └── tenants.ts              ✅
│   │   ├── validators/ # Zod schemas ✅
│   │   │   ├── property.ts             ✅
│   │   │   ├── building.ts             ✅
│   │   │   ├── unit.ts                 ✅
│   │   │   ├── lease.ts                ✅
│   │   │   └── tenant.ts               ✅
│   │   ├── api-client.ts               ✅
│   │   └── query-client.ts             ✅
│   ├── types/          # TypeScript definitions ✅
│   ├── config/         # App configuration ✅
│   │   ├── routes.ts                   ✅
│   │   └── constants.ts                ✅
│   ├── layouts/        # Layout wrappers ✅
│   │   └── AdminLayout.tsx             ✅
│   └── routes/         # Route definitions ✅
├── tests/
├── e2e/
└── public/
```

## Key Routes

### Public
- `/` - Landing page
- `/browse` - Browse available units (public)
- `/login`, `/register` - Authentication

### Admin (Landlords)
- `/admin/dashboard` - Overview of properties and units ✅
- `/admin/properties` - Manage properties ✅
- `/admin/buildings` - Manage buildings within properties ✅
- `/admin/units` - Manage individual units ✅
- `/admin/leases` - Manage leases and tenant agreements ✅
- `/admin/tenants` - View tenant profiles and history ✅
- `/admin/payments` - Track all payments 🚧
- `/admin/invoices` - Create and manage invoices 🚧
- `/admin/maintenance` - Handle maintenance requests 🚧

### User (Tenants)
- `/user/dashboard` - Tenant dashboard
- `/user/browse` - Search for available units
- `/user/leases` - My active and past leases
- `/user/payments` - Payment history
- `/user/invoices` - Unpaid invoices
- `/user/maintenance` - Submit and track maintenance requests
- `/user/profile` - Profile and emergency contacts

## Authentication

**JWT-based** with refresh tokens:
- Access Token: 15 minutes (memory)
- Refresh Token: 7 days (HttpOnly cookie)
- Auto-refresh on expiry
- Session persistence on page reload

## Development Status

### ✅ Completed Phases

#### **Phase 1: Authentication & Foundation**
- ✅ JWT-based authentication (Login, Register, Password Reset)
- ✅ API client with Axios interceptors and auto-refresh
- ✅ Protected and role-based route guards
- ✅ Type definitions matching Prisma schema
- ✅ React Query setup with caching strategies
- ✅ Theme provider (dark/light mode)
- ✅ Toast notifications (Sonner)
- ✅ Form validation with Zod schemas

#### **Phase 2A: Admin Dashboard Layout**
- ✅ Responsive admin layout with sidebar navigation
- ✅ Nigerian states and property types constants
- ✅ Permission configuration for ADMIN/USER roles
- ✅ Dashboard stats and overview page

#### **Phase 2B: Property Management**
- ✅ Property CRUD operations (Create, Read, Update, Delete)
- ✅ Property list with search and filters
- ✅ Property detail page with building count
- ✅ Property form with validation
- ✅ Type-safe API client and React Query hooks

#### **Phase 2C: Building & Unit Management**
- ✅ Buildings CRUD with address management
- ✅ **Geolocation integration** - GPS coordinates with "Use My Location" button
- ✅ Nigerian states dropdown in building forms
- ✅ Buildings list filtered by property
- ✅ Units CRUD with full details (bedrooms, bathrooms, sqft, rent)
- ✅ **Cascading dropdowns** - Property → Building selection
- ✅ Unit status management (AVAILABLE, OCCUPIED, MAINTENANCE, RESERVED)
- ✅ Status color coding and badges
- ✅ Units list with comprehensive filters
- ✅ Integration: Property → Building → Unit hierarchy

#### **Phase 2D: Tenant & Lease Management**
- ✅ Leases CRUD with status tracking (ACTIVE, PENDING, TERMINATED, EXPIRED)
- ✅ Lease form with unit and tenant selection
- ✅ Lease detail page with financial stats
- ✅ Tenant profiles with contact information
- ✅ Tenant list with search functionality
- ✅ Tenant detail showing all lease history
- ✅ **Active lease display** on unit detail pages
- ✅ **Current residence card** on tenant profiles
- ✅ Integration: Unit ↔ Lease ↔ Tenant relationships

### 🚧 In Progress (Phase 2E)
- Payment tracking and history
- Invoice generation and management
- Payment gateway integration prep

### 📋 Upcoming (Phase 3-5)
- Unit photo upload and gallery
- Maintenance request system with attachments
- Lease application flow for tenants
- Payment gateway integration (Paystack/Flutterwave)
- Notification system (in-app and email)
- Public browse page for tenants
- Tenant dashboard and rental history

## API Integration

### Implemented Endpoints ✅

**Properties**
- ✅ `GET /properties` - List with pagination and filters
- ✅ `POST /properties` - Create property
- ✅ `GET /properties/:id` - Property details
- ✅ `PATCH /properties/:id` - Update property
- ✅ `DELETE /properties/:id` - Delete property

**Buildings**
- ✅ `GET /buildings?propertyId=` - List with filters
- ✅ `POST /buildings` - Create building (with address & GPS)
- ✅ `GET /buildings/:id` - Building details
- ✅ `PATCH /buildings/:id` - Update building
- ✅ `DELETE /buildings/:id` - Delete building

**Units**
- ✅ `GET /units?status=&propertyId=&buildingId=` - Browse with filters
- ✅ `POST /units` - Create unit
- ✅ `GET /units/:id` - Unit details with leases
- ✅ `PATCH /units/:id` - Update unit
- ✅ `DELETE /units/:id` - Delete unit

**Leases**
- ✅ `GET /leases?unitId=&tenantId=&status=` - List with filters
- ✅ `POST /leases` - Create lease
- ✅ `GET /leases/:id` - Lease details
- ✅ `PATCH /leases/:id` - Update lease
- ✅ `DELETE /leases/:id` - Delete lease

**Tenants**
- ✅ `GET /tenants` - List tenants
- ✅ `POST /tenants` - Create tenant profile
- ✅ `GET /tenants/:id` - Tenant details with lease history
- ✅ `PATCH /tenants/:id` - Update tenant
- ✅ `DELETE /tenants/:id` - Delete tenant

### Upcoming Endpoints 🚧

**Payments & Invoices**
- 🚧 `GET /payments` - Payment history
- 🚧 `POST /payments` - Make payment
- 🚧 `GET /invoices` - List invoices
- 🚧 `POST /invoices` - Create invoice

**Maintenance**
- 🚧 `GET /maintenance` - List requests
- 🚧 `POST /maintenance` - Create request
- 🚧 `PATCH /maintenance/:id/status` - Update status
- 🚧 `POST /maintenance/:id/attachments` - Upload files

**Response Format**
All list endpoints return paginated responses:
```typescript
{
  status: "success",
  data: {
    items: [...],
    totalDocs: number,
    totalPages: number,
    currentPage: number,
    itemsPerPage: number
  }
}
```

## Nigerian Context

- **Currency:** NGN (Nigerian Naira)
- **States:** All 36 states + FCT supported
- **Payment Gateways:** Paystack, Flutterwave integration planned
- **Property Types:** Apartments, Houses, Hostels

## Testing Strategy

- **Unit Tests:** Vitest
- **E2E Tests:** Playwright
- **Coverage Goal:** 70%+

## Accessibility

Following WCAG 2.1 AA standards:
- Keyboard navigation
- Screen reader support
- Sufficient color contrast
- Semantic HTML
- ARIA labels

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Create a feature branch
2. Make your changes
3. Write/update tests
4. Ensure linting passes (`bun run lint`)
5. Submit a pull request

## Deployment

Compatible with:
- Vercel
- Netlify
- AWS S3 + CloudFront
- Any static hosting service

### Build for Production

```bash
bun run build
```

Output will be in `dist/` directory.

## Performance

- Production bundle: ~713KB (minified, gzipped: ~204KB)
- Code splitting by route
- React Query caching (2-5 min stale time)
- Optimistic updates for mutations
- Image optimization (lazy loading planned)
- Tree-shaking and dead code elimination

## License

[Your License Here]

## Contact

For questions or support: [your-email@example.com]

---

**Building affordable housing solutions for Nigeria** 🇳🇬

Made with ❤️ using React, TypeScript, and Vite
