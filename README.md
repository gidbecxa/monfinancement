# 💼 Monfinancement

> Professional humanitarian funding platform providing non-refundable financial assistance in partnership with IMF and World Bank

[![Next.js](https://img.shields.io/badge/Next.js-16+-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.0+-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-Latest-3ECF8E?logo=supabase)](https://supabase.com/)

---

## 🌟 Overview

Monfinancement is a multilingual humanitarian assistance platform that facilitates non-refundable funding requests for individuals and families in need. The platform supports health, education, housing, and project financing through a streamlined application process.

### Key Features

- ✅ **Multi-step Application Form** - Intuitive 4-step funding request process
- 🌍 **6 Languages** - French (default), English, German, Spanish, Italian, Portuguese
- 📱 **Phone Authentication** - Secure phone + PIN authentication system
- 📊 **Real-time Dashboard** - Track application status and timeline
- 📄 **Document Management** - Secure document upload and verification
- 🔐 **Enterprise Security** - Row-level security policies with Supabase
- 🎨 **Professional UI** - Modern, accessible design system
- ⚡ **High Performance** - Server-side rendering with Next.js App Router
- 📹 **Rich Media SEO** - Open Graph video support for social sharing

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18.x or higher
- npm, yarn, or pnpm
- Supabase account

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/monfinancement.git
cd monfinancement

# Install dependencies
npm install
# or
pnpm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your Supabase credentials

# Run database migrations (in Supabase SQL Editor)
# Copy and run: supabase/migrations/001_initial_schema.sql

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

---

## 📁 Project Structure

```
monfinancement/
├── app/                        # Next.js App Router
│   ├── [locale]/              # Internationalized routes
│   │   ├── layout.tsx         # Locale layout
│   │   └── page.tsx           # Homepage
│   ├── layout.tsx             # Root layout
│   └── globals.css            # Global styles
├── components/                # React components
│   ├── layout/               # Layout components
│   │   ├── Header.tsx        # Navigation header
│   │   └── Footer.tsx        # Site footer
│   └── ui/                   # UI components
│       ├── Button.tsx        # Button component
│       ├── Input.tsx         # Input component
│       ├── Card.tsx          # Card component
│       └── LanguageSwitcher.tsx
├── lib/                      # Core libraries
│   ├── supabase/            # Supabase configuration
│   │   ├── client.ts        # Browser client
│   │   ├── server.ts        # Server client
│   │   └── middleware.ts    # Auth middleware
│   └── validations.ts       # Zod schemas
├── messages/                # i18n translations
│   ├── en.json              # English
│   ├── fr.json              # French
│   ├── es.json              # Spanish
│   ├── de.json              # German
│   ├── it.json              # Italian
│   └── pt.json              # Portuguese
├── types/                   # TypeScript types
│   └── database.types.ts    # Supabase types
├── utils/                   # Utility functions
│   └── helpers.ts           # Helper functions
├── supabase/               # Database migrations
│   └── migrations/
│       └── 001_initial_schema.sql
└── middleware.ts           # Next.js middleware
```

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **Forms**: React Hook Form
- **Validation**: Zod
- **i18n**: next-intl

### Backend
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth (Phone OTP)
- **Storage**: Supabase Storage
- **Real-time**: Supabase Subscriptions

### DevOps
- **Hosting**: Vercel
- **Domain**: monfinancement.co
- **SSL**: Automatic (Vercel)

---

## 🎨 Design System

### Color Palette

```css
/* Primary Colors */
--primary-800: #1E40AF;  /* Main primary */
--primary-900: #1E3A8A;  /* Dark primary */

/* Status Colors */
--success-500: #10B981;  /* Success green */
--warning-500: #F59E0B;  /* Warning amber */
--error-500: #EF4444;    /* Error red */

/* Neutral Grays */
--gray-50: #F9FAFB;      /* Backgrounds */
--gray-900: #111827;     /* Text */
```

### Typography

- **Font**: Inter (Google Fonts)
- **Monospace**: JetBrains Mono
- **Scale**: xs, sm, base, lg, xl, 2xl, 3xl, 4xl

### Components

All components follow accessibility best practices (WCAG 2.1 AA):
- Semantic HTML
- ARIA labels
- Keyboard navigation
- Focus management
- Color contrast ratios

---

## 🌍 Internationalization

Supported languages:
- 🇬🇧 English (en)
- 🇫🇷 French (fr) - Default
- 🇪🇸 Spanish (es)
- 🇩🇪 German (de)
- 🇮🇹 Italian (it)
- 🇵🇹 Portuguese (pt)

Language detection:
1. URL parameter (`/fr`, `/en`, etc.)
2. User preference (localStorage)
3. Browser language
4. Default (French)

---

## 🔐 Security

- ✅ Row Level Security (RLS) policies on all tables
- ✅ Phone number authentication (OTP)
- ✅ Secure file uploads with validation
- ✅ HTTP-only cookies for sessions
- ✅ HTTPS enforcement
- ✅ XSS protection
- ✅ CSRF protection
- ✅ Input validation (client & server)

---

## 📊 Database Schema

### Tables

1. **users** - User accounts and profiles
2. **funding_applications** - Funding requests
3. **application_documents** - Uploaded documents
4. **admin_users** - Admin accounts
5. **contact_preferences** - Contact information
6. **site_configuration** - Dynamic configuration

### Key Features

- Auto-generated application numbers (8 characters)
- Automatic timestamp updates
- Cascade deletions
- Comprehensive indexes
- Data validation constraints

---

## 🧪 Testing

```bash
# Run type checking
npm run type-check

# Run linting
npm run lint

# Build production bundle
npm run build
```

---

## 📈 Performance

- ⚡ Server-side rendering (SSR)
- 🚀 Automatic code splitting
- 🖼️ Image optimization
- 🔤 Font optimization
- 📦 Lazy loading
- 🎯 Bundle size optimization

Target metrics:
- First Contentful Paint: < 1.5s
- Time to Interactive: < 3.0s
- Lighthouse Score: > 95

---

## 🚀 Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Environment Variables

Required environment variables:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_SITE_URL=https://monfinancement.co
NEXT_PUBLIC_SITE_NAME=Monfinancement
```

---

## 📚 Documentation

- [Quick Start Guide](./QUICK_START.md)
- [Build Summary](./BUILD_SUMMARY.md)
- [Project Specification](./PROJECT_SPECIFICATION_AND_GUIDE.md)
- [Supabase Setup Guide](./SUPABASE_CONFIG_AND_SETUP_GUIDE.md)

---

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Write tests
5. Submit a pull request

---

## 📄 License

This project is proprietary software. All rights reserved.

---

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Supabase for the backend infrastructure
- Vercel for hosting
- Open source community

---

## 📞 Support

For support and inquiries:
- Email: contact@monfinancement.co
- Website: https://monfinancement.co

---

## 🗺️ Roadmap

### ✅ Phase 1: Foundation (Complete)
- Project setup
- UI components
- Internationalization
- Homepage

### 🔄 Phase 2: Database (In Progress)
- Schema creation
- RLS policies
- Storage buckets

### 📝 Phase 3: Authentication (Next)
- Phone login
- OTP verification
- Session management

### 📄 Phase 4: Application Form
- Multi-step wizard
- File uploads
- Draft saving

### 📊 Phase 5: Dashboards
- User dashboard
- Admin dashboard

### 🚀 Phase 6: Production
- Testing
- Optimization
- Deployment

---

## 💻 Development

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Run linting
npm run lint
```

---

**Built with ❤️ by the Monfinancement Team**

© 2025 Monfinancement. All rights reserved.
