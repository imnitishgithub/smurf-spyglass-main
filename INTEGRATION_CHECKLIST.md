# Backend Integration Checklist

Use this checklist to ensure the frontend is properly integrated with your backend API.

## Pre-Integration Setup

- [ ] Backend API server is running and accessible
- [ ] Backend implements all required endpoints (see BACKEND_INTEGRATION.md)
- [ ] Backend has CORS enabled for frontend domain
- [ ] Backend accepts multipart/form-data file uploads
- [ ] Backend validates and processes CSV files correctly

## Frontend Configuration

- [ ] `.env.local` file created with correct `REACT_APP_API_URL`
- [ ] Backend URL verified to be accessible from frontend
- [ ] Frontend dependencies installed (`npm install`)
- [ ] Development server runs without errors (`npm run dev`)

## API Endpoint Testing

### Health Check
```bash
curl http://localhost:5000/api/health
```
- [ ] Responds with 200 status
- [ ] Response format: `{ "status": "healthy" }`

### CSV Validation
```bash
curl -X POST -F "file=@test.csv" http://localhost:5000/api/validate
```
- [ ] Accepts CSV file upload
- [ ] Returns validation results with correct format
- [ ] Validates required columns (sender, receiver, amount, timestamp)
- [ ] Reports invalid rows and duplicate transactions

### CSV Analysis
```bash
curl -X POST -F "file=@test.csv" http://localhost:5000/api/analyze
```
- [ ] Returns case object with all required fields
- [ ] Returns suspicious_accounts array with risk scores
- [ ] Returns fraud_rings array with member lists
- [ ] Returns edges array with transaction flows
- [ ] Includes processingTime field
- [ ] Response structure matches API contract (BACKEND_INTEGRATION.md)

### Case History
```bash
curl http://localhost:5000/api/cases
```
- [ ] Returns array of previous case runs
- [ ] Each case has required fields (id, date, fileName, datasetSize, etc.)

### Get Case Details
```bash
curl http://localhost:5000/api/cases/CASE-2024-0001
```
- [ ] Returns full analysis data for specific case
- [ ] Format matches /analyze endpoint response

## Frontend Testing

### Upload Page
- [ ] File drag-and-drop works
- [ ] File picker dialog opens on click
- [ ] Selected filename displays
- [ ] File size shows in KB
- [ ] Required columns list displays

### Validation
- [ ] "Validate" button enabled when file selected
- [ ] Validation results display after clicking button
- [ ] Columns detected are shown correctly
- [ ] Timestamp format validation passes
- [ ] Amount numeric validation passes
- [ ] Row count displays correctly
- [ ] Error messages display if validation fails

### Analysis
- [ ] "Run Detection" button enabled when file selected
- [ ] Processing indicator shows during analysis
- [ ] Completion message appears when done
- [ ] Processing time displays accurately
- [ ] Navigation to Analytics page works
- [ ] Navigation to Graph page works
- [ ] Error messages display if analysis fails

### Results Dashboard
- [ ] Summary metrics card displays:
  - [ ] Total Accounts Analyzed
  - [ ] Suspicious Accounts Flagged
  - [ ] Fraud Rings Detected
  - [ ] Processing Time
- [ ] Suspicious Accounts table shows:
  - [ ] Account IDs
  - [ ] Risk scores (0-100)
  - [ ] Risk level badges (colored)
  - [ ] Detected patterns
  - [ ] Ring IDs
- [ ] Suspicious Accounts table features:
  - [ ] Sortable by risk score
  - [ ] Search by Account ID
  - [ ] Filter by Risk Level
  - [ ] Filter by Pattern Type
- [ ] Fraud Ring Summary table shows:
  - [ ] Ring IDs
  - [ ] Member counts
  - [ ] Pattern types
  - [ ] Risk scores
  - [ ] "View Ring in Graph" buttons

### Transaction Graph
- [ ] Graph renders without errors
- [ ] Nodes display for accounts
- [ ] Edges display for transactions
- [ ] Nodes are colored by risk level:
  - [ ] Gray for normal accounts
  - [ ] Green border for LOW risk
  - [ ] Yellow border for MEDIUM risk
  - [ ] Orange border for HIGH risk
  - [ ] Red glow for CRITICAL risk
- [ ] Graph controls work:
  - [ ] Zoom in/out
  - [ ] Pan around
  - [ ] Node hover shows tooltip
  - [ ] Node click shows details
  - [ ] Toggle suspicious-only view
- [ ] Suspicious subgraph mode:
  - [ ] Activates when nodes > 2000
  - [ ] Banner displays explaining optimization
  - [ ] Only suspicious nodes shown
  - [ ] Performance acceptable

### Export Functionality
- [ ] Export button present
- [ ] JSON export downloads successfully
- [ ] Downloaded file contains full analysis
- [ ] File format is valid JSON

## Error Handling

### Network Errors
- [ ] Connection failure shows helpful error message
- [ ] Backend downtime handled gracefully
- [ ] Offline mode has fallback (sample data)
- [ ] Toast notifications appear for errors

### Validation Errors
- [ ] Missing columns handled with clear message
- [ ] Invalid timestamp format reported
- [ ] Duplicate transactions counted and shown
- [ ] Non-numeric amounts detected

### Analysis Errors
- [ ] File too large error handled
- [ ] Timeout errors display message
- [ ] Backend errors propagate to frontend
- [ ] User can retry analysis

## Browser Compatibility

- [ ] Chrome/Edge (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Mobile browsers (if applicable)

## Performance Testing

- [ ] Frontend loads in < 3 seconds
- [ ] CSV upload doesn't freeze UI
- [ ] Graph renders smoothly for 2000+ nodes
- [ ] Results dashboard scrolls without lag
- [ ] Table sorting doesn't cause slowdown

## Security Testing

- [ ] No sensitive data in browser console
- [ ] API requests include proper headers
- [ ] File uploads validated on backend
- [ ] XSS protections in place
- [ ] CORS properly configured
- [ ] HTTPS used in production

## Documentation

- [ ] README.md updated with setup instructions
- [ ] .env.example file created with all variables
- [ ] API contract documented (BACKEND_INTEGRATION.md)
- [ ] Setup guide completed (SETUP_GUIDE.md)
- [ ] This checklist completed and signed off

## Deployment Preparation

- [ ] Production build tested (`npm run build && npm run preview`)
- [ ] Environment variables configured for production
- [ ] Backend API URL set correctly for production
- [ ] CORS configured for production domain
- [ ] Error logging configured (optional: Sentry)
- [ ] Performance monitoring setup (optional)

## Post-Deployment Testing

After deploying to production:

- [ ] Health endpoint accessible
- [ ] File upload works
- [ ] Validation returns correct results
- [ ] Analysis completes successfully
- [ ] Results display properly
- [ ] Graph renders without errors
- [ ] Export functionality works
- [ ] No console errors in production
- [ ] Response times acceptable

## Sign-Off

| Role | Name | Date | Signature |
|------|------|------|-----------|
| Frontend Dev | __________ | __________ | __________ |
| Backend Dev | __________ | __________ | __________ |
| QA | __________ | __________ | __________ |

---

## Troubleshooting Quick Reference

| Issue | Solution |
|-------|----------|
| "Cannot POST /api/analyze" | Check backend is running and endpoint exists |
| CORS Error | Enable CORS headers in backend, check domain |
| "Failed to validate file" | Check CSV has required columns |
| Results not displaying | Verify API response format matches contract |
| Graph not rendering | Check edge count, try suspicious-only mode |
| Validation takes too long | May indicate backend performance issue |

---

## Notes

Use this space for additional notes or issues encountered:

```
_________________________________________________________________

_________________________________________________________________

_________________________________________________________________
```

---

**Last Updated:** 2024-02-20
**Backend Integration Status:** ✅ COMPLETE
