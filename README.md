# Housing Management Platform - Frontend

**Direct Landlord-to-Tenant Platform** - Eliminating agent fees to make housing more affordable in Nigeria.

## 🎯 Project Vision

A platform that connects property owners (landlords) directly with tenants, removing the middleman (agents) and their associated costs, thereby making housing more accessible and affordable.

## Features

### 🏢 For Landlords (ADMIN Role)
- **Property Management:** Create and manage properties with multiple buildings
- **Building Management:** Add buildings with addresses and floor plans
- **Unit Management:** Create units with photos, set rent amounts, track occupancy
- **Lease Management:** Approve tenant applications, manage active leases
- **Invoice & Payment Tracking:** Create invoices, track payments for all properties
- **Maintenance Management:** View and resolve maintenance requests from tenants
- **Tenant Management:** View current and past tenants, lease history

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
Property → Building → Unit → Lease
                  ↓
              Address
```

- **Property:** Top-level entity (e.g., "Sunrise Apartments")
- **Building:** Physical structure within a property (e.g., "Block A")
- **Unit:** Individual rentable space with specific details
- **Lease:** Agreement between landlord and tenant for a unit

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
│   │   ├── ui/         # shadcn/ui components (14 installed)
│   │   ├── layout/     # Layout components
│   │   ├── data-display/
│   │   ├── forms/
│   │   ├── navigation/
│   │   └── feedback/
│   ├── pages/          # Page components
│   │   ├── auth/       # Login, Register, Reset Password ✅
│   │   ├── admin/      # Landlord pages
│   │   ├── user/       # Tenant pages
│   │   └── public/     # Public browse, landing page
│   ├── hooks/
│   │   └── queries/    # React Query hooks
│   ├── contexts/       # AuthContext ✅
│   ├── lib/
│   │   ├── api/        # API service layer
│   │   ├── validators/ # Zod schemas
│   │   ├── api-client.ts ✅
│   │   └── query-client.ts ✅
│   ├── types/          # TypeScript definitions ✅
│   ├── config/         # App configuration ✅
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
- `/admin/dashboard` - Overview of properties and units
- `/admin/properties` - Manage properties
- `/admin/buildings` - Manage buildings within properties
- `/admin/units` - Manage individual units with photos
- `/admin/leases` - View and approve lease applications
- `/admin/payments` - Track all payments
- `/admin/invoices` - Create and manage invoices
- `/admin/maintenance` - Handle maintenance requests

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

### ✅ Completed (Phase 1 & 2)
- Authentication system (Login, Register, Password Reset)
- API client with Axios interceptors
- Protected and role-based route guards
- Type definitions matching Prisma schema
- React Query setup
- Theme provider (dark/light mode)
- Toast notifications
- Form validation with Zod

### 🚧 In Progress
- Updating types to match new schema
- Permission configuration for two-role system
- Constants for Nigerian states and property types

### 📋 Next Steps (Phase 3-5)
- Admin layout with sidebar navigation
- Property/Building/Unit CRUD operations
- Unit photo upload and gallery
- Lease application and approval flow
- Payment gateway integration (Paystack/Flutterwave)
- Maintenance request system
- Notification system
- Public browse page for tenants

## API Integration

The frontend expects these API endpoints:

### Properties & Buildings
- `GET /properties` - List properties
- `POST /properties` - Create property
- `GET /buildings?propertyId=` - List buildings
- `POST /buildings` - Create building

### Units
- `GET /units?status=AVAILABLE&city=Lagos` - Browse units
- `GET /units/:id` - Unit details
- `POST /units` - Create unit
- `POST /units/:id/photos` - Upload photos

### Leases
- `GET /leases` - List leases
- `POST /leases/apply` - Apply for lease
- `PATCH /leases/:id/approve` - Approve/reject

### Payments & Invoices
- `GET /payments` - Payment history
- `POST /payments` - Make payment
- `GET /invoices` - List invoices
- `POST /invoices` - Create invoice

### Maintenance
- `GET /maintenance` - List requests
- `POST /maintenance` - Create request
- `PATCH /maintenance/:id/status` - Update status
- `POST /maintenance/:id/attachments` - Upload files

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

- Initial bundle: ~543KB (minified)
- Code splitting by route
- Lazy loading for heavy components
- Image optimization
- React Query caching strategy

## License

[Your License Here]

## Contact

For questions or support: [your-email@example.com]

---

**Building affordable housing solutions for Nigeria** 🇳🇬

Made with ❤️ using React, TypeScript, and Vite
