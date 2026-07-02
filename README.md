# 🚀 Lead Manager Pro

> A premium, enterprise-grade Lead Tracker CRM built with React, TypeScript, and Tailwind CSS — fully client-side, zero backend required.

![Lead Manager Pro](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react) ![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript) ![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-06B6D4?style=flat-square&logo=tailwindcss) ![Vite](https://img.shields.io/badge/Vite-7-646CFF?style=flat-square&logo=vite) ![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

---

## 📸 Overview

**Lead Manager Pro** is a full-featured CRM dashboard designed for sales teams to track leads across a pipeline, visualise performance, manage follow-ups on a calendar, and get insights through charts — all stored locally in the browser.

---

## ✨ Features

| Feature | Description |
|---|---|
| **Dashboard** | Welcome header, animated KPI stat cards per stage, searchable & sortable lead table with pagination |
| **Lead Drawer** | Click any lead to open a sliding side-panel with Details / Notes / Activity tabs — edit without losing context |
| **Kanban Pipeline** | Drag-and-drop board powered by `@dnd-kit` — move leads between stages visually |
| **Reports** | Recharts-powered analytics: pipeline funnel, lead distribution donut, budget analysis, monthly trends, upcoming follow-ups |
| **Calendar** | Month grid with custom event creation (Meeting, Call, Deadline, Reminder, Other) + follow-up date overlays |
| **Add / Edit Lead** | Floating-label form with validation, loading states, and success toasts |
| **Dark Mode** | Full light / dark theme toggle, persisted to `localStorage` |
| **Settings** | Editable profile (name, role, email), notification toggles, CSV export, and danger-zone data wipe |
| **Global Search** | Search bar in the top nav filters leads across the dashboard |
| **Framer Motion** | Page transitions, staggered table rows, animated counters, card hover effects |

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 + TypeScript |
| Build | Vite 7 |
| Routing | wouter |
| Styling | Tailwind CSS v4 + shadcn/ui (Radix UI) |
| Animations | Framer Motion |
| Charts | Recharts |
| Drag & Drop | @dnd-kit/core + @dnd-kit/sortable |
| Data | Browser `localStorage` (no backend) |
| Icons | Lucide React |
| Toasts | Sonner |
| Date utils | date-fns |

---

## 📁 Project Structure

```
artifacts/lead-tracker/
├── src/
│   ├── App.tsx                        # Router + providers (Theme, QueryClient)
│   ├── index.css                      # CSS variables — full light/dark palette
│   ├── contexts/
│   │   └── ThemeContext.tsx           # Dark mode context + localStorage persistence
│   ├── hooks/
│   │   └── useLeads.ts                # CRUD hook over localStorage
│   ├── lib/
│   │   ├── constants.ts               # Lead interface, Stage type, DUMMY_LEADS
│   │   ├── storage.ts                 # localStorage helpers (getLeads, saveLead, deleteLead)
│   │   ├── format.ts                  # formatCurrency, formatDate, formatRelativeDate
│   │   └── utils.ts                   # cn() utility (clsx + tailwind-merge)
│   ├── pages/
│   │   ├── Dashboard.tsx              # Main view: KPI cards + lead table + drawer
│   │   ├── Pipeline.tsx               # Kanban board with @dnd-kit
│   │   ├── Reports.tsx                # Analytics with Recharts
│   │   ├── CalendarPage.tsx           # Calendar with custom event management
│   │   ├── AddLead.tsx                # New lead form page
│   │   ├── LeadDetail.tsx             # Lead detail/edit page (direct URL)
│   │   └── Settings.tsx               # Profile + appearance + data management
│   └── components/
│       ├── layout/
│       │   └── Layout.tsx             # Collapsible sidebar + sticky top nav
│       ├── leads/
│       │   ├── LeadCard.tsx           # Stage stat card with animated count
│       │   ├── LeadTable.tsx          # Sortable, paginated lead table
│       │   ├── LeadForm.tsx           # Reusable add/edit form (floating labels)
│       │   ├── LeadDrawer.tsx         # Sliding Sheet for lead detail
│       │   ├── StageBadge.tsx         # Coloured stage pill
│       │   └── StageFilter.tsx        # Stage chip filter bar
│       └── ui/                        # shadcn/ui components (Button, Card, Dialog, etc.)
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- pnpm 8+

### Installation

```bash
# Clone the repo
git clone https://github.com/Chandruchandru956/New-Lead-Manager-Pro.git
cd New-Lead-Manager-Pro

# Install dependencies (monorepo)
pnpm install

# Start the lead-tracker dev server
pnpm --filter @workspace/lead-tracker run dev
```

The app will be available at `http://localhost:5173` (or the port shown in your terminal).

---

## 📊 Lead Stages

Leads flow through six pipeline stages:

```
New → Contacted → Qualified → Proposal → Won / Lost
```

Each stage has its own colour, icon, and KPI card on the dashboard.

---

## 💾 Data Persistence

All data is stored in the browser's `localStorage`:

| Key | Contents |
|---|---|
| `crm_leads` | Array of all leads |
| `crm_theme` | `"dark"` or `"light"` |
| `crm_profile` | User profile (name, role, email) |
| `crm_calendar_events` | Custom calendar events |

You can export all leads as a `.csv` file from the **Settings → Data Management** panel.

---

## 🎨 Customisation

- **Theme colours** — edit CSS variables in `src/index.css` (`:root` for light, `.dark` for dark)
- **Stages** — add/remove entries in `src/lib/constants.ts` → `STAGES` array and `STAGE_COLORS` map
- **Dummy data** — swap out `DUMMY_LEADS` in `src/lib/constants.ts`
- **Profile defaults** — update `DEFAULT_PROFILE` in `src/pages/Settings.tsx`

---

## 📝 Short Note

Lead Manager Pro started as a straightforward lead-tracking table and evolved into a full enterprise SaaS dashboard. The entire application runs in the browser with no server, no database, and no API keys — making it instantly deployable anywhere static files can be served. The architecture deliberately keeps business logic (hooks, storage, constants) completely separate from the UI layer, so the interface can be restyled or extended without touching a single line of data logic.

---

## 🤝 Contributing

1. Fork the repo
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m "feat: add your feature"`
4. Push and open a PR

---

## 📄 License

MIT © Chandru — feel free to use, modify, and distribute.
