# MuleCatcher Backend Integration Guide

This document explains how the MuleCatcher frontend integrates with the backend AML detection engine.

## Overview

The frontend is built as a React + TypeScript application that communicates with a backend API server. All graph analysis, fraud ring detection, and risk scoring happens on the backend.

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend (React/TypeScript)              │
│  - File Upload                                              │
│  - CSV Validation                                           │
│  - Graph Visualization (Cytoscape.js / D3.js)              │
│  - Results Dashboard                                        │
│  - Export Functionality                                     │
└────────────────────┬────────────────────────────────────────┘
                     │
                     │ HTTP/REST API
                     │
┌────────────────────▼────────────────────────────────────────┐
│                  Backend API Server                         │
│  - CSV Parsing & Validation                                │
│  - Transaction Graph Construction                          │
│  - Pattern Detection (Cycles, Smurfing, Shells)           │
│  - Fraud Ring Clustering                                   │
│  - Risk Scoring & Coordination Strength Calculation       │
│  - False-Positive Mitigation                              │
│  - Result Serialization                                    │
└─────────────────────────────────────────────────────────────┘
```

## API Endpoints

### 1. **POST /api/validate**
Validate a CSV file before analysis.

**Request:**
- Content-Type: `multipart/form-data`
- Body: CSV file

**Response:**
```json
{
  "valid": true,
  "result": {
    "columnsDetected": true,
    "timestampValid": true,
    "amountNumeric": true,
    "amountPositive": true,
    "duplicateTxCount": 0,
    "rowsParsed": 14223,
    "invalidRows": 0,
    "columns": ["sender", "receiver", "amount", "timestamp", "transaction_id"]
  }
}
```

---

### 2. **POST /api/analyze**
Submit a CSV file for full AML analysis.

**Request:**
- Content-Type: `multipart/form-data`
- Body: CSV file
  - **Required Columns:** `sender`, `receiver`, `amount`, `timestamp`
  - **Optional:** `transaction_id` (auto-generated if missing)
  - **Timestamp Format:** ISO 8601 or `YYYY-MM-DD HH:mm:ss`
  - **Max File Size:** 10MB (configurable)

**Response:**
```json
{
  "case": {
    "id": "CASE-2024-0001",
    "date": "2024-10-15",
    "fileName": "transactions.csv",
    "datasetSize": 14200,
    "nodeCount": 342,
    "edgeCount": 1287,
    "txCount": 14200,
    "suspiciousCount": 23,
    "ringCount": 5,
    "processingTime": 2.3,
    "riskExposure": 78,
    "timeWindow": "2024-10-01 → 2024-12-14",
    "topPatterns": ["cycle", "fan-in/fan-out", "shell chain"],
    "riskLevel": "high"
  },
  "suspicious_accounts": [
    {
      "id": "ACC-001",
      "riskScore": 87,
      "confidence": 0.92,
      "ringId": "RING-001",
      "patterns": ["cycle", "high-velocity"],
      "totalIn": 450000,
      "totalOut": 430000,
      "txCount": 23,
      "detectedPatterns": [
        {
          "type": "cycle",
          "description": "Part of circular routing loop with 4 accounts"
        },
        {
          "type": "velocity",
          "description": "High transaction velocity within 48 hours"
        }
      ]
    }
  ],
  "fraud_rings": [
    {
      "id": "RING-001",
      "riskScore": 85,
      "confidence": 0.88,
      "members": ["ACC-001", "ACC-002", "ACC-003", "ACC-004"],
      "patternType": "cycle",
      "cycleLength": 4,
      "avgTxSize": 425000,
      "timeWindow": "2024-10-01 → 2024-10-05",
      "totalFlow": 1700000,
      "coordinationMetrics": {
        "internalDensity": 0.92,
        "timeCompressionIndex": 0.87,
        "flowBalanceIndex": 0.91
      }
    }
  ],
  "edges": [
    {
      "from": "ACC-001",
      "to": "ACC-002",
      "amount": 425000,
      "count": 5
    }
  ],
  "processingTime": 2.3
}
```

---

### 3. **GET /api/cases**
Retrieve case history.

**Response:**
```json
[
  {
    "id": "CASE-2024-0001",
    "date": "2024-10-15",
    "fileName": "transactions.csv",
    "datasetSize": 14200,
    "nodeCount": 342,
    "edgeCount": 1287,
    "txCount": 14200,
    "suspiciousCount": 23,
    "ringCount": 5,
    "processingTime": 2.3,
    "riskExposure": 78,
    "timeWindow": "2024-10-01 → 2024-12-14",
    "topPatterns": ["cycle", "fan-in/fan-out", "shell chain"],
    "riskLevel": "high"
  }
]
```

---

### 4. **GET /api/cases/:caseId**
Retrieve full details of a specific case.

**Response:** Same format as `/api/analyze` response

---

### 5. **GET /api/cases/:caseId/accounts/:accountId/explanation**
Get AI-generated explanation for why an account was flagged.

**Response:**
```json
{
  "explanation": "Account ACC-001 was flagged due to participation in a detected circular routing loop with 4 other accounts. The account received $450,000 in transactions and forwarded $430,000 within a 48-hour window, with minimal value retention. This pattern is consistent with money muling behavior. No merchant-like characteristics detected."
}
```

---

### 6. **GET /api/cases/:caseId/rings/:ringId/explanation**
Get AI-generated explanation for why a fraud ring was flagged.

**Response:**
```json
{
  "explanation": "Ring RING-001 comprises 4 accounts engaged in a closed circular routing loop. The detected pattern shows high coordination strength with 92% internal transaction density and balanced fund flow (91% balance index). Transactions were concentrated within a 4-day window with minimal external activity. This structural pattern indicates coordinated money muling network."
}
```

---

### 7. **POST /api/cases/:caseId/export**
Export analysis results as JSON.

**Response:** Full analysis response (same as `/api/analyze`)

---

### 8. **GET /api/health**
Health check endpoint (optional).

**Response:**
```json
{
  "status": "healthy",
  "version": "1.0.0"
}
```

---

## Setup Instructions

### 1. Configure Environment Variables

Create a `.env.local` file in the project root:

```bash
# Copy the example file
cp .env.example .env.local

# Edit .env.local with your backend URL
REACT_APP_API_URL=http://localhost:5000/api
```

### 2. Start the Frontend

```bash
# Install dependencies
npm install
# or
pnpm install
# or
yarn install

# Start development server
npm run dev
```

The frontend will run on `http://localhost:5173` (or similar).

### 3. Ensure Backend is Running

Make sure your backend API server is accessible at the configured `REACT_APP_API_URL`. The backend should:

- Accept multipart/form-data CSV uploads
- Validate transaction data
- Perform graph analysis
- Return properly formatted JSON responses

---

## Data Types

### Account Object
```typescript
{
  id: string;                    // Unique account identifier
  riskScore: number;             // 0-100 risk score
  confidence: number;            // 0-1 confidence level
  ringId: string | null;         // Associated fraud ring ID
  patterns: string[];            // Detected pattern types
  totalIn: number;               // Total inbound transaction amount
  totalOut: number;              // Total outbound transaction amount
  txCount: number;               // Total transaction count
  scoreBreakdown: ScoreComponent[];  // Detailed score components
}
```

### Ring Object
```typescript
{
  id: string;                    // Unique ring identifier
  riskScore: number;             // 0-100 risk score
  confidence: number;            // 0-1 confidence level
  members: string[];             // Account IDs in the ring
  patternType: string;           // 'cycle', 'fan-in/fan-out', 'shell', 'mixed'
  cycleLength?: number;          // Length of detected cycle
  avgTxSize: number;             // Average transaction size
  timeWindow: string;            // Time range of activity
  totalFlow: number;             // Total money flow in ring
}
```

---

## Error Handling

The API should return appropriate HTTP status codes:

- **200 OK** - Successful request
- **400 Bad Request** - Invalid CSV format or missing required columns
- **413 Payload Too Large** - File exceeds size limit
- **500 Internal Server Error** - Backend processing error

Error response format:
```json
{
  "error": "Description of what went wrong",
  "details": "Optional additional details"
}
```

---

## Frontend State Management

The frontend uses **Zustand** for state management (`src/store/useAppStore.ts`):

- **Upload State:** File selection, validation results
- **Analysis State:** Current case data, accounts, rings, edges
- **UI State:** Selected account/ring, panel visibility, settings
- **Processing State:** Loading indicators, processing time

All API calls are initiated from the store, and results are automatically synced to React components via subscriptions.

---

## Deployment

### Frontend Deployment (Vercel)

```bash
# Deploy to Vercel
vercel deploy

# Set environment variable on Vercel dashboard
REACT_APP_API_URL=https://api.your-domain.com/api
```

### Backend Deployment

Ensure your backend API is:
- Deployed and accessible
- CORS-enabled for your frontend domain
- Using HTTPS in production
- Properly configured for file uploads

---

## Testing the Integration

### 1. Manual Testing

1. Start both frontend and backend
2. Navigate to Home/Upload page
3. Upload a test CSV file
4. Verify validation results appear
5. Run analysis and check results dashboard
6. Verify graph renders with accounts and rings

### 2. Sample CSV Format

```csv
sender,receiver,amount,timestamp
ACC-001,ACC-002,425000,2024-10-01 10:30:00
ACC-002,ACC-003,410000,2024-10-01 11:15:00
ACC-003,ACC-004,395000,2024-10-01 12:00:00
ACC-004,ACC-001,380000,2024-10-01 12:45:00
```

---

## Troubleshooting

### Backend Connection Issues

1. **"Failed to fetch" errors:**
   - Check backend is running
   - Verify `REACT_APP_API_URL` is correct
   - Check CORS headers on backend

2. **Validation errors:**
   - Ensure CSV has required columns: `sender`, `receiver`, `amount`, `timestamp`
   - Check timestamp format matches backend expectations
   - Verify amounts are numeric

3. **Large file issues:**
   - Check file size limit on backend (default 10MB)
   - Consider chunking very large files

---

## Support

For issues with:
- **Frontend:** Check browser console for errors
- **Backend:** Check backend server logs
- **Integration:** Verify API contract matches this documentation
