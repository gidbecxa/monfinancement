# MONFINANCEMENT.CO - MVP PROJECT SPECIFICATION DOCUMENT
## Comprehensive Development Guide for FinTech Funding Platform

---

## TABLE OF CONTENTS

1. [Executive Summary](#1-executive-summary)
2. [Technical Stack & Architecture](#2-technical-stack--architecture)
3. [Database Schema & Data Management](#3-database-schema--data-management)
4. [Design System & UI/UX Specifications](#4-design-system--uiux-specifications)
5. [Feature Specifications](#5-feature-specifications)
6. [User Flows & Journey Maps](#6-user-flows--journey-maps)
7. [Security & Compliance](#7-security--compliance)
8. [Performance & Optimization](#8-performance--optimization)
9. [Development Checklist](#9-development-checklist)
10. [Real-World References](#10-real-world-references)

---

## 1. EXECUTIVE SUMMARY

### 1.1 Project Overview
Monfinancement.co is a multilingual FinTech web platform that facilitates non-refundable funding requests. The platform enables users to submit funding applications through a streamlined multi-step process, track their application status, and connect with advisors for support.

### 1.2 Core Objectives
- Provide a professional, trustworthy FinTech experience similar to industry leaders like Stripe Atlas, Klarna, or Revolut Business
- Enable seamless multilingual support across six languages
- Implement phone-number-only authentication for frictionless user onboarding
- Create a dual-interface system: customer-facing application portal and admin management dashboard
- Ensure data security, GDPR compliance, and financial-grade reliability

### 1.3 Success Metrics
- Sub-3-second page load times
- 95%+ mobile responsiveness score
- Zero critical security vulnerabilities
- Intuitive user experience requiring no documentation
- Professional design matching or exceeding industry standards

---

## 2. TECHNICAL STACK & ARCHITECTURE

### 2.1 Frontend Framework
**Technology:** Next.js 14+ (App Router)

**Rationale:**
- Server-side rendering for optimal SEO and performance
- Built-in internationalization (i18n) support for multilingual implementation
- API routes for serverless functions
- Excellent developer experience with hot module replacement
- Production-ready with automatic code splitting and optimization

**Key Configuration:**
- TypeScript for type safety (mandatory for FinTech applications)
- App Router architecture for modern routing patterns
- Middleware for authentication and language detection
- Environment-based configuration for staging and production

### 2.2 UI Component Library & Styling
**Primary Framework:** Tailwind CSS 3+

**Component Library:** shadcn/ui

**Rationale for shadcn/ui:**
- Copy-paste component architecture provides full ownership and customization
- Built on Radix UI primitives ensuring accessibility compliance
- No runtime overhead or package bloat
- Perfect for FinTech applications requiring branded, professional components
- TypeScript-first design

**Additional Libraries:**
- Framer Motion for sophisticated animations and transitions
- Lucide React for consistent, modern iconography
- React Hook Form for performant form management
- Zod for runtime validation and type inference

### 2.3 Backend & Database
**Database & Backend Solution:** Supabase

**Justification:**
- PostgreSQL database with row-level security (RLS) policies
- Built-in authentication with phone number support
- Real-time subscriptions for live dashboard updates
- Storage buckets for identity document uploads
- Edge functions for serverless compute when needed
- Automatic API generation from database schema
- Built-in authorization with JWT tokens
- Superior developer experience with TypeScript SDK

**Alternative Consideration:** Supabase is the optimal choice for this MVP. While Convex offers excellent real-time capabilities, Supabase provides better phone authentication support, more mature storage solutions, and PostgreSQL's reliability for financial data. Firebase is explicitly avoided due to inferior relational data modeling and vendor lock-in concerns.

### 2.4 Authentication Strategy
**Implementation:** Supabase Auth with Phone (OTP)

**Flow:**
- Phone number collection with international format validation
- SMS OTP delivery via Supabase providers (Twilio integration)
- JWT-based session management
- Secure HTTP-only cookies for token storage
- Auto-refresh token mechanism
- Role-based access control (RBAC) for admin/user distinction

### 2.5 Internationalization (i18n)
**Library:** next-intl (optimized for Next.js App Router)

**Implementation Approach:**
- Server-side translation loading for performance
- Language detection from browser preferences and URL parameters
- Translation files organized by feature modules
- Lazy loading of language bundles
- Currency and date formatting per locale
- RTL layout support preparation (though not required for current languages)

**Supported Languages:**
1. French (default, fr)
2. English (en)
3. Spanish (es)
4. Italian (it)
5. Portuguese (pt)
6. German (de)

### 2.6 File Upload & Storage
**Solution:** Supabase Storage

**Configuration:**
- Separate buckets for identity documents and RIB files
- File size limits: 10MB per document (identity cards), 5MB for RIB
- Accepted formats: JPEG, PNG, PDF
- Server-side validation of file types and sizes
- Automatic thumbnail generation for preview purposes
- Secure signed URLs with expiration for document access
- Encryption at rest for all uploaded files

### 2.7 Deployment & Hosting
**Platform:** Vercel

**Rationale:**
- Native Next.js support with zero configuration
- Edge network for global performance
- Automatic HTTPS and SSL certificates
- Preview deployments for every Git branch
- Environment variable management
- Automatic scaling and CDN integration

**Domain Configuration:**
- Custom domain: monfinancement.co
- SSL/TLS certificate (automatic via Vercel)
- DNS configuration for email and subdomains

---

## 3. DATABASE SCHEMA & DATA MANAGEMENT

### 3.1 Core Database Tables

#### Table: users
**Purpose:** Store core user profile information

**Columns:**
- id (UUID, primary key, auto-generated)
- phone_number (VARCHAR, unique, indexed) - international format with country code
- created_at (TIMESTAMP WITH TIME ZONE, default NOW())
- updated_at (TIMESTAMP WITH TIME ZONE, auto-updated)
- last_login (TIMESTAMP WITH TIME ZONE, nullable)
- role (ENUM: 'user', 'admin', default 'user')
- is_active (BOOLEAN, default true)

**Indexes:**
- Primary key on id
- Unique index on phone_number
- Index on role for admin queries

**Row-Level Security (RLS) Policies:**
- Users can read their own data only
- Admins can read all user data
- Users cannot modify their role
- System handles created_at and updated_at

#### Table: funding_applications
**Purpose:** Store all funding application data across all steps

**Columns:**
- id (UUID, primary key, auto-generated)
- user_id (UUID, foreign key → users.id, indexed)
- application_number (VARCHAR(8), unique, indexed) - format: AXBXCXDX
- status (ENUM: 'draft', 'submitted', 'under_review', 'approved', 'rejected', default 'draft')
- 
- // Step 0 data
- funding_amount (DECIMAL(15,2), not null)
- 
- // Step 1 data
- first_name (VARCHAR(100), not null)
- last_name (VARCHAR(100), not null)
- date_of_birth (DATE, not null)
- gender (ENUM: 'male', 'female', 'other', 'prefer_not_to_say')
- 
- // Step 2 data
- email (VARCHAR(255), not null, validated)
- residential_address (TEXT, not null)
- country_of_residence (VARCHAR(100), not null)
- funding_type (VARCHAR(100), not null) - from predefined list
- funding_reason (TEXT, not null)
- profession (VARCHAR(100), not null)
- monthly_income (DECIMAL(15,2), not null)
- 
- // Step 3 data (auto-validated)
- step_3_completed_at (TIMESTAMP WITH TIME ZONE, nullable)
- 
- // Metadata
- current_step (INTEGER, default 0) - tracks user progress
- language_preference (VARCHAR(5), default 'fr')
- created_at (TIMESTAMP WITH TIME ZONE, default NOW())
- updated_at (TIMESTAMP WITH TIME ZONE, auto-updated)
- submitted_at (TIMESTAMP WITH TIME ZONE, nullable)

**Indexes:**
- Primary key on id
- Unique index on application_number
- Foreign key index on user_id
- Composite index on (user_id, status) for dashboard queries
- Index on created_at for chronological sorting

**RLS Policies:**
- Users can only read/update their own applications
- Admins can read/update all applications
- Application number generation via database function

#### Table: application_documents
**Purpose:** Store references to uploaded identity documents and RIB files

**Columns:**
- id (UUID, primary key, auto-generated)
- application_id (UUID, foreign key → funding_applications.id)
- document_type (ENUM: 'identity_front', 'identity_back', 'rib')
- file_name (VARCHAR(255), not null)
- file_path (TEXT, not null) - Supabase Storage path
- file_size (INTEGER, not null) - bytes
- mime_type (VARCHAR(100), not null)
- upload_status (ENUM: 'uploading', 'completed', 'failed', default 'uploading')
- uploaded_at (TIMESTAMP WITH TIME ZONE, default NOW())

**Indexes:**
- Primary key on id
- Foreign key index on application_id
- Composite index on (application_id, document_type)

**RLS Policies:**
- Users can only access documents for their own applications
- Admins can access all documents
- Cascade delete when application is deleted

#### Table: admin_users
**Purpose:** Store admin-specific configuration and permissions

**Columns:**
- id (UUID, primary key, references users.id)
- full_name (VARCHAR(255), not null)
- admin_email (VARCHAR(255), unique, not null)
- permissions (JSONB, default '{}') - extensible permission system
- created_at (TIMESTAMP WITH TIME ZONE, default NOW())
- last_access (TIMESTAMP WITH TIME ZONE, nullable)

**RLS Policies:**
- Only accessible by authenticated admin users
- Self-modification allowed, role escalation prevented

#### Table: contact_preferences
**Purpose:** Store WhatsApp and email contact information for advisors

**Columns:**
- id (UUID, primary key, auto-generated)
- whatsapp_number (VARCHAR(50), not null)
- whatsapp_message_template (TEXT, nullable) - pre-filled message
- contact_email (VARCHAR(255), not null)
- email_subject_template (VARCHAR(500), nullable)
- is_active (BOOLEAN, default true)
- created_at (TIMESTAMP WITH TIME ZONE, default NOW())
- updated_at (TIMESTAMP WITH TIME ZONE, auto-updated)

**Note:** Single row configuration table, managed only by admins

#### Table: site_configuration
**Purpose:** Store dynamic site configuration (deadline dates, testimonials, etc.)

**Columns:**
- id (UUID, primary key, auto-generated)
- config_key (VARCHAR(100), unique, not null)
- config_value (JSONB, not null)
- description (TEXT, nullable)
- updated_at (TIMESTAMP WITH TIME ZONE, auto-updated)
- updated_by (UUID, foreign key → users.id, nullable)

**Example Configurations:**
- funding_deadline: { date: "2026-05-30", display_format: "DD/MM/YYYY" }
- featured_testimonials: [{ name: "...", message: "...", rating: 5 }]
- funding_types: ["Type A", "Type B", "Type C"]

### 3.2 Database Functions

#### Function: generate_application_number()
**Purpose:** Generate unique 8-character application numbers

**Logic:**
- Format: AXBXCXDX where X is randomly alphanumeric
- Last character must always be different from previous application
- Characters pool: A-Z, 0-9 (excluding confusing characters: 0, O, 1, I, l)
- Ensure uniqueness via CHECK constraint and retry logic
- Trigger execution on INSERT to funding_applications

**Implementation Notes:**
- Use PostgreSQL's random() and string manipulation functions
- Implement collision detection and retry mechanism
- Store last character in a separate tracking mechanism if needed
- Maximum 10 retry attempts before failure

#### Function: update_updated_at()
**Purpose:** Automatically update updated_at timestamp

**Implementation:**
- Trigger function for BEFORE UPDATE events
- Set NEW.updated_at = NOW()
- Apply to all tables with updated_at columns

### 3.3 Data Validation & Constraints

**Phone Number Validation:**
- Format: E.164 international standard (+[country code][number])
- Validation library: libphonenumber-js
- Stored format: +XXXXXXXXXXXX
- Display format: Localized per user preferences

**Email Validation:**
- RFC 5322 compliant
- DNS MX record verification (optional, via serverless function)
- Lowercase normalization before storage

**Funding Amount Validation:**
- Minimum: 1000 (currency-agnostic)
- Maximum: 10000000
- Decimal precision: 2
- Client-side and server-side validation

**Date of Birth Validation:**
- Minimum age: 18 years
- Maximum age: 100 years
- Format: ISO 8601 (YYYY-MM-DD)

**Document Upload Validation:**
- File size limits enforced at storage level
- MIME type validation server-side
- Malware scanning via Supabase Edge Functions (optional enhancement)

### 3.4 Backup & Recovery Strategy

**Automated Backups:**
- Supabase provides automatic daily backups (retained for 7 days on free tier, 30+ days on paid)
- Point-in-time recovery available on paid plans
- Manual backup exports scheduled weekly to separate storage

**Data Retention:**
- Active applications: indefinite retention
- Inactive applications (no activity for 2+ years): archival to cold storage
- Deleted applications: soft delete with 90-day grace period before permanent deletion

---

## 4. DESIGN SYSTEM & UI/UX SPECIFICATIONS

### 4.1 FinTech Design Principles

**Core Design Philosophy:**
This platform must convey trust, professionalism, and financial security. The design should mirror the sophistication of leading FinTech products while maintaining accessibility and clarity.

**Reference Standards:**
- Trust indicators similar to Stripe's checkout experience
- Clean, spacious layouts like Revolut's web interface
- Progressive disclosure patterns like Wise (TransferWise)
- Accessibility standards: WCAG 2.1 AA compliance minimum

### 4.2 Color Palette

**Primary Brand Colors:**

**Primary Blue:** 
- Main: #1E40AF (Professional, trustworthy blue)
- Light: #3B82F6
- Dark: #1E3A8A
- Usage: Primary CTAs, headers, key UI elements

**Secondary Colors:**

**Success Green:**
- Main: #10B981
- Light: #34D399
- Usage: Success states, confirmations, completed steps

**Warning Amber:**
- Main: #F59E0B
- Light: #FBBF24
- Usage: Pending states, information alerts

**Error Red:**
- Main: #EF4444
- Light: #F87171
- Usage: Error states, validation messages, critical alerts

**Neutral Grays:**
- Gray 50: #F9FAFB (backgrounds)
- Gray 100: #F3F4F6 (card backgrounds)
- Gray 200: #E5E7EB (borders)
- Gray 400: #9CA3AF (placeholder text)
- Gray 600: #4B5563 (secondary text)
- Gray 800: #1F2937 (body text)
- Gray 900: #111827 (headings)

**Accent Colors:**
- Indigo: #6366F1 (highlights, interactive elements)
- Teal: #14B8A6 (secondary actions, info badges)

### 4.3 Typography

**Font Families:**

**Primary (Headings & Body):** Inter
- Modern, highly legible sans-serif
- Excellent number clarity for financial data
- Variable font support for performance
- Fallback: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto

**Monospace (Numerical Data):** JetBrains Mono or SF Mono
- Used exclusively for application numbers, monetary amounts
- Enhanced readability for alphanumeric codes
- Fallback: "Courier New", monospace

**Font Weights:**
- Light: 300 (sparingly, for large headings)
- Regular: 400 (body text)
- Medium: 500 (emphasized text, labels)
- Semibold: 600 (subheadings, button text)
- Bold: 700 (main headings, important CTAs)

**Type Scale:**
- xs: 12px / 0.75rem (captions, helper text)
- sm: 14px / 0.875rem (secondary text, labels)
- base: 16px / 1rem (body text)
- lg: 18px / 1.125rem (lead paragraphs)
- xl: 20px / 1.25rem (section headings)
- 2xl: 24px / 1.5rem (page subheadings)
- 3xl: 30px / 1.875rem (page headings)
- 4xl: 36px / 2.25rem (hero headings)

**Line Heights:**
- Tight: 1.25 (headings)
- Normal: 1.5 (body text)
- Relaxed: 1.75 (long-form content)

### 4.4 Spacing System

**Base Unit:** 4px (0.25rem)

**Spacing Scale (Tailwind convention):**
- 0: 0px
- 1: 4px
- 2: 8px
- 3: 12px
- 4: 16px
- 5: 20px
- 6: 24px
- 8: 32px
- 10: 40px
- 12: 48px
- 16: 64px
- 20: 80px
- 24: 96px

**Component Spacing Guidelines:**
- Form fields: 16px vertical spacing between fields
- Card padding: 24px on desktop, 16px on mobile
- Section margins: 64px vertical spacing on desktop, 48px on mobile
- Button padding: 12px vertical, 24px horizontal (medium size)

### 4.5 Component Specifications

#### Buttons

**Primary Button (CTA):**
- Background: Primary Blue (#1E40AF)
- Text: White (#FFFFFF)
- Padding: 12px 24px (medium), 10px 20px (small), 14px 32px (large)
- Border radius: 8px
- Font weight: 600 (semibold)
- Hover state: Darken background to #1E3A8A
- Active state: Scale down to 0.98
- Disabled state: Gray 300 background, Gray 400 text
- Transition: all 150ms ease-in-out

**Secondary Button:**
- Background: White (#FFFFFF)
- Border: 2px solid Gray 200
- Text: Gray 800
- Hover: Border becomes Primary Blue, text becomes Primary Blue
- All other specs same as primary

**Ghost Button:**
- Background: Transparent
- Text: Primary Blue
- Hover: Light blue background (Blue 50)

**Loading State:**
- Spinner animation (16px circular loader)
- Button disabled during loading
- Text changes to "Processing..." or localized equivalent

#### Form Inputs

**Text Input:**
- Height: 44px (optimal for touch targets)
- Padding: 12px 16px
- Border: 1.5px solid Gray 200
- Border radius: 8px
- Font size: 16px (prevents iOS zoom on focus)
- Focus state: Border becomes Primary Blue, add blue glow shadow
- Error state: Border becomes Error Red, show error message below
- Placeholder: Gray 400

**Select Dropdown:**
- Same dimensions as text input
- Custom arrow icon (Lucide chevron-down)
- Dropdown menu with max-height: 300px, scrollable
- Selected item highlighted with light blue background

**File Upload:**
- Drag-and-drop zone with dashed border
- Height: 160px minimum
- Visual feedback on drag-over (blue tinted background)
- Preview thumbnail after upload (80x80px)
- Progress bar during upload (2px height, blue background)
- File name, size, and delete icon displayed after upload

**Phone Number Input:**
- Country code selector (dropdown with flags)
- Number input with automatic formatting
- Real-time validation with green checkmark or red X icon
- Use react-phone-number-input library

#### Cards

**Standard Card:**
- Background: White (#FFFFFF)
- Border: 1px solid Gray 200
- Border radius: 12px
- Padding: 24px
- Box shadow: 0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06)
- Hover state: Slight shadow increase for interactive cards

**Dashboard Card (Stats):**
- Compact padding: 20px
- Icon in corner (32x32px)
- Large number display (3xl font size, bold)
- Label below (sm font size, gray text)
- Colored left border accent (4px width)

#### Progress Indicators

**Step Progress Bar (Horizontal):**
- Container: Full width, height 60px
- Steps represented as circles (40px diameter)
- Connecting line between steps (2px height)
- Completed steps: Green background, white checkmark icon
- Current step: Blue background, white number
- Incomplete steps: Gray 200 background, gray number
- Step labels below circles (sm font size)
- Mobile: Stack vertically or use compact horizontal version

**Upload Progress Bar:**
- Height: 4px
- Background: Gray 200
- Fill: Primary Blue
- Smooth animation with transition
- Percentage text above (12px font size)

#### Modals & Dialogs

**Standard Modal:**
- Overlay: rgba(0,0,0,0.5) backdrop blur
- Container: White background, centered, max-width 500px
- Border radius: 16px
- Padding: 32px
- Header with close button (X icon, top-right)
- Content area with scrolling if needed
- Footer with action buttons (right-aligned)
- Animate in: fade + scale from 0.95 to 1
- Escape key closes modal

**Confirmation Dialog:**
- Compact size: max-width 400px
- Icon at top (warning/success, 48x48px)
- Title (xl font size, bold)
- Message (base font size)
- Two buttons: Cancel (secondary) and Confirm (primary)

#### Toasts & Notifications

**Toast Notification:**
- Position: Top-right corner, 24px from edges
- Width: 320px
- Background: White with colored left border (4px)
- Border radius: 8px
- Box shadow: 0 4px 6px rgba(0,0,0,0.1)
- Icon + message + close button layout
- Auto-dismiss after 5 seconds
- Swipe to dismiss on mobile
- Stack multiple toasts vertically

**Types:**
- Success: Green border, checkmark icon
- Error: Red border, X circle icon
- Warning: Amber border, alert triangle icon
- Info: Blue border, info circle icon

#### Tables (Admin Dashboard)

**Data Table:**
- Header: Gray 50 background, bold text
- Row height: 56px (comfortable spacing)
- Alternating row backgrounds: White and Gray 50
- Hover state: Gray 100 background
- Borders: 1px solid Gray 200 between rows
- Pagination at bottom: 10/25/50/100 per page options
- Search and filter controls above table
- Sort indicators in column headers (arrow icons)
- Action buttons (edit, delete) in rightmost column
- Responsive: Horizontal scroll on mobile with sticky first column

### 4.6 Layout Structure

#### Homepage Layout

**Hero Section:**
- Full viewport height on desktop, 70vh on mobile
- Split layout: Left side content (60%), right side illustration/animation (40%)
- Gradient background: Linear gradient from Blue 50 to White
- Main headline: 4xl font size, bold
- Subheadline: lg font size, gray text
- Animated deadline message: Prominent display with countdown component
- Primary CTA button: Large size, centered prominence
- Trust indicators below: Small badges (secure, verified, etc.)

**Testimonials Section:**
- Container: Max-width 1200px, centered
- Grid layout: 3 columns on desktop, 1 column on mobile
- Testimonial card design:
  - White background, subtle shadow
  - Star rating at top (5 stars, gold color)
  - Quote text (base font size, italic)
  - Author name and photo (circular, 48x48px)
  - Profession/location (sm font size, gray)
- Carousel on mobile with swipe gestures

**Footer:**
- Background: Gray 900
- Text: Gray 300
- Three-column layout: Company info, Quick links, Contact
- Language selector dropdown
- Copyright and legal links
- Social media icons (if applicable)

#### Application Flow Layout

**Multi-Step Form Container:**
- Centered container: Max-width 700px
- White background card with shadow
- Progress bar at top (outside card, spanning full width)
- Step indicator with current step highlighted
- Form content area with generous padding
- Navigation buttons at bottom: "Back" (left) and "Next" (right)
- Exit link in top-right corner (return to dashboard)
- Auto-save indicator (small, subtle)

**Spacing Between Form Sections:**
- Section title: 2xl font size, margin-bottom 24px
- Field groups: 20px vertical spacing
- Field labels: 12px margin-bottom
- Helper text: 8px margin-top, sm font size

#### Dashboard Layout

**User Dashboard:**
- Sidebar navigation (desktop) or bottom tab bar (mobile)
- Main content area with greeting header
- Application status card: Large, prominent placement
- Progress indicator: Visual representation of completed steps
- Document upload section: Expandable cards per document type
- Contact section: WhatsApp and email buttons (large, icon + text)
- Application number display: Monospace font, copy button
- Logout button in top-right

**Admin Dashboard:**
- Persistent sidebar with navigation links
- Top bar: Search input, notification icon, admin avatar
- Main content: Data table with all applications
- Filters: Status, date range, search by application number/name
- Quick stats at top: Total applications, pending, approved, rejected
- Individual application detail view: Modal or slide-in panel
- Bulk actions: Select multiple, approve/reject batch
- Export functionality: CSV download button

### 4.7 Animation & Interaction Patterns

**Page Transitions:**
- Fade in: 200ms duration, ease-out timing
- Slide up: Content enters from 20px below, 300ms duration

**Button Interactions:**
- Hover: Scale to 1.02, transition 150ms
- Click: Scale to 0.98, transition 100ms
- Ripple effect on click (optional, Material Design style)

**Form Interactions:**
- Input focus: Border color transition 200ms
- Validation: Shake animation (horizontal movement) for errors
- Success: Checkmark fade in with scale animation

**Loading States:**
- Skeleton screens for content loading (pulsing gray rectangles)
- Spinner: Circular rotation, 1s duration, infinite loop
- Progress bars: Smooth width transition, 300ms

**Micro-Interactions:**
- Tooltip appearance: Fade in 150ms, slight upward movement
- Dropdown menus: Slide down 200ms with opacity fade
- Toast notifications: Slide in from right, 300ms ease-out

### 4.8 Responsive Design Breakpoints

**Breakpoints:**
- xs: 0px - 639px (mobile)
- sm: 640px - 767px (large mobile)
- md: 768px - 1023px (tablet)
- lg: 1024px - 1279px (desktop)
- xl: 1280px - 1535px (large desktop)
- 2xl: 1536px+ (extra large desktop)

**Mobile-First Approach:**
- Design and develop for mobile first
- Enhance for larger screens progressively
- Touch targets minimum 44x44px
- Thumb-friendly navigation zones
- Readable font sizes without zooming

**Responsive Patterns:**
- Navigation: Hamburger menu on mobile, full nav on desktop
- Forms: Single column on mobile, two columns on desktop where appropriate
- Cards: Stack vertically on mobile, grid on desktop
- Tables: Horizontal scroll or card view on mobile

### 4.9 Accessibility Requirements

**Keyboard Navigation:**
- All interactive elements accessible via Tab key
- Logical tab order following visual hierarchy
- Focus indicators clearly visible (blue outline, 2px)
- Skip to main content link
- Modal trap focus within dialog

**Screen Reader Support:**
- Semantic HTML elements (header, nav, main, section, footer)
- ARIA labels for icon-only buttons
- ARIA live regions for dynamic content updates
- Alt text for all images (descriptive, not decorative)
- Form labels properly associated with inputs

**Color Contrast:**
- Text on backgrounds: Minimum 4.5:1 contrast ratio
- Large text (18px+): Minimum 3:1 contrast ratio
- Interactive elements: Distinguishable without color alone
- Error states: Use icons + color, not color alone

**Text Readability:**
- Maximum line length: 80 characters
- Sufficient line height: 1.5 for body text
- Resizable text up to 200% without breaking layout
- No text in images (use HTML text)

### 4.10 Iconography

**Icon Library:** Lucide React

**Icon Sizes:**
- xs: 16px (inline with text)
- sm: 20px (form elements)
- base: 24px (standard UI elements)
- lg: 32px (feature highlights)
- xl: 48px (hero sections, empty states)

**Common Icons:**
- Navigation: menu, x, chevron-down, arrow-left, arrow-right
- Actions: edit, trash, download, upload, copy, check, x-circle
- Status: check-circle, alert-triangle, info, alert-circle
- Finance: dollar-sign, credit-card, trending-up, wallet
- Documents: file-text, image, upload-cloud
- Communication: mail, phone, message-circle

**Icon Usage:**
- Always pair icons with text labels (except in constrained spaces)
- Use consistent icon style throughout
- Color icons semantically (green for success, red for error)
- Animate icons on interaction (subtle rotation, scale)

---

## 5. FEATURE SPECIFICATIONS

### 5.1 Multilingual System (i18n)

**Implementation Requirements:**

**Language Detection Logic:**
1. Check URL parameter (?lang=fr)
2. Check user's saved preference in database
3. Check browser's Accept-Language header
4. Default to French if no preference found

**Language Switcher Component:**
- Location: Top-right corner of header (desktop), footer (mobile)
- UI: Dropdown menu or flag icons with country names
- Current language highlighted
- Persist selection to user profile (if logged in) or localStorage
- Reload page or update context on language change

**Translation File Structure:**
- Organize by feature module: common.json, auth.json, application.json, dashboard.json, admin.json
- Nested JSON structure for logical grouping
- Variable interpolation support for dynamic content
- Plural form handling for counts
- Date and number formatting per locale

**Example Translation Keys:**
- common.buttons.next
- common.buttons.back
- application.step0.title
- application.step1.fields.firstName.label
- validation.required
- dashboard.status.submitted

**Critical Translation Areas:**
- All UI labels and button text
- Form field labels and placeholders
- Validation error messages
- Email templates
- SMS OTP messages
- Success and error notifications
- Email subject lines and body content

**Currency and Number Formatting:**
- Use Intl.NumberFormat for currency display
- Respect locale-specific decimal separators
- Currency symbol positioning per locale
- Thousand separators per locale

**Date Formatting:**
- Use Intl.DateTimeFormat or date-fns with locale
- Format: DD/MM/YYYY for European locales, MM/DD/YYYY for US
- Relative time display: "2 hours ago" localized
- Deadline date formatting per locale

### 5.2 Authentication Flow

**Phone Number Authentication Process:**

**Step 1: Phone Number Input**
- User enters phone number with country code selector
- Client-side validation: format checking via libphonenumber-js
- Display validation feedback immediately
- Normalize number to E.164 format before submission

**Step 2: OTP Request**
- Call Supabase Auth API: signInWithOtp({ phone })
- Display loading state on button
- Handle rate limiting: show error if too many attempts
- Display success message: "OTP sent to +XX XXX XXX XXXX"
- Start countdown timer: 60 seconds before "Resend OTP" enabled

**Step 3: OTP Verification**
- User enters 6-digit OTP code
- Auto-submit when 6 digits entered (optional UX enhancement)
- Call Supabase Auth API: verifyOtp({ phone, token, type: 'sms' })
- Handle errors: invalid code, expired code
- On success: Store JWT token, redirect to dashboard or application flow

**Step 4: Session Management**
- Store access token and refresh token securely
- Use Supabase client's built-in token refresh
- Check authentication status on protected routes via middleware
- Auto-logout on token expiration

**Security Measures:**
- Rate limit OTP requests: 3 per hour per phone number
- OTP expiration: 10 minutes
- Block suspicious patterns: too many failed attempts
- CAPTCHA on repeated failures (optional)
- Secure HTTP-only cookies for token storage

**User Experience:**
- Remember user's phone number on device (localStorage)
- Auto-fill country code based on IP geolocation
- Clear error messages for common issues
- Visual feedback during all async operations
- Smooth transitions between steps

### 5.3 Application Flow (Step-by-Step)

#### Step 0: Funding Amount Input

**Purpose:** Capture the desired funding amount before collecting personal information

**UI Layout:**
- Full-screen centered card
- Large heading: "How much funding do you need?"
- Currency input field:
  - Large font size (2xl)
  - Currency symbol prefix (based on locale)
  - Thousand separator formatting as user types
  - Placeholder: "Enter amount"
- Range indicator below: "Minimum: 1,000 | Maximum: 10,000,000"
- Primary CTA button: "Continue"

**Validation:**
- Minimum amount: 1,000
- Maximum amount: 10,000,000
- Must be positive number
- No decimal places for whole currency units
- Real-time validation feedback

**Data Storage:**
- Create new funding_applications record with status='draft'
- Store funding_amount
- Generate unique application_number
- Link to authenticated user_id
- Set current_step = 0

**Navigation:**
- "Continue" button advances to Step 1
- Application number generated and stored at this point

#### Step 1: Personal Information

**Purpose:** Collect basic personal details

**UI Layout:**
- Progress indicator showing Step 1 of 3
- Form heading: "Tell us about yourself"
- Form fields (single column):
  1. First Name (text input)
  2. Last Name (text input)
  3. Date of Birth (date picker)
  4. Gender (optional dropdown or radio buttons)

**Field Specifications:**

**First Name:**
- Max length: 100 characters
- Validation: Letters, spaces, hyphens, apostrophes only
- Required field
- Auto-capitalize first letter

**Last Name:**
- Same specs as first name

**Date of Birth:**
- Date picker component with calendar popup
- Format display per locale
- Validation: Age between 18-100 years
- Calculate age in real-time, show warning if under 18
- Required field

**Gender:**
- Dropdown options: Male, Female, Other, Prefer not to say
- Optional field
- Localized option labels

**Buttons:**
- "Back" button (secondary, left): Returns to Step 0
- "Next" button (primary, right): Advances to Step 2

**Validation:**
- Client-side validation on blur
- Server-side validation on submit
- Show inline error messages
- Prevent submission until all required fields valid

**Data Storage:**
- Update existing funding_applications record
- Set current_step = 1
- Store: first_name, last_name, date_of_birth, gender

**Auto-Save:**
- Save draft every 30 seconds (debounced)
- Show subtle "Draft saved" indicator

#### Step 2: Financial & Professional Details

**Purpose:** Collect comprehensive information about the funding request and applicant's financial situation

**UI Layout:**
- Progress indicator showing Step 2 of 3
- Form heading: "Funding Details"
- Form fields (single column on mobile, two columns on desktop where appropriate)

**Form Fields:**

1. **Email Address**
   - Type: Email input with validation
   - Validation: RFC 5322 format, domain verification
   - Required field
   - Show checkmark when valid email detected

2. **Residential Address**
   - Type: Textarea (3-4 rows)
   - Max length: 500 characters
   - Required field
   - Placeholder: "Street, City, Postal Code"

3. **Country of Residence**
   - Type: Searchable dropdown
   - Options: All countries (ISO 3166-1)
   - Required field
   - Default to detected country from IP (optional)

4. **Funding Type**
   - Type: Radio buttons or dropdown
   - Options: Exactly 3 predefined types (defined in site_configuration table)
   - Single selection required
   - Each option with descriptive subtitle

5. **Funding Reason**
   - Type: Textarea (4-5 rows)
   - Max length: 1000 characters
   - Required field
   - Character counter displayed
   - Placeholder: "Explain why you need this funding..."

6. **Profession**
   - Type: Text input or searchable dropdown
   - Max length: 100 characters
   - Required field
   - Suggestions list (optional enhancement)

7. **Monthly Income**
   - Type: Currency input
   - Formatting: Thousand separators, currency symbol
   - Validation: Positive number, reasonable range
   - Required field
   - Helper text: "Enter your average monthly income"

**Layout Considerations:**
- Group related fields: Contact info, Funding details, Financial info
- Use section headings to separate groups
- Adequate spacing between sections (32px)

**Buttons:**
- "Back" button: Returns to Step 1
- "Next" button: Advances to Step 3

**Validation:**
- Comprehensive validation on all fields
- Async email validation (check format + MX record)
- Show validation errors clearly
- Prevent submission until all fields valid

**Data Storage:**
- Update funding_applications record with all Step 2 data
- Set current_step = 2
- Store all form field values in corresponding columns

#### Step 3: Auto-Validation & Contact

**Purpose:** Automatically validate the application and provide contact options

**Behavior:**
- This step is **automatically validated** upon entering
- No user input required
- Display confirmation message immediately

**UI Layout:**
- Large checkmark icon (animated, green)
- Heading: "Application Submitted Successfully!"
- Application number display:
  - Large monospace font
  - Format: A6B1C5D2 (example)
  - Copy button next to number
- Message: "Please contact an assigned advisor for proper follow-up of your application."
- Two prominent action buttons:
  1. **WhatsApp Button**
     - Green background with WhatsApp icon
     - Text: "Chat on WhatsApp"
     - Opens WhatsApp with pre-filled message containing application number
     - URL format: https://wa.me/[PHONE]?text=[MESSAGE]
  2. **Email Button**
     - Blue background with envelope icon
     - Text: "Send Email"
     - Opens email client with pre-filled subject and body
     - Mailto format: mailto:[EMAIL]?subject=[SUBJECT]&body=[BODY]

**Pre-filled Message Templates:**

**WhatsApp:**
"Hello, I have submitted a funding application. My application number is [APPLICATION_NUMBER]. I would like to discuss the next steps. Thank you."

**Email:**
Subject: "Funding Application [APPLICATION_NUMBER] - Follow-up Request"
Body: "Dear Advisor,

I have successfully submitted my funding application with the number [APPLICATION_NUMBER]. I would appreciate guidance on the next steps in the process.

Thank you for your assistance.

Best regards,
[USER_NAME]"

**Data Updates:**
- Set step_3_completed_at = NOW()
- Set current_step = 3
- Set status = 'submitted'
- Set submitted_at = NOW()

**Redirection Logic:**
- On subsequent logins, if current_step >= 3, always show this confirmation screen
- User cannot go back to edit previous steps (enforcement via UI + backend)
- Display "Return to Dashboard" button at bottom

### 5.4 User Dashboard

**Purpose:** Central hub for users to view application status and access documents

**Access Control:**
- Requires authentication (redirect to login if not authenticated)
- User can only see their own application data

**Layout Structure:**

**Header Section:**
- Personalized greeting: "Welcome back, [First Name]!"
- Current date display (localized format)
- Logout button (top-right corner)

**Application Overview Card:**
- Large card with application summary
- Application number displayed prominently with copy button
- Status badge with color coding:
  - Draft: Gray
  - Submitted: Blue
  - Under Review: Amber
  - Approved: Green
  - Rejected: Red
- Submission date
- Funding amount requested

**Progress Tracker:**
- Horizontal step indicator with 4 steps:
  1. Personal Information (✓ Completed)
  2. Documents Submitted (✓ Completed)
  3. RIB Submission (Pending or ✓ Completed)
  4. Final Validation (Pending or ✓ Completed)
- Visual progress bar showing percentage complete
- Current step highlighted

**Document Section:**
- Section heading: "Your Documents"
- Cards for each document type:
  - Identity Card (Front)
  - Identity Card (Back)
  - RIB (Bank Information)
- Each card shows:
  - Document name
  - Upload status (Uploaded, Pending, Not uploaded)
  - Thumbnail preview (if uploaded)
  - Upload/Replace button
  - File size and upload date

**RIB Upload (Step 3):**
- Conditional display: Only show if previous steps completed
- Heading: "Submit Your RIB"
- File upload zone (drag-and-drop)
- Accepted formats: PDF, JPEG, PNG
- Max file size: 5MB
- Upload progress indicator
- After upload: Display success message and update progress

**Contact Advisor Section:**
- Always visible after submission
- Prominent heading: "Need Assistance?"
- WhatsApp and Email buttons (same as Step 3)
- Quick message templates

**Additional Features:**
- Activity timeline: Show key events (submitted, documents uploaded, etc.)
- Notification preferences (optional for MVP)
- Language switcher in header

**Empty State:**
- If no application exists, show:
  - "Start Your Funding Application" button
  - Brief explanation of the process
  - Estimated time to complete

**Mobile Optimizations:**
- Bottom navigation bar for easy access
- Swipeable sections
- Collapsible cards to save space
- Sticky header with key info

### 5.5 Admin Dashboard

**Purpose:** Comprehensive management interface for administrators to view, moderate, and manage all applications

**Access Control:**
- Requires admin authentication (role='admin' in users table)
- Redirect non-admin users attempting to access
- Separate login URL or role-based routing

**Dashboard Overview:**

**Top Statistics Bar:**
- Four stat cards (horizontal row):
  1. Total Applications (count, percentage change from last month)
  2. Pending Review (count, amber badge)
  3. Approved (count, green badge)
  4. Rejected (count, red badge)
- Each card with large number, small icon, trend indicator

**Main Data Table:**

**Table Structure:**
- Columns (left to right):
  1. Application Number (monospace, copy button)
  2. Applicant Name (first + last name)
  3. Phone Number (formatted, click to reveal full)
  4. Funding Amount (formatted currency)
  5. Status (badge with color)
  6. Submission Date (relative time + full date on hover)
  7. Actions (dropdown menu)

**Table Features:**
- Sortable columns: Click header to sort ascending/descending
- Pagination: 25 items per page default, options for 50/100
- Responsive: Horizontal scroll on mobile with sticky first column

**Search & Filter Controls:**
- Search bar: Search by name, application number, phone
- Real-time search with debouncing (300ms delay)
- Filter dropdowns:
  1. Status filter (All, Draft, Submitted, Under Review, Approved, Rejected)
  2. Date range picker (Last 7 days, Last 30 days, Last 3 months, Custom)
  3. Funding amount range slider
- Clear filters button
- Export to CSV button (exports filtered results)

**Actions Menu (per row):**
- View Details (opens detail modal)
- Edit Application (opens edit form)
- Download Documents (ZIP file of all documents)
- Change Status (quick status update dropdown)
- Delete Application (confirmation dialog required)

**Application Detail Modal:**

**Opened when:** Admin clicks "View Details"

**Modal Layout:**
- Full-screen overlay on mobile, large centered modal on desktop
- Close button (X) in top-right
- Tabbed interface:
  1. **Overview Tab:**
     - All form data displayed in readable format
     - Section headings: Personal Info, Funding Details, Financial Info
     - Key-value pairs with labels
     - Application timeline (created, submitted, status changes)
  
  2. **Documents Tab:**
     - Grid of uploaded documents
     - Thumbnail previews with lightbox on click
     - Download individual document buttons
     - Document metadata: size, upload date, file type
  
  3. **Activity Log Tab:**
     - Chronological list of all actions
     - Who made changes (admin name) and when
     - Status changes logged
     - Document uploads logged
     - Comments/notes (if added)

**Action Buttons in Modal:**
- Approve Application (green button)
- Reject Application (red button, requires rejection reason)
- Request More Information (opens email template)
- Add Internal Note (textarea, only visible to admins)

**Status Management:**
- Status change triggers email notification to user (optional)
- Status history preserved in activity log
- Can revert status changes if needed

**Bulk Actions:**
- Select multiple applications via checkboxes
- Bulk actions dropdown:
  - Export selected to CSV
  - Change status (applies to all selected)
  - Delete selected (confirmation required)
- "Select All" checkbox in table header

**Additional Admin Features:**

**User Management Section:**
- List of all registered users
- View user details and applications
- Suspend/activate user accounts
- Search users by phone number

**Site Configuration Panel:**
- Edit funding deadline date
- Manage testimonials (add, edit, delete)
- Update funding types list
- Edit contact information (WhatsApp, email)
- Update email/SMS templates

**Analytics & Reports (Optional for MVP):**
- Application conversion funnel
- Average completion time
- Most common funding reasons
- Geographic distribution of applicants

**Navigation:**
- Sidebar with sections:
  - Dashboard (home icon)
  - Applications (file icon)
  - Users (users icon)
  - Settings (gear icon)
  - Logout (log-out icon)

**Mobile Admin View:**
- Simplified table with essential columns only
- Card view option for better mobile readability
- Bottom sheet for action menus
- Simplified filters (drawer from side)

### 5.6 File Upload & Management

**Implementation Details:**

**Supabase Storage Configuration:**
- Bucket: "application-documents" (private)
- Folder structure: /[user_id]/[application_id]/[document_type]/[filename]
- RLS policies: Users can only upload to their own folder, admins can access all

**Upload Process:**

1. **Client-side validation:**
   - Check file type (JPEG, PNG, PDF only)
   - Check file size (max 10MB for identity, 5MB for RIB)
   - Show error immediately if validation fails

2. **Prepare upload:**
   - Generate unique filename: [timestamp]-[uuid].[extension]
   - Create presigned URL for direct upload to Supabase Storage

3. **Upload with progress:**
   - Use XMLHttpRequest or Fetch API with progress tracking
   - Display progress bar (0-100%)
   - Show upload speed and estimated time remaining

4. **Post-upload processing:**
   - Create record in application_documents table
   - Update application status if all required documents uploaded
   - Generate thumbnail for preview (server-side Edge Function)
   - Scan file for malware (optional, via third-party service)

5. **Success handling:**
   - Show success toast notification
   - Display uploaded file preview immediately
   - Enable "View" and "Delete" actions

**Document Viewer:**
- PDF viewer: Embedded iframe or react-pdf library
- Image viewer: Lightbox with zoom, pan, rotate
- Download button available in viewer
- Print option for PDFs

**Document Deletion:**
- User can delete and re-upload before submission
- After submission, only admins can delete
- Soft delete: Mark as deleted in database, keep file for 90 days
- Confirmation dialog required

**Security Measures:**
- Validate file content, not just extension (magic number checking)
- Generate signed URLs with expiration for viewing
- No direct public access to storage bucket
- Audit log for all document operations

### 5.7 Application Number Generation

**Format:** AXBXCXDX (8 characters total)

**Character Set:**
- Uppercase letters: A-Z excluding O, I (to avoid confusion with 0, 1)
- Numbers: 2-9 (excluding 0, 1 for same reason)
- Available characters: ABCDEFGHJKLMNPQRSTUVWXYZ23456789 (32 characters)

**Generation Logic:**

1. Generate 7 random characters from the available set
2. Determine last character:
   - Query database for last application's final character
   - If last was 'A', randomly select from remaining 31 characters
   - Ensure new character is different from previous
3. Concatenate into format: C1 C2 C3 C4 C5 C6 C7 C8
4. Check uniqueness in database
5. If collision, retry with new random generation (max 5 retries)
6. Insert into database with atomic transaction

**Implementation Location:**
- PostgreSQL function: generate_application_number()
- Triggered on INSERT to funding_applications table
- Automatic assignment, no manual intervention

**Display Format:**
- Always uppercase
- Monospace font for clarity
- Copy button next to displayed number
- Format with non-breaking spaces for readability (optional: A6B1 C5D2)

**Search & Validation:**
- Case-insensitive search (normalize to uppercase)
- Validate format on input: exactly 8 characters, alphanumeric
- Real-time validation feedback in search inputs

### 5.8 Deadline Animation

**Feature:** Animated deadline message on homepage

**Content:** "Bénéficier d'un financement jusqu'au [DATE]"
- Date format per locale (DD/MM/YYYY for French, etc.)
- Default date: 30/05/2026

**Animation Options:**

**Option A - Countdown Timer:**
- Calculate days, hours, minutes until deadline
- Update every minute
- Display format: "X days, Y hours left to apply"
- Urgency colors: Green (>30 days), Amber (7-30 days), Red (<7 days)

**Option B - Fade In/Out Text:**
- Smooth fade in animation on page load
- Subtle pulsing effect to draw attention
- Scale animation (1.0 to 1.05) for emphasis

**Option C - Animated Gradient Text:**
- Gradient color animation across text
- Modern, eye-catching effect
- Performant CSS animation

**Admin Configuration:**
- Admin can edit deadline date via site configuration panel
- Date picker with time zone support
- Preview changes before publishing
- Immediate update across all pages

**Visibility Rules:**
- Show on homepage only
- Hide if deadline has passed
- Show alternative message after deadline: "Applications temporarily closed"

### 5.9 Testimonials Section

**Data Structure:**
- Stored in site_configuration table as JSONB array
- Each testimonial object:
  - name (string)
  - message (string, max 300 characters)
  - rating (integer, 1-5)
  - profession (string, optional)
  - location (string, optional)
  - avatar_url (string, optional)

**Homepage Display:**
- Grid layout: 3 columns on desktop, 1 column on mobile
- Show 3 testimonials by default
- Carousel on mobile with dot indicators
- Auto-rotate every 5 seconds (optional)

**Testimonial Card Design:**
- Star rating at top (filled stars based on rating)
- Quoted message text (italic, gray color)
- Author name (bold)
- Profession and location (small, gray)
- Avatar image (circular, 48px) or placeholder initials

**Admin Management:**
- CRUD operations for testimonials
- Drag-and-drop reordering
- Feature toggle to show/hide section
- Preview mode before publishing

---

## 6. USER FLOWS & JOURNEY MAPS

### 6.1 New User Registration & Application Flow

**Entry Point:** User lands on homepage

**Flow:**
1. User views homepage with hero section and deadline animation
2. User reads brief information and testimonials
3. User clicks "Faire une demande" button
4. User redirected to authentication page
5. User enters phone number with country code
6. User receives OTP via SMS
7. User enters OTP code to verify
8. System creates user account and authenticates
9. User redirected to Step 0 (funding amount)
10. User enters funding amount and clicks "Continue"
11. System generates application number and record
12. User proceeds through Steps 1-3 sequentially
13. At Step 3, automatic validation occurs
14. User sees success message with WhatsApp/Email options
15. User contacts advisor or proceeds to dashboard

**Decision Points:**
- If phone number already exists: Log in existing user
- If OTP fails: Allow retry (max 3 attempts)
- If validation fails on any step: Show errors, prevent progression
- If user exits mid-application: Save draft, allow resume later

### 6.2 Returning User Flow

**Entry Point:** User navigates to site

**Flow:**
1. User lands on homepage or login page
2. User enters phone number
3. User receives and enters OTP
4. System authenticates and redirects to dashboard
5. Dashboard shows current application status
6. If application incomplete: Allow user to continue from last step
7. If application complete: Show Step 3 confirmation screen
8. User can upload RIB if pending
9. User can contact advisor anytime

**Special Cases:**
- Multiple applications: Show list, allow user to select
- No application: Redirect to "Start Application" flow

### 6.3 Admin Workflow

**Entry Point:** Admin navigates to admin login URL

**Flow:**
1. Admin enters admin credentials (email + password or phone + OTP)
2. System verifies admin role
3. Admin redirected to dashboard overview
4. Admin views statistics and application table
5. Admin can:
   - Search and filter applications
   - Click application to view details
   - Change application status
   - Download documents
   - Add notes
   - Manage users
   - Update site configuration
6. Admin logs out when done

**Key Actions:**
- Approve application: Updates status, sends notification
- Reject application: Requires reason, updates status
- Request info: Generates email to user
- Bulk actions: Select multiple, apply action

---

## 7. SECURITY & COMPLIANCE

### 7.1 Authentication Security

**Token Management:**
- JWT tokens with short expiration (1 hour for access token)
- Refresh tokens with longer expiration (7 days)
- Secure HTTP-only cookies for token storage
- CSRF protection via SameSite cookie attribute
- Token refresh mechanism before expiration

**Password Policies (for admin accounts):**
- Minimum 12 characters
- Require uppercase, lowercase, number, special character
- Password strength indicator during input
- Bcrypt hashing with salt rounds >= 12
- Password reset via email with expiring token

**Session Security:**
- Logout on browser close (optional)
- Inactive session timeout: 30 minutes
- Concurrent session management (allow single session per user)
- Session hijacking prevention via IP and user-agent validation

**OTP Security:**
- 6-digit numeric codes
- Expiration: 10 minutes
- Rate limiting: 3 OTP requests per hour per phone number
- Attempt limiting: 5 failed OTP verifications, then lockout
- Secure OTP delivery via reputable SMS provider

### 7.2 Data Protection

**Encryption:**
- Data in transit: TLS 1.3 (HTTPS enforced)
- Data at rest: Supabase's AES-256 encryption
- Sensitive fields: Additional application-level encryption (optional for PII)

**Personal Data Handling:**
- Minimize data collection (only necessary fields)
- Data retention policy: 7 years for financial records, deletable on request
- Right to erasure: User-initiated account deletion
- Data portability: Export user data on request (JSON format)
- Audit logs for all data access and modifications

**Database Security:**
- Row-Level Security (RLS) policies enforced
- Principle of least privilege for database roles
- Prepared statements to prevent SQL injection
- Input sanitization and validation
- Regular security audits

**File Upload Security:**
- Validate file types via magic numbers
- Virus scanning on upload (optional, via third-party)
- Separate storage bucket from application code
- Signed URLs for temporary access
- No executable files allowed

### 7.3 GDPR & Privacy Compliance

**User Rights:**
- Right to access: Dashboard shows all user data
- Right to rectification: Users can edit information
- Right to erasure: Account deletion functionality
- Right to data portability: Export data option
- Right to object: Opt-out of communications

**Privacy Policy:**
- Clear, concise language (not legal jargon)
- Explain data collection, usage, storage
- Detail third-party services (Supabase, SMS provider)
- User consent mechanism (checkbox on registration)
- Accessible from footer on all pages

**Cookie Consent:**
- Cookie banner on first visit
- Categorize cookies: Essential, Functional, Analytics
- Allow granular consent per category
- Remember user's choice
- Link to cookie policy

**Data Processing:**
- User as data controller, platform as data processor
- Document legal basis for processing (contract, consent)
- Data Processing Agreement (DPA) if applicable
- Notify users of data breaches within 72 hours

### 7.4 API Security

**Rate Limiting:**
- Per endpoint limits (e.g., 100 requests per 15 minutes)
- Per user limits (authenticated)
- Per IP limits (unauthenticated)
- Exponential backoff for repeated violations

**Input Validation:**
- Validate all inputs server-side
- Whitelist allowed characters per field
- Sanitize HTML to prevent XSS
- Escape SQL to prevent injection
- Validate JSON structure for API requests

**CORS Configuration:**
- Strict origin whitelist
- Credentials allowed only for same origin
- Preflight caching for performance

**API Authentication:**
- Bearer token in Authorization header
- API key for server-to-server (if needed)
- Webhook signature verification

### 7.5 Vulnerability Prevention

**XSS Prevention:**
- Escape all user-generated content
- Content Security Policy (CSP) headers
- Use React's built-in XSS protection
- Sanitize rich text inputs

**CSRF Prevention:**
- SameSite cookie attribute
- CSRF tokens for state-changing operations
- Verify Referer header

**Clickjacking Prevention:**
- X-Frame-Options header (DENY)
- frame-ancestors directive in CSP

**SQL Injection Prevention:**
- Parameterized queries (Supabase uses these)
- ORM usage (Supabase provides safe abstractions)
- Input validation and sanitization

**Regular Updates:**
- Keep dependencies updated (weekly checks)
- Monitor security advisories (GitHub Dependabot)
- Apply patches promptly
- Regular security audits (quarterly)

---

## 8. PERFORMANCE & OPTIMIZATION

### 8.1 Frontend Performance

**Core Web Vitals Targets:**
- Largest Contentful Paint (LCP): < 2.5s
- First Input Delay (FID): < 100ms
- Cumulative Layout Shift (CLS): < 0.1

**Optimization Techniques:**

**Code Splitting:**
- Route-based splitting (automatic with Next.js)
- Component lazy loading with React.lazy and Suspense
- Dynamic imports for heavy libraries
- Separate bundles for each language

**Image Optimization:**
- Next.js Image component for automatic optimization
- WebP format with fallbacks
- Responsive images with srcset
- Lazy loading for below-the-fold images
- Blur-up placeholders (LQIP technique)

**Font Optimization:**
- Self-host fonts for GDPR compliance and performance
- Font subsetting (include only used characters)
- Font-display: swap for FOUT strategy
- Preload critical fonts

**CSS Optimization:**
- Tailwind CSS purging (remove unused classes)
- Critical CSS inlining for above-the-fold content
- CSS-in-JS optimization (if used)
- Minimize CSS bundle size

**JavaScript Optimization:**
- Tree shaking to remove unused code
- Minification and compression (Gzip/Brotli)
- Avoid large third-party libraries
- Use native browser APIs when possible

**Caching Strategy:**
- Static assets: Long cache durations (1 year)
- API responses: Short cache durations with revalidation
- Service worker for offline support (optional for MVP)

### 8.2 Backend Performance

**Database Optimization:**
- Proper indexing on frequently queried columns
- Query optimization (avoid N+1 queries)
- Connection pooling (Supabase handles this)
- Pagination for large result sets

**API Performance:**
- Response compression (Gzip/Brotli)
- GraphQL or efficient REST endpoints
- Batch requests where possible
- Caching frequently accessed data (Redis, optional)

**File Upload Performance:**
- Direct upload to Supabase Storage (client-side)
- Chunked uploads for large files
- Background processing for thumbnails
- CDN for file delivery

### 8.3 Monitoring & Analytics

**Performance Monitoring:**
- Real User Monitoring (RUM) via Vercel Analytics
- Track Core Web Vitals
- Monitor API response times
- Error tracking with Sentry (optional)

**Usage Analytics:**
- Google Analytics 4 or privacy-focused alternative (Plausible)
- Track key user actions: registrations, submissions, completions
- Funnel analysis for application flow
- Geographic distribution of users

**Alerting:**
- Alert on performance degradation
- Alert on error rate spikes
- Alert on failed background jobs
- Monitor uptime (99.9% target)

### 8.4 Scalability Considerations

**Current MVP Scale:**
- Expected load: 100-1000 users
- Concurrent users: 10-50
- Supabase free tier sufficient initially

**Future Scaling Path:**
- Upgrade Supabase plan for higher limits
- Implement caching layer (Redis)
- CDN for global content delivery
- Database read replicas for heavy read workloads
- Microservices architecture for specific heavy features

---

## 9. DEVELOPMENT CHECKLIST

### Phase 1: Project Setup & Infrastructure (Days 1-2)

- [ ] Initialize Next.js project with TypeScript
- [ ] Set up Tailwind CSS and shadcn/ui
- [ ] Configure Supabase project and connection
- [ ] Set up environment variables for dev/staging/prod
- [ ] Configure ESLint, Prettier for code quality
- [ ] Set up Git repository with branching strategy
- [ ] Install and configure next-intl for i18n
- [ ] Create translation file structure for all 6 languages
- [ ] Set up Vercel project and connect repository

### Phase 2: Database & Authentication (Days 3-5)

- [ ] Design and create database schema in Supabase
- [ ] Implement Row-Level Security (RLS) policies
- [ ] Create database functions (application number generation)
- [ ] Set up Supabase Auth with phone OTP
- [ ] Implement authentication flow (phone input, OTP verification)
- [ ] Create protected route middleware
- [ ] Set up role-based access control (user/admin)
- [ ] Test authentication edge cases

### Phase 3: Design System & Core Components (Days 6-8)

- [ ] Define color palette and typography system
- [ ] Create base UI components (Button, Input, Card, etc.)
- [ ] Build form components with validation
- [ ] Implement phone number input with country selector
- [ ] Create progress indicator component
- [ ] Build modal and dialog components
- [ ] Implement toast notification system
- [ ] Create file upload component with drag-and-drop
- [ ] Build data table component for admin
- [ ] Test components across browsers and devices

### Phase 4: Homepage & Marketing Pages (Days 9-10)

- [ ] Design and implement homepage hero section
- [ ] Create deadline animation component
- [ ] Build testimonials section with carousel
- [ ] Implement language switcher
- [ ] Create footer with links
- [ ] Add SEO meta tags and Open Graph
- [ ] Optimize images and assets
- [ ] Test responsive design on all breakpoints
- [ ] Implement privacy policy and terms pages
### Phase 5: Application Flow (Days 11-16)

- [ ] Build Step 0: Funding amount input
- [ ] Build Step 1: Personal information form
- [ ] Build Step 2: Financial details form
- [ ] Build Step 3: Auto-validation and contact screen
- [ ] Implement form validation for all steps
- [ ] Create draft auto-save functionality
- [ ] Implement step navigation (back/next)
- [ ] Build progress indicator for multi-step form
- [ ] Connect forms to Supabase database
- [ ] Test complete application flow
- [ ] Implement error handling for all scenarios

### Phase 6: User Dashboard (Days 17-19)

- [ ] Design and implement dashboard layout
- [ ] Build application overview card with status
- [ ] Create progress tracker component
- [ ] Implement RIB file upload functionality
- [ ] Build document management section
- [ ] Add WhatsApp and email contact buttons
- [ ] Create application number display with copy
- [ ] Implement empty state for new users
- [ ] Test dashboard with various application states
- [ ] Optimize for mobile devices

### Phase 7: Admin Dashboard (Days 20-24)

- [ ] Design and implement admin dashboard layout
- [ ] Build statistics overview section
- [ ] Create applications data table with sorting
- [ ] Implement search and filter functionality
- [ ] Build application detail modal
- [ ] Add status change functionality
- [ ] Implement document viewer (PDF/image)
- [ ] Create bulk actions feature
- [ ] Build user management interface
- [ ] Create site configuration panel
- [ ] Add admin-specific authentication
- [ ] Test all admin operations thoroughly

### Phase 8: File Management (Days 25-26)

- [ ] Set up Supabase Storage buckets
- [ ] Implement secure file upload with validation
- [ ] Create upload progress tracking
- [ ] Build file preview/viewer components
- [ ] Implement file deletion functionality
- [ ] Create thumbnail generation (if needed)
- [ ] Test file upload with various file types and sizes
- [ ] Implement error handling for upload failures

### Phase 9: Internationalization (Days 27-28)

- [ ] Complete translations for all UI text (6 languages)
- [ ] Implement language detection and switching
- [ ] Test date/time formatting per locale
- [ ] Test currency formatting per locale
- [ ] Verify all pages in all languages
- [ ] Check RTL readiness (future-proofing)
- [ ] Test language persistence across sessions

### Phase 10: Testing & Quality Assurance (Days 29-30)

- [ ] Cross-browser testing (Chrome, Firefox, Safari, Edge)
- [ ] Mobile device testing (iOS and Android)
- [ ] Accessibility audit (WCAG compliance)
- [ ] Performance testing (Lighthouse scores)
- [ ] Security audit (XSS, CSRF, SQL injection)
- [ ] User acceptance testing (UAT)
- [ ] Bug fixing and refinement
- [ ] Load testing for expected user volume

### Phase 11: Deployment & Launch (Day 31)

- [ ] Set up production environment variables
- [ ] Configure custom domain (monfinancement.co)
- [ ] Set up SSL certificates
- [ ] Deploy to Vercel production
- [ ] Configure DNS records
- [ ] Set up monitoring and error tracking
- [ ] Create backup strategy
- [ ] Prepare rollback plan
- [ ] Launch and monitor initial traffic
- [ ] Document deployment process

### Post-Launch Activities

- [ ] Monitor performance metrics
- [ ] Track user feedback
- [ ] Address any critical issues
- [ ] Plan feature enhancements
- [ ] Regular security updates
- [ ] Database maintenance

---

## 10. REAL-WORLD REFERENCES

### 10.1 Design Inspiration

**FinTech Platforms to Study:**

**Stripe Atlas (atlas.stripe.com):**
- Clean, professional design aesthetic
- Excellent use of white space
- Clear information hierarchy
- Trust-building elements (security badges, testimonials)
- Smooth onboarding flow

**Revolut Business (business.revolut.com):**
- Modern, vibrant color scheme
- Interactive animations that enhance UX
- Multi-step forms with clear progress
- Dashboard with data visualization
- Mobile-first approach

**Wise (wise.com):**
- Transparent, friendly design
- Progressive disclosure in forms
- Excellent error messaging
- Clear pricing and fee structure
- Localized content per market

**Klarna (klarna.com):**
- Bold, confident design
- Strong CTAs with high contrast
- Simplified application process
- Real-time validation feedback
- Trust indicators throughout

**Monzo (monzo.com):**
- Coral accent color for brand identity
- Card-based UI design
- Microinteractions for delight
- Clear status indicators
- Friendly, conversational tone

### 10.2 Technical Patterns to Implement

**Multi-Step Form Patterns:**
- Study Google Forms for step navigation
- Typeform for engaging form experience
- Calendly for date/time selection UI
- Wufoo for field validation patterns

**Dashboard Designs:**
- Notion for clean data tables
- Airtable for sortable/filterable views
- Linear for status badges and labels
- Asana for progress tracking

**Authentication Flows:**
- WhatsApp Web for phone number verification
- Telegram for OTP input
- Auth0 for professional auth UI
- Firebase Auth for social login patterns (reference only)

### 10.3 Component Libraries Reference

**shadcn/ui Components to Use:**
- Button, Input, Label (form basics)
- Select, RadioGroup, Checkbox (form controls)
- Dialog, Sheet, AlertDialog (modals)
- Toast (notifications)
- Table, Pagination (admin dashboard)
- Tabs, Accordion (content organization)
- Card, Badge (data display)
- DropdownMenu (action menus)
- Progress (loading states)
- Calendar, DatePicker (date selection)

**Additional Libraries:**
- react-hook-form for form state management
- zod for schema validation
- react-phone-number-input for phone inputs
- react-dropzone for file uploads
- recharts for any data visualization needs
- framer-motion for animations
- date-fns for date manipulation

### 10.4 Best Practices Documentation

**Next.js Best Practices:**
- Official Next.js documentation (nextjs.org/docs)
- App Router patterns and conventions
- Server vs Client Components decision guide
- Metadata API for SEO

**Supabase Best Practices:**
- Official Supabase documentation (supabase.com/docs)
- Row-Level Security policy examples
- Storage best practices
- Auth flow implementations

**Accessibility Resources:**
- WCAG 2.1 Guidelines (w3.org/WAI/WCAG21/quickref)
- WebAIM for accessibility testing
- A11y Project for practical patterns

**Security Resources:**
- OWASP Top 10 (owasp.org/www-project-top-ten)
- Web Security Cheat Sheet
- Supabase security best practices

---

## 11. QUALITY STANDARDS & DEFINITION OF DONE

### 11.1 Code Quality Standards

**TypeScript:**
- Zero TypeScript errors in production build
- No use of `any` type (use `unknown` instead)
- Proper interface/type definitions for all data structures
- Type guards for runtime validation

**Code Style:**
- Consistent formatting via Prettier
- ESLint rules enforced (no warnings)
- Meaningful variable and function names
- Maximum function length: 50 lines
- Maximum file length: 300 lines
- Single Responsibility Principle for components

**Documentation:**
- JSDoc comments for complex functions
- README with setup instructions
- API endpoint documentation
- Database schema documentation
- Deployment guide

### 11.2 Testing Standards (Optional for MVP, Recommended)

**Unit Tests:**
- Test utility functions
- Test validation logic
- Test data transformations

**Integration Tests:**
- Test form submissions
- Test authentication flow
- Test file uploads

**E2E Tests:**
- Test complete user journey
- Test admin workflows
- Test error scenarios

**Test Coverage:**
- Aim for 70%+ coverage
- Critical paths must be tested
- Edge cases documented if not tested

### 11.3 Performance Standards

**Frontend:**
- Lighthouse Performance Score: 90+
- Lighthouse Accessibility Score: 95+
- Lighthouse Best Practices Score: 95+
- Lighthouse SEO Score: 90+
- First Contentful Paint: < 1.5s
- Time to Interactive: < 3.5s

**Backend:**
- API response time: < 500ms (95th percentile)
- Database query time: < 100ms (95th percentile)
- File upload time: Proportional to file size, progress shown

**Mobile:**
- Page weight: < 2MB initial load
- Touch targets: Minimum 44x44px
- No horizontal scrolling (unless intended)
- Smooth scrolling (60fps)

### 11.4 Security Standards

**Code Security:**
- No hard-coded secrets or API keys
- Environment variables for all sensitive data
- No console.log statements in production
- Input sanitization on all user inputs
- Output encoding for all displayed data

**Deployment Security:**
- HTTPS enforced (HTTP redirects to HTTPS)
- Security headers configured (CSP, HSTS, etc.)
- CORS properly configured
- Rate limiting enabled
- Error messages don't expose system details

### 11.5 Accessibility Standards

**WCAG 2.1 AA Compliance:**
- Color contrast ratio: 4.5:1 for normal text, 3:1 for large
- Keyboard navigation for all interactive elements
- Focus indicators clearly visible
- Form labels properly associated
- Error messages accessible to screen readers
- No reliance on color alone for information
- Captions for any media content (if applicable)

### 11.6 Definition of Done (Per Feature)

A feature is considered complete when:

- [ ] Code is written and follows style guide
- [ ] Code is reviewed and approved
- [ ] TypeScript types are properly defined
- [ ] Unit tests written and passing (if applicable)
- [ ] Integration tests passing (if applicable)
- [ ] Feature works across all supported browsers
- [ ] Feature works on mobile devices
- [ ] Feature is accessible (keyboard navigation, screen reader)
- [ ] Feature is translated in all 6 languages
- [ ] Performance benchmarks met
- [ ] Security review completed
- [ ] Documentation updated
- [ ] Merged to main branch
- [ ] Deployed to staging and verified
- [ ] Approved by stakeholder (client)

---

## 12. HANDOFF & MAINTENANCE

### 12.1 Project Handoff Checklist

**Code Delivery:**
- [ ] Complete source code repository access
- [ ] All dependencies listed in package.json
- [ ] Environment variable template (.env.example)
- [ ] Git history preserved
- [ ] Branch protection rules configured

**Documentation:**
- [ ] Setup and installation guide
- [ ] Architecture overview document
- [ ] Database schema documentation
- [ ] API documentation
- [ ] Deployment procedures
- [ ] Troubleshooting guide

**Access & Credentials:**
- [ ] Supabase project ownership transfer
- [ ] Vercel project transfer or admin access
- [ ] Domain registrar access
- [ ] DNS management access
- [ ] SMS provider account (if applicable)
- [ ] Analytics account access

**Training Materials:**
- [ ] Admin dashboard user guide
- [ ] Video walkthrough of features
- [ ] FAQ document
- [ ] Support contact information

### 12.2 Maintenance Recommendations

**Regular Tasks (Weekly):**
- Monitor error logs for issues
- Check performance metrics
- Review user feedback
- Verify backup completion

**Regular Tasks (Monthly):**
- Update dependencies (security patches)
- Review and rotate API keys
- Check database performance
- Analyze usage patterns

**Regular Tasks (Quarterly):**
- Security audit
- Performance optimization review
- User experience improvements based on feedback
- Feature enhancement planning

**Emergency Procedures:**
- Rollback procedure documentation
- Incident response plan
- Data recovery procedures
- Contact escalation path

---

## 13. FINAL NOTES FOR AI AGENT

### 13.1 Development Priorities

**Must-Have (Priority 1):**
- Secure authentication system
- Complete application flow (Steps 0-3)
- Database with proper RLS policies
- User and admin dashboards
- File upload functionality
- Multilingual support (all 6 languages)

**Should-Have (Priority 2):**
- Performance optimizations
- Advanced animations
- Comprehensive error handling
- Analytics integration
- Email notifications

**Nice-to-Have (Priority 3):**
- Advanced admin analytics
- Bulk operations
- Export functionality
- Additional customization options

### 13.2 Common Pitfalls to Avoid

**Security:**
- Don't store sensitive data in localStorage
- Don't expose API keys in client code
- Don't trust client-side validation alone
- Don't implement custom crypto (use proven libraries)

**Performance:**
- Don't load unnecessary JavaScript on initial page load
- Don't make sequential API calls when batch is possible
- Don't use large unoptimized images
- Don't skip code splitting

**User Experience:**
- Don't use generic error messages ("Something went wrong")
- Don't make users repeat information
- Don't hide important actions behind multiple clicks
- Don't forget loading states
- Don't ignore mobile users

**Code Quality:**
- Don't duplicate logic across components
- Don't create god components (>500 lines)
- Don't skip TypeScript types
- Don't ignore ESLint warnings
- Don't write code without considering future maintenance

### 13.3 Success Metrics

**Technical Success:**
- Zero critical security vulnerabilities
- 95%+ uptime
- Sub-3-second page load times
- All Lighthouse scores above 90
- Cross-browser compatibility verified

**Business Success:**
- Smooth application submission process
- Low form abandonment rate
- High admin efficiency
- Positive user feedback
- Scalable for future growth

### 13.4 Key Principles

1. **Security First:** Every decision should consider security implications
2. **User-Centric Design:** Prioritize user experience over technical cleverness
3. **Performance Matters:** Fast is a feature, not an afterthought
4. **Accessibility Always:** Build for all users, including those with disabilities
5. **Mobile-First:** Design and develop for mobile first, enhance for desktop
6. **Maintainable Code:** Write code that future you (or others) can understand
7. **Data Integrity:** Protect user data at all costs
8. **Progressive Enhancement:** Build core functionality, enhance with JavaScript
9. **Fail Gracefully:** Handle errors elegantly, never crash silently
10. **Document Decisions:** Leave context for future maintainers

---

## END OF SPECIFICATION DOCUMENT

This comprehensive specification provides all the necessary details to build a professional, secure, and user-friendly FinTech platform. The AI agent and developer should reference this document throughout the development lifecycle, treating it as the single source of truth for project requirements, design specifications, and technical implementation details.

**Remember:** This is an MVP, so focus on core functionality first, but build it with solid engineering practices that allow for future expansion. Quality over quantity. Security and user experience are non-negotiable.