# 🔗 Connect Frontend to Railway Backend

Your backend is deployed! Now let's connect it to your frontend.

## Step 1: Get Your Railway URL

From your Railway dashboard:
1. Go to your service: https://railway.com/project/0a7b2e49-3fd6-427c-9a7f-ea9224f92d6d/service/38a13c88-f52f-48f2-9d4c-8c9db5526e5f
2. Click on "Settings" tab
3. Look for "Public URL" or "Domains" section
4. Copy your backend URL (should end with `.railway.app`)

**Your backend URL should look like:**
- `https://web-production-XXXX.up.railway.app`
- or `https://makemyknot-backend-production.up.railway.app`

## Step 2: Update Vercel Environment Variables

1. **Go to Vercel Dashboard**: https://vercel.com/dashboard
2. **Find your project**: "make-my-knot-kappa"
3. **Go to Settings > Environment Variables**
4. **Add new variable:**
   - **Name**: `NEXT_PUBLIC_API_URL`
   - **Value**: `https://your-railway-url.railway.app/api`
   - **Environment**: Production, Preview, Development

## Step 3: Redeploy Frontend

After adding the environment variable:
1. Go to **Deployments** tab in Vercel
2. Click **"Redeploy"** on your latest deployment
3. Or make a small change to trigger new deployment

## Step 4: Test Full Platform

Once connected, test these URLs:

### Backend Health Check:
```
https://your-railway-url.railway.app/api/health
```

### Frontend with Backend:
```
https://make-my-knot-kappa.vercel.app/login
https://make-my-knot-kappa.vercel.app/signup  
https://make-my-knot-kappa.vercel.app/admin/migration
```

## Step 5: Run Data Migration

Once connected:
1. Visit: https://make-my-knot-kappa.vercel.app/admin/migration
2. Click "Migrate to MongoDB"
3. Transfer all localStorage data to production database

---

## 🎯 What You'll Have After This:

✅ **Full Stack Platform Live:**
- Frontend: https://make-my-knot-kappa.vercel.app/
- Backend: https://your-railway-url.railway.app/
- Database: MongoDB Atlas (connected)

✅ **Complete Functionality:**
- User registration and login working
- Admin dashboard with real data
- Matching system active
- Real-time features enabled

✅ **Production Ready:**
- Professional wedding matchmaking platform
- Scalable architecture
- Real user signups possible

**Your platform will be 100% functional and ready for users!** 🚀
