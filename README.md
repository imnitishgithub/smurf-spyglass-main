# MuleCatcher - Graph-Based Financial Forensics Engine

A production-ready fintech web application for detecting coordinated money muling networks using deterministic structural graph analysis.

## Project Status

✅ **Backend Integration Complete** - Frontend fully integrated with backend AML detection API

## Quick Start

```bash
# 1. Clone repository
git clone <YOUR_GIT_URL>
cd smurf-spyglass-main

# 2. Install dependencies
npm install

# 3. Configure backend URL
cp .env.example .env.local
# Edit .env.local and set your backend API URL

# 4. Start development server
npm run dev
```

Then open http://localhost:5173 in your browser.

## Backend Integration

This frontend communicates with a backend API for:
- CSV file validation
- Transaction graph analysis  
- Fraud ring detection
- Risk scoring and coordination strength calculation

**Documentation:**
- **[BACKEND_INTEGRATION.md](./BACKEND_INTEGRATION.md)** - Complete API reference
- **[SETUP_GUIDE.md](./SETUP_GUIDE.md)** - Detailed setup and deployment guide
- **[INTEGRATION_CHECKLIST.md](./INTEGRATION_CHECKLIST.md)** - Testing procedures
- **[QUICK_REFERENCE.md](./QUICK_REFERENCE.md)** - Fast reference for developers

## Environment Variables

Create `.env.local` (copy from `.env.example`):

```
# Backend API Base URL
REACT_APP_API_URL=http://localhost:5000/api

# Optional: Enable debug logging
REACT_APP_DEBUG=false
```

## Key Features

### 📤 File Upload & Validation
- Drag-and-drop CSV upload
- Real-time validation against backend
- Support for large datasets (10MB+)
- Required columns: `sender`, `receiver`, `amount`, `timestamp`

### 📊 Results Dashboard
- **Summary Metrics** - Total accounts, suspicious accounts, rings detected
- **Suspicious Accounts Table** - Risk scores, patterns, ring membership
- **Fraud Ring Summary** - Member counts, pattern types, coordination metrics
- **Interactive Graph** - Zoom, pan, hover for details

### 🔎 Detailed Analysis
- Pattern detection: Cycles, fan-in/fan-out, shell chains
- Coordination strength metrics
- AI-generated explanations (if backend supports)
- Risk level classification (LOW/MEDIUM/HIGH/CRITICAL)

### 📥 Export Functionality
- Download full analysis as JSON
- Exact backend response without modification

## Project Structure

```
src/
├── components/          # React components
│   ├── UploadManager.tsx    # File upload UI with validation
│   ├── GraphCanvas.tsx      # Transaction graph visualization
│   ├── RiskBadge.tsx        # Risk level display
│   └── WhyScorePanel.tsx    # Risk explanation panel
├── pages/               # Page components
│   ├── Home.tsx             # Landing page
│   ├── Analytics.tsx        # Results dashboard
│   ├── TransactionGraph.tsx # Graph view
│   └── ...
├── lib/
│   ├── api.ts           # Backend API integration
│   ├── types.ts         # TypeScript interfaces
│   └── mockData.ts      # Fallback sample data
├── store/
│   └── useAppStore.ts   # Zustand state management
└── layouts/
    └── DashboardLayout.tsx # Main layout wrapper
```

## API Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/validate` | Validate CSV file |
| POST | `/api/analyze` | Run full analysis |
| GET | `/api/cases` | Get case history |
| GET | `/api/cases/:id` | Get case details |
| GET | `/api/health` | Health check |

See [BACKEND_INTEGRATION.md](./BACKEND_INTEGRATION.md) for full API reference.

## Technologies

- **Frontend**: React 18 + TypeScript
- **State Management**: Zustand
- **UI Components**: shadcn/ui
- **Styling**: Tailwind CSS
- **Build Tool**: Vite
- **API Client**: Fetch API
- **Graph Visualization**: D3.js / Cytoscape.js

## Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm run test         # Run tests
npm run test:watch   # Run tests in watch mode
```

### Testing the Integration

1. **Ensure backend is running** at the configured `REACT_APP_API_URL`
2. **Upload a test CSV** with required columns
3. **Click Validate** to test backend connection
4. **Click Run Detection** to perform analysis
5. **View results** in Analytics dashboard and Graph page

For comprehensive testing, see [INTEGRATION_CHECKLIST.md](./INTEGRATION_CHECKLIST.md).

## Deployment

### Vercel (Recommended)
```bash
vercel deploy
# Set REACT_APP_API_URL environment variable in Vercel dashboard
```

### Docker
```bash
docker build -t mulecatcher .
docker run -p 3000:3000 -e REACT_APP_API_URL=http://api:5000/api mulecatcher
```

### Traditional Server
```bash
npm run build
# Serve dist/ folder with nginx/Apache
```

See [SETUP_GUIDE.md](./SETUP_GUIDE.md) for detailed deployment instructions.

## Troubleshooting

### Backend Connection Issues
- **Check backend URL** in `.env.local` is correct and backend is running
- **CORS errors?** Backend must have CORS enabled for your frontend domain
- **File upload fails?** Check file size and CSV format

### Test Backend Connectivity
```bash
curl http://localhost:5000/api/health
curl -X POST -F "file=@test.csv" http://localhost:5000/api/validate
```

See [SETUP_GUIDE.md](./SETUP_GUIDE.md) troubleshooting section for more help.

## Documentation

| Document | Purpose |
|----------|---------|
| [BACKEND_INTEGRATION.md](./BACKEND_INTEGRATION.md) | API reference & contract |
| [SETUP_GUIDE.md](./SETUP_GUIDE.md) | Setup, deployment & troubleshooting |
| [INTEGRATION_CHECKLIST.md](./INTEGRATION_CHECKLIST.md) | Testing procedures |
| [INTEGRATION_SUMMARY.md](./INTEGRATION_SUMMARY.md) | What was integrated |
| [QUICK_REFERENCE.md](./QUICK_REFERENCE.md) | Quick dev reference |
| [.env.example](./.env.example) | Environment variables template |

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)
