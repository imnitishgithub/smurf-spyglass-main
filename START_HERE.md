# 🚀 START HERE - MuleCatcher Backend Integration

## What's New ✅

Your MuleCatcher frontend is now fully integrated with backend API requirements. Here's everything you need to know.

---

## Quick Setup (5 minutes)

### 1️⃣ Configure Backend URL
```bash
cp .env.example .env.local
```

Edit `.env.local` and set your backend URL:
```
REACT_APP_API_URL=http://localhost:5000/api
```

### 2️⃣ Start Development
```bash
npm install
npm run dev
```

### 3️⃣ Test Integration
- Open http://localhost:5173
- Upload a CSV file with columns: `sender`, `receiver`, `amount`, `timestamp`
- Click "Validate" to test backend connection
- Click "Run Detection" to run analysis

**That's it!** Your frontend is now talking to the backend.

---

## What Was Integrated

### ✅ API Service Layer
- File validation endpoint
- Full analysis endpoint
- Case history retrieval
- Results export functionality
- Error handling with user-friendly messages

### ✅ Enhanced UI
- Real-time validation feedback
- Clear error messages
- Toast notifications
- Professional error displays

### ✅ Full Documentation
- **6 comprehensive guides** (see below)
- **API reference** with examples
- **Testing checklist**
- **Deployment options**
- **Troubleshooting guide**

---

## 📚 Documentation (Read These)

| Document | What It Is | When to Read |
|----------|-----------|--------------|
| **[README.md](./README.md)** | Project overview | First - quick overview |
| **[QUICK_REFERENCE.md](./QUICK_REFERENCE.md)** | Fast developer ref | When you need quick answers |
| **[SETUP_GUIDE.md](./SETUP_GUIDE.md)** | Detailed setup | For development & deployment |
| **[BACKEND_INTEGRATION.md](./BACKEND_INTEGRATION.md)** | API documentation | When building/debugging |
| **[INTEGRATION_CHECKLIST.md](./INTEGRATION_CHECKLIST.md)** | Testing procedures | Before going live |
| **[IMPLEMENTATION_COMPLETE.md](./IMPLEMENTATION_COMPLETE.md)** | What was done | If you want details |

---

## 🔗 API Endpoints (What the Frontend Uses)

| Endpoint | Purpose |
|----------|---------|
| `POST /api/validate` | Validate CSV before analysis |
| `POST /api/analyze` | Run fraud detection analysis |
| `GET /api/cases` | Get previous analyses |
| `GET /api/cases/:id` | Get analysis details |
| `GET /api/health` | Check if backend is running |

**Full API reference:** See `BACKEND_INTEGRATION.md`

---

## ⚡ Common Commands

```bash
# Development
npm run dev              # Start dev server
npm run build            # Build for production
npm run preview          # Preview production build
npm run lint             # Check code quality
npm run test             # Run tests

# Deployment
npm run build            # Build optimized bundle
vercel deploy            # Deploy to Vercel
```

---

## 🐛 Troubleshooting Quick Guide

### Problem: "Cannot connect to backend"
**Solution:**
1. Check backend is running at the URL in `.env.local`
2. Verify the URL is correct
3. Check backend has CORS enabled

### Problem: "File upload fails"
**Solution:**
1. Check CSV has required columns: `sender`, `receiver`, `amount`, `timestamp`
2. Check file size (max 10MB)
3. Check timestamp format (ISO 8601 or YYYY-MM-DD HH:mm:ss)

### Problem: "Results don't show"
**Solution:**
1. Open DevTools → Network tab
2. Check `/api/analyze` response
3. Look for error messages in browser console
4. See `SETUP_GUIDE.md` troubleshooting section

**Can't find the answer?** → See `SETUP_GUIDE.md` or `QUICK_REFERENCE.md`

---

## 🚀 Deployment (3 Options)

### Option 1: Vercel (Easiest)
```bash
vercel deploy
# Set REACT_APP_API_URL in Vercel dashboard
```

### Option 2: Docker
```bash
docker build -t mulecatcher .
docker run -p 3000:3000 -e REACT_APP_API_URL=... mulecatcher
```

### Option 3: Traditional Server
```bash
npm run build
# Serve dist/ folder with nginx/Apache
```

**Detailed instructions:** See `SETUP_GUIDE.md` → Deployment section

---

## ✅ Before You Deploy

**Use the Testing Checklist** (`INTEGRATION_CHECKLIST.md`):

- [ ] Backend API responding to health checks
- [ ] CSV validation working
- [ ] Full analysis running successfully
- [ ] Results displaying in UI
- [ ] Error handling working
- [ ] Export functionality working

---

## 📁 Project Structure

```
Your App
├── src/lib/api.ts          ← API calls to backend (NEW!)
├── src/store/useAppStore.ts ← State management (UPDATED!)
├── src/components/UploadManager.tsx ← Upload UI (UPDATED!)
├── .env.local              ← Backend URL (CREATE THIS!)
└── ...rest of your app
```

All the backend integration is in `src/lib/api.ts` - that's where API calls happen.

---

## 🎯 Next Steps

### Today
1. ✅ Set up `.env.local` with your backend URL
2. ✅ Run `npm install && npm run dev`
3. ✅ Test with a sample CSV file

### Before Going Live
1. Run the testing checklist (`INTEGRATION_CHECKLIST.md`)
2. Test all error scenarios
3. Performance test with real data
4. Verify backend security

### After Deployment
1. Monitor error rates
2. Check response times
3. Gather user feedback
4. Keep documentation updated

---

## 💡 Pro Tips

**Using curl to test backend directly:**
```bash
# Health check
curl http://localhost:5000/api/health

# Validate CSV
curl -X POST -F "file=@test.csv" http://localhost:5000/api/validate

# Run analysis
curl -X POST -F "file=@test.csv" http://localhost:5000/api/analyze
```

**Use DevTools Network tab** to see API requests/responses

**Check browser console** for error messages

**Keep .env.local private** - don't commit to git

---

## 📖 Reading Path

**If you have 5 minutes:** Read this file and `QUICK_REFERENCE.md`

**If you have 30 minutes:** Read `README.md` and `SETUP_GUIDE.md`

**If you have 1 hour:** Read all documentation

**If you have 5 minutes before deploying:** Use `INTEGRATION_CHECKLIST.md`

---

## 🆘 Need Help?

### Check These First:
1. `QUICK_REFERENCE.md` - Fast answers
2. `SETUP_GUIDE.md` - Troubleshooting section
3. `BACKEND_INTEGRATION.md` - API details
4. Browser DevTools → Network tab

### Still Stuck?
- Check the error message carefully
- Search documentation for keywords
- Check backend logs
- Test with curl first

---

## 📊 What Your Frontend Now Does

```
User uploads CSV
    ↓
Frontend validates via /api/validate
    ↓
Backend returns validation results
    ↓
User clicks "Run Detection"
    ↓
Frontend sends file to /api/analyze
    ↓
Backend performs graph analysis
    ↓
Frontend receives accounts, rings, edges
    ↓
UI displays results in dashboard & graph
    ↓
User can export, explore, and investigate
```

---

## 🎓 Key Files to Know

| File | What It Does |
|------|--------------|
| `.env.local` | Store your backend URL |
| `src/lib/api.ts` | All API calls go here |
| `src/store/useAppStore.ts` | State management |
| `src/components/UploadManager.tsx` | File upload UI |
| `README.md` | Project overview |

---

## ✨ Features Ready to Use

- ✅ CSV file upload with drag-and-drop
- ✅ Real-time file validation
- ✅ Full fraud detection analysis
- ✅ Interactive results dashboard
- ✅ Transaction graph visualization
- ✅ Risk score and pattern detection
- ✅ JSON export of results
- ✅ Fraud ring analysis
- ✅ Professional error handling
- ✅ Toast notifications

---

## 🎉 You're All Set!

Your frontend is ready to integrate with your backend. 

**Next:** Set up `.env.local` and start testing!

```bash
cp .env.example .env.local
# Edit .env.local with your backend URL
npm run dev
```

---

**Questions?** → See the documentation files  
**Testing?** → Use `INTEGRATION_CHECKLIST.md`  
**Deploying?** → Follow `SETUP_GUIDE.md`  

**Happy analyzing! 🚀**

---

**Version:** 1.0.0  
**Status:** ✅ Ready to Use  
**Last Updated:** 2024-02-20
