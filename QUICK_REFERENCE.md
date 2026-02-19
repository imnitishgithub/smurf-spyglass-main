# MuleCatcher Backend Integration - Quick Reference

**For developers who need the essentials fast.**

## Start Here

1. **Set up environment:**
   ```bash
   cp .env.example .env.local
   # Edit .env.local, set REACT_APP_API_URL
   ```

2. **Install & run:**
   ```bash
   npm install
   npm run dev
   ```

3. **Test connectivity:**
   - Upload CSV file
   - Click "Validate"
   - Check browser console for errors
   - If errors → check backend URL in `.env.local`

## API Endpoints at a Glance

```
POST   /api/validate           → Validate CSV
POST   /api/analyze            → Run full analysis
GET    /api/cases              → Get case history
GET    /api/cases/:id          → Get case details
GET    /api/health             → Health check
GET    /api/:caseId/accounts/:aid/explanation   → Account explanation
GET    /api/:caseId/rings/:rid/explanation      → Ring explanation
```

## Request/Response Examples

### POST /api/validate
```bash
curl -X POST -F "file=@data.csv" http://localhost:5000/api/validate
```
**Response:**
```json
{
  "valid": true,
  "result": {
    "columnsDetected": true,
    "timestampValid": true,
    "rowsParsed": 14223,
    "invalidRows": 0
  }
}
```

### POST /api/analyze
```bash
curl -X POST -F "file=@data.csv" http://localhost:5000/api/analyze
```
**Response:**
```json
{
  "case": { "id": "CASE-2024-0001", "nodeCount": 342, ... },
  "suspicious_accounts": [ { "id": "ACC-001", "riskScore": 87, ... } ],
  "fraud_rings": [ { "id": "RING-001", "members": [...], ... } ],
  "edges": [ { "from": "ACC-001", "to": "ACC-002", "amount": 425000 } ],
  "processingTime": 2.3
}
```

## CSV Format

**Required columns:**
```
sender,receiver,amount,timestamp
ACC-001,ACC-002,425000,2024-10-01 10:30:00
ACC-002,ACC-003,410000,2024-10-01 11:15:00
```

**Notes:**
- Timestamp: ISO 8601 or `YYYY-MM-DD HH:mm:ss`
- Amount: numeric (positive)
- All columns required

## Environment Variables

| Variable | Value | Example |
|----------|-------|---------|
| `REACT_APP_API_URL` | Backend base URL | `http://localhost:5000/api` |
| `REACT_APP_DEBUG` | Debug logging | `false` |

## Code Structure

```
src/
├── lib/api.ts              ← API calls here
├── store/useAppStore.ts    ← State & async logic
├── components/UploadManager.tsx  ← File upload UI
└── pages/Analytics.tsx     ← Results display
```

## Common Tasks

### Test Backend Connection
```typescript
// In browser console:
fetch('http://localhost:5000/api/health')
  .then(r => r.json())
  .then(console.log)
```

### Add New API Endpoint
1. Add function in `src/lib/api.ts`
2. Call from `useAppStore.ts`
3. Update UI components as needed

### Debug API Calls
1. Open DevTools → Network tab
2. Upload/analyze file
3. Check request/response
4. Compare with API contract in `BACKEND_INTEGRATION.md`

## Error Messages

| Error | Likely Cause | Fix |
|-------|--------------|-----|
| `Failed to fetch` | Backend not running | Start backend server |
| `CORS error` | Wrong domain origin | Enable CORS in backend |
| `400 Bad Request` | Invalid CSV | Check columns & format |
| `413 Payload Too Large` | File > 10MB | Reduce file size |
| `500 Server Error` | Backend error | Check backend logs |

## Frontend Deployment

```bash
npm run build              # Build production bundle
npm run preview            # Test locally
vercel deploy              # Deploy to Vercel
```

Set production env vars:
```
REACT_APP_API_URL=https://api.yourdomain.com/api
```

## Testing Checklist

Quick validation:
- [ ] Backend running at configured URL
- [ ] Sample CSV uploads without error
- [ ] Validation returns results
- [ ] Analysis completes and shows results
- [ ] Graph renders without console errors
- [ ] Export downloads JSON file

## Key Files & Their Purpose

| File | Contains |
|------|----------|
| `src/lib/api.ts` | All API endpoints |
| `src/store/useAppStore.ts` | State + async logic |
| `src/components/UploadManager.tsx` | Upload UI + error handling |
| `.env.local` | Backend URL configuration |
| `BACKEND_INTEGRATION.md` | Full API reference |
| `SETUP_GUIDE.md` | Detailed setup instructions |

## Testing Endpoints Manually

```bash
# Health check
curl http://localhost:5000/api/health

# Validate CSV
curl -X POST -F "file=@test.csv" \
  http://localhost:5000/api/validate

# Run analysis
curl -X POST -F "file=@test.csv" \
  http://localhost:5000/api/analyze
```

## Browser DevTools Tips

1. **Network Tab**
   - Monitor `/api/analyze` request
   - Check response format
   - Verify status codes (200 = success)

2. **Console Tab**
   - See error messages
   - Check for CORS issues
   - Debug log statements

3. **Application Tab**
   - Check env vars loaded
   - View localStorage/cookies

## Performance Targets

| Metric | Target |
|--------|--------|
| Page load | < 3 sec |
| CSV validation | < 1 sec |
| Analysis (1K rows) | 2-5 sec |
| Graph render (500 nodes) | < 2 sec |

## Troubleshooting Workflow

1. **Frontend won't start?**
   - Check Node version (16+)
   - Clear `node_modules` → reinstall
   - Check port 5173 not in use

2. **API calls failing?**
   - Check backend URL in `.env.local`
   - Verify backend running on that port
   - Check CORS headers

3. **Results not showing?**
   - Open Network tab
   - Check `/api/analyze` response
   - Verify format matches contract
   - Check console for errors

4. **Graph rendering slowly?**
   - Check node count
   - Try suspicious-only mode
   - Check browser console for errors

## Links & Resources

- **API Reference**: `BACKEND_INTEGRATION.md`
- **Setup Guide**: `SETUP_GUIDE.md`
- **Integration Tests**: `INTEGRATION_CHECKLIST.md`
- **Full Summary**: `INTEGRATION_SUMMARY.md`
- **This Quick Ref**: `QUICK_REFERENCE.md`

## Critical Code Snippets

### Call an API endpoint
```typescript
import { analyzeCSV } from "@/lib/api";

try {
  const response = await analyzeCSV(file);
  console.log("Results:", response);
} catch (error) {
  console.error("Failed:", error);
}
```

### Add to store
```typescript
// In useAppStore.ts
myAction: async () => {
  try {
    const data = await apiCall();
    set({ stateData: data });
  } catch (error) {
    console.error(error);
  }
}
```

### Update .env
```bash
# 1. Copy template
cp .env.example .env.local

# 2. Edit file (or set via Vercel dashboard)
REACT_APP_API_URL=http://localhost:5000/api
```

## Support Matrix

| Issue | Document | Section |
|-------|----------|---------|
| "How do I set up?" | SETUP_GUIDE.md | Quick Start |
| "API contract?" | BACKEND_INTEGRATION.md | All endpoints |
| "How to test?" | INTEGRATION_CHECKLIST.md | API Endpoint Testing |
| "Deploy steps?" | SETUP_GUIDE.md | Deployment |
| "What was done?" | INTEGRATION_SUMMARY.md | Overview |
| "Quick help?" | QUICK_REFERENCE.md | This file |

---

**Pro Tips:**
- 💡 Use `curl` to test backend endpoints directly
- 💡 Check Network tab first when things fail
- 💡 Backend URL mistakes are the #1 issue
- 💡 CORS errors need backend config changes
- 💡 See SETUP_GUIDE.md for more detailed help

**Version:** 1.0.0 | **Last Updated:** 2024-02-20
