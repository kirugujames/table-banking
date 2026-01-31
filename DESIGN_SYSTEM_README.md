# SACCO Management Dashboard Design System

## Overview
A comprehensive banking and SACCO (Savings and Credit Cooperative) management dashboard with a complete design system built with React, TypeScript, and Tailwind CSS.

## 🎨 Design System

### Color Palette

#### Primary Colors
- **Primary (Blue)**: `#2563EB` - Trust and security
- **Secondary (Green)**: `#10B981` - Financial transactions and success
- **Accent (Amber)**: `#F59E0B` - Warnings and important actions

#### Status Colors
- **Success (Emerald)**: `#059669` - Successful operations
- **Danger (Red)**: `#DC2626` - Errors and defaults
- **Warning (Orange)**: `#EA580C` - Alerts and warnings
- **Info (Cyan)**: `#0891b2` - Informational messages
- **Purple**: `#8B5CF6` - Disbursed loans
- **Gray**: Various shades for neutrals

### Typography
- **Font Family**: Inter (Google Fonts) for UI
- **Monospace**: JetBrains Mono for code and IDs
- **Font Weights**: 400 (Regular), 500 (Medium), 600 (Semibold), 700 (Bold)
- **Scale**: 12px, 14px, 16px, 18px, 20px, 24px, 30px, 36px (8px grid system)

### Spacing System (8px Grid)
- `4px`, `8px`, `12px`, `16px`, `20px`, `24px`, `32px`, `48px`, `64px`

### Border Radius
- **sm**: 4px
- **md**: 8px
- **lg**: 12px
- **xl**: 16px

### Shadows
- **xs, sm, md, lg, xl** - Increasing depth hierarchy

## 📦 Components

### Core Components

#### Status Badges
- Active, Pending, Approved, Defaulted, Completed, Inactive, Draft, Disbursed, Probation
- Color-coded with dark mode support
- Located in: `/src/app/components/status-badge.tsx`

#### Stat Cards
- Display key metrics with icons
- Support for trend indicators (up/down/neutral)
- Customizable icon colors and backgrounds
- Located in: `/src/app/components/stat-card.tsx`

#### Dashboard Layout
- Responsive sidebar navigation (240px width)
- Collapsible on mobile
- Top header with search, notifications, theme toggle
- User profile menu
- Located in: `/src/app/components/dashboard-layout.tsx`

#### Data Table
- Generic reusable table component
- Sortable columns
- Row actions dropdown
- Empty state handling
- Located in: `/src/app/components/data-table.tsx`

#### Loan Calculator
- Interactive loan calculation
- Sliders for amount, rate, duration
- Real-time payment calculations
- Located in: `/src/app/components/loan-calculator.tsx`

#### Member Detail Modal
- Comprehensive member information
- Tabbed interface (Transactions, Loans, Savings, Documents)
- Quick stats overview
- Action buttons
- Located in: `/src/app/components/member-detail-modal.tsx`

#### Breadcrumb Navigation
- Hierarchical navigation display
- Home icon for dashboard
- Customizable navigation items
- Located in: `/src/app/components/breadcrumb-nav.tsx`

## 📄 Pages

### 1. Dashboard (`/src/app/components/pages/dashboard-page.tsx`)
**Features:**
- Welcome banner with user greeting
- 4 key stat cards (Total Members, Active Loans, Total Savings, Default Rate)
- Savings growth line chart
- Loan distribution pie chart
- Recent activity feed
- Upcoming repayments table
- Quick action buttons

### 2. Members (`/src/app/components/pages/members-page.tsx`)
**Features:**
- Member statistics overview
- Advanced search and filtering
- Member list table with:
  - Member ID, Name with avatar
  - Contact information
  - Status badges
  - Savings balance
  - Loan status
  - Registration date
  - Action menu (View, Edit, Delete)
- Bulk actions support
- Export functionality

### 3. Loans (`/src/app/components/pages/loans-page.tsx`)
**Features:**
- Loan portfolio statistics
- Tabbed interface (All, Pending, Active, Defaulted, Completed)
- Loan application table with:
  - Loan ID and member details
  - Amount and interest rate
  - Status tracking
  - Purpose
  - Repayment progress bar
  - Actions (Approve, Reject, View)
- Advanced filtering by status
- Export and reporting tools

### 4. Savings & Transactions (`/src/app/components/pages/savings-page.tsx`)
**Features:**
- Savings overview statistics
- Monthly deposits vs withdrawals bar chart
- Top savers leaderboard
- Recent transactions table with:
  - Transaction details
  - Color-coded amounts (green for credit, red for debit)
  - Running balance
  - Reference numbers
- Search and filter functionality

### 5. Transactions (`/src/app/components/pages/transactions-page.tsx`)
**Features:**
- Daily transaction summary
- Total in/out/net flow statistics
- Comprehensive transaction table
- Category and status filtering
- Import/export functionality
- Transaction detail view

### 6. Expenses (`/src/app/components/pages/expenses-page.tsx`)
**Features:**
- Expense tracking and management
- Category-wise breakdown (pie chart)
- Monthly expense trends (bar chart)
- Expense table with vendor information
- Budget monitoring
- Pending payments tracking

### 7. Reports & Analytics (`/src/app/components/pages/reports-page.tsx`)
**Features:**
- Pre-built report cards:
  - Member Statement
  - Loan Portfolio Report
  - Default Report
  - Financial Summary
  - Welfare Fund Report
  - Audit Trail
- Financial performance area chart
- Member acquisition analysis
- Loan portfolio health pie chart
- Custom report builder interface
- Export to PDF/Excel

### 8. Settings (`/src/app/components/pages/settings-page.tsx`)
**Features:**
- Accordion-based settings organization
- **Organization Details**: Name, address, contact, logo
- **Financial Settings**: Interest rates, fees
- **Loan Configuration**: Limits, requirements, guarantors
- **Notifications**: Email/SMS settings, event triggers
- **User Roles & Permissions**: Role management matrix
- **Security & Backup**: 2FA, session timeout, automated backups

## 🎯 Features

### Responsive Design
- **Mobile**: Single column, hamburger menu
- **Tablet (768px)**: 2-column layout, overlay sidebar
- **Desktop (1024px+)**: 3-column layout, persistent sidebar
- **Large (1440px+)**: Optimized spacing

### Dark Mode
- Complete dark theme support
- Toggle button in header
- Persistent across navigation
- Optimized color contrast

### Accessibility
- WCAG 2.1 AA compliant color contrast
- Keyboard navigation support
- Screen reader compatible
- Focus indicators
- Semantic HTML

### Data Visualization
- **Recharts** for charts:
  - Line charts (trends)
  - Bar charts (comparisons)
  - Pie charts (distributions)
  - Area charts (performance)
- Responsive chart containers
- Interactive tooltips
- Custom color schemes

## 🛠 Technology Stack

- **React 18.3.1**
- **TypeScript**
- **Tailwind CSS v4**
- **Radix UI** - Accessible component primitives
- **Recharts** - Data visualization
- **Lucide React** - Icon library
- **date-fns** - Date utilities
- **Vite** - Build tool

## 📱 Navigation Structure

```
Dashboard
├── Members
│   ├── Member List
│   ├── Add New Member
│   └── Member Details
├── Loans
│   ├── All Loans
│   ├── Pending Applications
│   ├── Active Loans
│   └── Loan Calculator
├── Savings
│   ├── Savings Overview
│   ├── Deposits
│   └── Withdrawals
├── Transactions
│   ├── All Transactions
│   ├── Import/Export
│   └── Transaction Details
├── Expenses
│   ├── Expense Tracking
│   ├── Categories
│   └── Budget Management
├── Reports
│   ├── Pre-built Reports
│   ├── Analytics Dashboard
│   └── Custom Report Builder
└── Settings
    ├── Organization
    ├── Financial
    ├── Loans
    ├── Notifications
    ├── Roles & Permissions
    └── Security
```

## 🚀 Key Features

### Member Management
- Complete member lifecycle management
- Profile with photo and contact details
- Status tracking (Active, Probation, Inactive)
- Savings and loan history
- Document management
- Transaction history

### Loan Management
- Multi-step loan application process
- Eligibility checking
- Guarantor management
- Approval workflow
- Repayment tracking
- Default monitoring
- Automated calculations

### Financial Tracking
- Real-time balance tracking
- Transaction categorization
- Automated journal entries
- Welfare fund management
- Expense tracking
- Profit/loss reporting

### Reporting & Analytics
- Comprehensive financial reports
- Member statements
- Loan portfolio analysis
- Default risk assessment
- Performance metrics
- Custom report generation
- Export to PDF/Excel

### Security Features
- Role-based access control
- Permission matrix
- 2-Factor authentication support
- Session management
- Audit trail
- Data encryption ready

## 🎨 Design Tokens

All design tokens are centralized in `/src/styles/theme.css`:

```css
/* Primary Colors */
--primary: #2563EB;
--secondary: #10B981;
--accent: #F59E0B;

/* Status Colors */
--status-active: #059669;
--status-pending: #F59E0B;
--status-approved: #2563EB;
--status-defaulted: #DC2626;
--status-completed: #0891b2;

/* Spacing (8px grid) */
--spacing-1: 4px;
--spacing-2: 8px;
--spacing-4: 16px;
--spacing-6: 24px;

/* Border Radius */
--radius-sm: 4px;
--radius-md: 8px;
--radius-lg: 12px;
--radius-xl: 16px;
```

## 📚 Utilities

Mock data and helper functions in `/src/app/lib/mock-data.ts`:

- ID generators (Member, Loan, Transaction, Expense)
- Currency formatting
- Date/time formatting
- Loan calculations
- Initial generation
- Sample data arrays

## 🎯 Best Practices

1. **Consistent Spacing**: Always use the 8px grid system
2. **Color Usage**: Use semantic colors (success, danger, warning)
3. **Typography**: Leverage the built-in font scale
4. **Components**: Reuse existing components before creating new ones
5. **Dark Mode**: Test all features in both light and dark modes
6. **Accessibility**: Ensure keyboard navigation and screen reader support
7. **Responsive**: Design mobile-first, enhance for larger screens

## 🔄 State Management

Currently uses React useState for local state. For production:
- Consider React Query for server state
- Zustand or Context API for global state
- Form state with React Hook Form (already installed)

## 📝 Future Enhancements

- Real-time notifications
- WhatsApp integration
- SMS gateway integration
- Payment gateway integration
- Advanced analytics with AI
- Multi-language support
- Mobile app version
- Offline mode support
- Blockchain integration for transparency

## 📄 License

This is a design system template for SACCO management applications.

---

**Built with ❤️ for Financial Inclusion**
