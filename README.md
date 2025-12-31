# Fursa Admin Dashboard

A modern, clean, and responsive admin dashboard built with Next.js 14 for the Fursa freelancing platform.

## Features

### Authentication
- JWT-based authentication with token refresh
- Login page with remember me functionality
- Protected routes with automatic redirect

### User Management
- **Admins**: Full CRUD operations for admin accounts
- **Customers**: Manage customer profiles and project history
- **Freelancers**: View profiles, skills, ratings, and project gallery
- **Contributors**: Manage course contributors

### Project Management
- View and manage all platform projects
- Project categories and statuses management
- Filter and search functionality
- Budget and timeline tracking

### Offers Management
- View all project offers from freelancers
- Accept/reject offer functionality
- Offer status tracking

### Course Management
- Manage educational courses
- Course fields/categories management
- Enrollment tracking and ratings

### Ratings & Reviews
- View customer ratings for freelancers
- Rating moderation capabilities

### Notifications
- Send platform-wide notifications
- Target specific user groups (all, freelancers, customers, contributors)
- Track read rates and engagement

### Dashboard Analytics
- User growth charts
- Project status distribution
- Revenue trends
- Projects by category
- Top rated freelancers
- Recent activity feed

### UI/UX Features
- **Dark/Light Mode**: Toggle between themes
- **Responsive Design**: Works on all devices
- **Collapsible Sidebar**: More screen space when needed
- **Data Tables**: Sortable, searchable, paginated tables
- **Modern Charts**: Interactive Recharts visualizations

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI primitives with custom styling
- **State Management**: Zustand
- **Data Fetching**: TanStack Query (React Query)
- **Charts**: Recharts
- **Tables**: TanStack Table
- **Forms**: React Hook Form with Zod validation
- **HTTP Client**: Axios
- **Icons**: Lucide React
- **Date Handling**: date-fns

## Project Structure

```
src/
├── app/
│   ├── (auth)/
│   │   ├── layout.tsx
│   │   └── login/
│   │       └── page.tsx
│   ├── (dashboard)/
│   │   ├── layout.tsx
│   │   ├── page.tsx (Dashboard)
│   │   ├── users/
│   │   │   ├── admins/
│   │   │   ├── customers/
│   │   │   ├── freelancers/
│   │   │   └── contributors/
│   │   ├── projects/
│   │   │   ├── page.tsx
│   │   │   ├── categories/
│   │   │   └── statuses/
│   │   ├── offers/
│   │   ├── courses/
│   │   │   ├── page.tsx
│   │   │   └── fields/
│   │   ├── ratings/
│   │   ├── notifications/
│   │   └── settings/
│   ├── globals.css
│   └── layout.tsx
├── components/
│   ├── dashboard/
│   │   ├── stat-card.tsx
│   │   ├── activity-feed.tsx
│   │   └── charts/
│   ├── layout/
│   │   ├── sidebar.tsx
│   │   ├── header.tsx
│   │   └── breadcrumb.tsx
│   ├── providers/
│   │   ├── theme-provider.tsx
│   │   └── query-provider.tsx
│   ├── shared/
│   │   ├── data-table.tsx
│   │   ├── confirm-dialog.tsx
│   │   └── loading-skeleton.tsx
│   └── ui/
│       ├── button.tsx
│       ├── card.tsx
│       ├── dialog.tsx
│       └── ... (more UI components)
├── lib/
│   ├── api/
│   │   ├── client.ts
│   │   ├── auth.ts
│   │   ├── users.ts
│   │   ├── projects.ts
│   │   ├── courses.ts
│   │   └── notifications.ts
│   ├── stores/
│   │   ├── auth-store.ts
│   │   └── sidebar-store.ts
│   ├── types/
│   │   └── index.ts
│   └── utils/
│       └── cn.ts
└── ...
```

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd fursa-dashboard
```

2. Install dependencies:
```bash
pnpm install
```

3. Create environment variables:
```bash
cp .env.example .env.local
```

4. Update the `.env.local` file with your API base URL:
```
NEXT_PUBLIC_API_URL=https://your-api-url.com/api
```

5. Run the development server:
```bash
pnpm dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
pnpm build
pnpm start
```

## API Integration

The dashboard is designed to work with a RESTful API. Update the `NEXT_PUBLIC_API_URL` environment variable to point to your backend.

### Authentication Endpoints
- `POST /Auth/login` - User login
- `POST /Auth/refresh-token` - Refresh access token
- `POST /Auth/forgot-password` - Password reset request
- `POST /Auth/reset-password` - Reset password

### User Endpoints
- `GET /Admins` - List all admins
- `GET /Customers` - List all customers
- `GET /Freelancers` - List all freelancers
- `GET /Contributors` - List all contributors

### Project Endpoints
- `GET /Projects` - List all projects
- `GET /ProjectCategories` - List project categories
- `GET /ProjectStatuses` - List project statuses

### Course Endpoints
- `GET /Courses` - List all courses
- `GET /CourseFields` - List course fields

### Other Endpoints
- `GET /Offers` - List all offers
- `GET /Ratings` - List all ratings
- `POST /Notifications` - Send notifications

## Demo Mode

For demonstration purposes, the dashboard includes mock data. To enable real API integration:

1. Update `src/lib/api/auth.ts`:
   - Change `isAuthenticated()` to check for actual auth tokens

2. Remove mock data from page components and use the API functions from `src/lib/api/`

## Customization

### Theme Colors

Edit `tailwind.config.ts` to customize the color scheme:

```ts
theme: {
  extend: {
    colors: {
      primary: { ... },
      secondary: { ... },
      // ... other colors
    }
  }
}
```

### Adding New Pages

1. Create a new folder in `src/app/(dashboard)/`
2. Add a `page.tsx` file
3. Update the sidebar navigation in `src/components/layout/sidebar.tsx`

## License

MIT License

## Support

For questions or issues, please open a GitHub issue.
