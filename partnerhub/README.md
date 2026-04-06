# PartnerHub — NavGurukul Partnership CRM

A lightweight, HubSpot-inspired CRM built specifically for managing NavGurukul's partnerships with NGOs, government bodies, corporates, and placement partners.

![Built with Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)
![Database](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?logo=supabase)
![Deployed on](https://img.shields.io/badge/Vercel-Deployed-000?logo=vercel)

## ✨ Features

- **🔀 Pipeline Board** — Drag-and-drop Kanban board to move partners through stages (Lead → Active Partner → Closed)
- **📊 Analytics Dashboard** — KPI cards, bar charts, pie charts showing partnership status at a glance
- **🏢 Partner Management** — Full CRUD with type filtering (NGO, Government, Corporate, Placement)
- **⚡ Activity Timeline** — Log calls, emails, meetings, and notes for each partner
- **📅 Follow-up Tracking** — Schedule and manage follow-up reminders with overdue alerts
- **👥 Contact Management** — Track contact persons linked to each partner organization
- **🔐 Authentication** — Login/signup with Supabase Auth (or use Demo Mode instantly)
- **🌙 Dark Mode** — Premium dark UI with glassmorphism and micro-animations
- **📱 Responsive** — Works on desktop, tablet, and mobile

## 🚀 Quick Start

### Demo Mode (No Setup Required)
```bash
npm install
npm run dev
```
Open http://localhost:3000 and click **"Enter Demo Mode"** — the app works fully with pre-loaded NavGurukul partner data.

### With Supabase (Full Database)
1. Create a free project at [supabase.com](https://supabase.com)
2. Run the SQL from `supabase-schema.sql` in your Supabase SQL Editor
3. Copy `.env.local.example` to `.env.local` and fill in your credentials:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```
4. Run the app:
   ```bash
   npm run dev
   ```

## 🏗️ Tech Stack

| Layer | Technology | Why |
|-------|-----------|-----|
| Framework | **Next.js 14** (App Router) | Full-stack React, SSR, API routes |
| Database | **Supabase** (PostgreSQL) | Free tier, built-in Auth, RLS |
| Styling | **Vanilla CSS** | Full control, no dependencies |
| Charts | **Recharts** | Lightweight React charting |
| Hosting | **Vercel** | Zero-config Next.js deployment |

## 📁 Project Structure

```
partnerhub/
├── app/
│   ├── page.js                     # Login page
│   ├── layout.js                   # Root layout
│   ├── globals.css                 # Design system
│   └── (dashboard)/
│       ├── layout.js               # Dashboard shell with sidebar
│       ├── dashboard/page.js       # Analytics dashboard
│       ├── pipeline/page.js        # Kanban pipeline board
│       ├── partners/
│       │   ├── page.js             # Partners list
│       │   ├── new/page.js         # Add partner form
│       │   └── [id]/page.js        # Partner detail
│       └── contacts/page.js        # All contacts
├── components/
│   └── Sidebar.js                  # Navigation sidebar
├── lib/
│   ├── supabase.js                 # Supabase client
│   ├── demo-data.js                # Demo data store
│   └── utils.js                    # Formatting helpers
└── supabase-schema.sql             # Database schema
```

## 🎯 NavGurukul Partnership Types

| Type | Color | Examples |
|------|-------|---------|
| NGO | 🔵 Blue | Educate Girls, Pratham, Magic Bus |
| Government | 🟣 Purple | Rajasthan Education Dept, CG Skill Dev Authority |
| Corporate | 🟢 Green | Amazon, Microsoft, KPMG, Accenture |
| Placement | 🟡 Yellow | Infosys BPM, Wipro Foundation |

## 🚢 Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

1. Push this repo to GitHub
2. Import in Vercel
3. Add environment variables (if using Supabase)
4. Deploy!

## 📝 Trade-offs & Design Decisions

- **Demo Mode First**: App works without any backend setup — perfect for quick demos
- **Dark Mode**: Chose a premium CRM aesthetic (inspired by Linear/Vercel) over a generic admin panel
- **Native Drag & Drop**: Used HTML5 drag-and-drop for Kanban instead of a library, keeping the bundle small
- **NavGurukul-Specific**: Partner types (NGO, Govt, Corporate, Placement) are tailored to NavGurukul's actual partnership structure
- **Supabase over Custom Backend**: Eliminates the need for a separate server, reduces complexity, and provides free hosting

---

Built with ❤️ for NavGurukul
