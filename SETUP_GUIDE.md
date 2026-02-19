# MuleCatcher Frontend - Complete Setup Guide

This guide walks you through setting up and deploying the MuleCatcher frontend with backend integration.

## Quick Start

### Prerequisites

- Node.js 16+ (or use nvm)
- npm, yarn, pnpm, or bun
- A running MuleCatcher backend API server

### 1. Clone & Install

```bash
# Clone the repository (if not already done)
git clone <repository-url>
cd smurf-spyglass-main

# Install dependencies
npm install
# or
pnpm install
# or
yarn install
# or
bun install
```

### 2. Configure Backend URL

Create a `.env.local` file in the project root:

```bash
cp .env.example .env.local
```

Edit `.env.local` and set your backend API URL:

```
REACT_APP_API_URL=http://localhost:5000/api
```

For production:
```
REACT_APP_API_URL=https://api.yourdomain.com/api
```

### 3. Start Development Server

```bash
npm run dev
```

The application will open at `http://localhost:5173` (or the next available port).

### 4. Test the Integration

1. **Check Backend Connection:**
   - Open browser DevTools (F12)
   - Console should show no CORS or connection errors
   - If errors appear, verify backend URL in `.env.local`

2. **Upload Sample CSV:**
   - Create a test CSV with columns: `sender`, `receiver`, `amount`, `timestamp`
   - Upload via drag-and-drop or file picker
   - Click "Validate" to test the backend connection
   - Click "Run Detection" to perform full analysis

3. **View Results:**
   - Analytics dashboard shows accounts and rings
   - Transaction graph visualizes the network
   - All data comes from your backend API

---

## Architecture Overview

```
┌─────────────────────────────┐
│    Frontend (React/TS)      │
│  - Upload & Validation      │
│  - Results Dashboard        │
│  - Graph Visualization      │
│  - Export Tools             │
└─────────────┬───────────────┘
              │
              │ HTTP REST API
              │
┌─────────────▼───────────────┐
│   Backend API Server        │
│  - CSV Parsing              │
│  - Graph Analysis           │
│  - Pattern Detection        │
│  - Risk Scoring             │
│  - Results Serialization    │
└─────────────────────────────┘
```

---

## Deployment

### Option 1: Deploy to Vercel (Recommended)

The easiest way to deploy this React app to Vercel:

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# During deployment, add environment variable:
# REACT_APP_API_URL = https://api.yourdomain.com/api
```

Or through the Vercel dashboard:

1. Connect your GitHub repository to Vercel
2. Go to Project → Settings → Environment Variables
3. Add `REACT_APP_API_URL` with your backend URL
4. Deploy automatically on every push

### Option 2: Docker

Create a `Dockerfile` in the project root:

```dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY package*.json ./
RUN npm ci --only=production
EXPOSE 3000
ENV REACT_APP_API_URL=http://localhost:5000/api
CMD ["npm", "run", "preview"]
```

Build and run:

```bash
docker build -t mulecatcher-frontend .
docker run -p 3000:3000 -e REACT_APP_API_URL=http://backend-api:5000/api mulecatcher-frontend
```

### Option 3: Traditional Server (nginx)

1. Build for production:
```bash
npm run build
```

2. Serve with nginx:
```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        root /path/to/dist;
        try_files $uri /index.html;
    }

    location /api {
        proxy_pass http://backend-api:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

---

## Project Structure

```
src/
├── components/           # React components
│   ├── UploadManager.tsx # File upload & validation UI
│   ├── GraphCanvas.tsx   # Transaction graph visualization
│   ├── WhyScorePanel.tsx # Risk explanation panel
│   └── ui/               # Shadcn UI components
├── pages/                # Page components
│   ├── Home.tsx          # Landing page
│   ├── Analytics.tsx     # Results dashboard
│   ├── TransactionGraph.tsx # Graph visualization
│   └── ...
├── store/                # State management (Zustand)
│   └── useAppStore.ts    # Application state
├── lib/
│   ├── api.ts            # Backend API integration
│   ├── types.ts          # TypeScript interfaces
│   └── mockData.ts       # Fallback mock data
├── layouts/
│   └── DashboardLayout.tsx # Main layout
└── main.tsx              # Entry point
```

---

## Key Features

### 1. CSV Upload & Validation
- **Drag-and-drop** file upload
- **Real-time validation** against backend
- **Detailed error reporting**
- Required columns: `sender`, `receiver`, `amount`, `timestamp`

### 2. Analysis Results
- **Suspicious Accounts Table**
  - Risk scores (0-100)
  - Detected patterns
  - Ring membership
  
- **Fraud Ring Summary**
  - Member counts
  - Pattern types (cycle, fan-in/fan-out, shell)
  - Coordination metrics
  
- **Interactive Graph**
  - Node zoom & pan
  - Hover tooltips
  - Ring color clustering
  - Suspicious account highlighting

### 3. Export Functionality
- **Download as JSON** - Full analysis results
- **Graph visualization** - PNG export (optional)

### 4. Settings & Customization
- **Gear menu** in top-right corner
- Display preferences
- Workflow explanations
- Glossary of terms

---

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `REACT_APP_API_URL` | `http://localhost:5000/api` | Backend API base URL |
| `REACT_APP_DEBUG` | `false` | Enable debug logging |

---

## Common Issues & Solutions

### Issue: "Backend Connection Failed"

**Solution:**
1. Check that your backend API is running
2. Verify `REACT_APP_API_URL` is correct in `.env.local`
3. Check CORS headers on backend:
   ```
   Access-Control-Allow-Origin: http://localhost:5173
   Access-Control-Allow-Methods: POST, GET, OPTIONS
   Access-Control-Allow-Headers: Content-Type
   ```

### Issue: "CORS Error"

**Solution:**
Backend must have CORS enabled. Example with Express.js:

```javascript
const cors = require('cors');
app.use(cors({
  origin: ['http://localhost:5173', 'https://yourdomain.com'],
  methods: ['POST', 'GET', 'OPTIONS'],
  allowedHeaders: ['Content-Type']
}));
```

### Issue: "File Upload Fails"

**Solution:**
1. Check file size (max 10MB by default)
2. Verify CSV has required columns: `sender`, `receiver`, `amount`, `timestamp`
3. Check backend file upload route is working:
   ```bash
   curl -X POST -F "file=@test.csv" http://localhost:5000/api/validate
   ```

### Issue: "Results Not Displaying"

**Solution:**
1. Open browser DevTools → Network tab
2. Check `/api/analyze` request
3. Verify response includes `accounts`, `rings`, `edges`
4. Check response format matches API contract

---

## Development

### Running Tests

```bash
# Run all tests
npm run test

# Watch mode
npm run test:watch
```

### Building for Production

```bash
# Build optimized bundle
npm run build

# Preview production build locally
npm run preview
```

### Linting

```bash
# Check for code issues
npm run lint

# Auto-fix issues (where possible)
npm run lint -- --fix
```

---

## API Reference

For detailed API endpoint documentation, see `BACKEND_INTEGRATION.md`.

Key endpoints:

| Method | Endpoint | Purpose |
|--------|----------|---------|
| `POST` | `/api/validate` | Validate CSV file |
| `POST` | `/api/analyze` | Run full analysis |
| `GET` | `/api/cases` | Get case history |
| `GET` | `/api/cases/:caseId` | Get case details |
| `GET` | `/api/health` | Health check |

---

## Performance Optimization

### Frontend
- **Code Splitting**: Pages loaded on-demand
- **Memoization**: Components use React.memo to prevent re-renders
- **Lazy Loading**: Heavy graph rendering deferred
- **Bundle Size**: Minified & gzipped production build

### Backend Integration
- **Request Debouncing**: API calls batched
- **Error Handling**: Graceful fallbacks for API errors
- **Caching**: Client-side results caching (via React Query)

### Graph Rendering
- **Large Dataset Handling**:
  - Suspicious-only subgraph mode when nodes > 2000
  - Edge aggregation to reduce rendering load
  - Force-directed layout optimization

---

## Security Considerations

### Authentication (If Required)
If your backend requires authentication:

1. Update `src/lib/api.ts`:
```typescript
const token = localStorage.getItem('auth_token');
const headers = {
  'Authorization': `Bearer ${token}`,
  'Content-Type': 'application/json'
};
```

2. Add login page and token management

### HTTPS in Production
- Always use HTTPS for backend connections
- Update `REACT_APP_API_URL` to use `https://`

### CSRF Protection
- Backend should validate CSRF tokens for state-changing requests
- Frontend should include tokens in request headers

---

## Monitoring & Debugging

### Browser DevTools
- **Network Tab**: Monitor API requests/responses
- **Console**: View error messages and debug logs
- **Storage**: Check environment variables loaded correctly

### Server Logs
- Check backend server logs for errors
- Monitor processing time for analysis requests

### Error Tracking (Optional)
Integrate with Sentry for production error tracking:

```typescript
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "your-sentry-dsn",
  environment: process.env.NODE_ENV
});
```

---

## Support & Contributing

For issues:
1. Check the troubleshooting section above
2. Review `BACKEND_INTEGRATION.md` for API issues
3. Open an issue on GitHub with:
   - Error message
   - Steps to reproduce
   - Environment details (OS, Node version, backend URL)

---

## Next Steps

1. ✅ Backend integration configured
2. ✅ Development server running
3. Test with your backend API
4. Deploy to production
5. Monitor performance and user feedback

---

## Additional Resources

- **React Documentation**: https://react.dev
- **Vite Guide**: https://vitejs.dev
- **Shadcn UI**: https://ui.shadcn.com
- **Zustand**: https://github.com/pmndrs/zustand
- **React Router**: https://reactrouter.com

---

**Last Updated:** 2024
**Version:** 1.0.0
