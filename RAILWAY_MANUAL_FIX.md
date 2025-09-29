# 🚀 Manual Fix: Railway Backend Deployment

Since you already have a Railway project, here's how to fix it manually through the Railway dashboard:

## 🎯 **Go to your Railway Project:**
https://railway.com/project/0a7b2e49-3fd6-427c-9a7f-ea9224f92d6d/service/38a13c88-f52f-48f2-9d4c-8c9db5526e5f

## 🔧 **Step 1: Check Environment Variables**

In your Railway dashboard, go to the **Variables** tab and ensure these are set:

```env
PORT=4000
NODE_ENV=production
MONGODB_URI=mongodb+srv://Useradmin:Play%40123Dehradun@makemyknot.rlnjjl7.mongodb.net/makemyknot?retryWrites=true&w=majority&appName=Makemyknot
JWT_SECRET=super-secret-jwt-key-for-makemyknot-production
CLIENT_URL=https://makemyknot.com
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
BCRYPT_SALT_ROUNDS=12
```

## 🚀 **Step 2: Trigger Deployment**

1. Go to the **Deployments** tab
2. Click **Deploy** or **Redeploy** button
3. Wait for deployment to complete (should turn green)

## 🌐 **Step 3: Get Your Railway URL**

1. In your Railway dashboard, look for the **Domain** section
2. Copy the URL (it should look like: `https://web-production-XXXXX.up.railway.app`)
3. This is your backend API URL

## 🔗 **Step 4: Update Vercel Frontend**

1. Go to your Vercel dashboard: https://vercel.com/dashboard
2. Find your project (makemyknot.com)
3. Go to **Settings** → **Environment Variables**
4. Add or update:
   - **Name:** `NEXT_PUBLIC_API_URL`
   - **Value:** `https://YOUR-RAILWAY-URL.up.railway.app/api` (replace with your actual Railway URL)
5. **Important:** Redeploy your frontend after updating

## 🧪 **Step 5: Test Everything**

Once deployed, test these URLs (replace with your actual Railway URL):

1. **Health check:** `https://YOUR-RAILWAY-URL.up.railway.app/api/health`
   - Should return: `{"status":"OK","timestamp":"...","environment":"production","version":"1.0.0"}`

2. **Leads endpoint:** `https://YOUR-RAILWAY-URL.up.railway.app/api/leads/admin`
   - Should return: `{"status":"success","results":X,"data":{"leads":[...]}}`

3. **Test form submission** on makemyknot.com
   - Fill out any form
   - Check if data appears in MongoDB

## 🔍 **Common Issues & Solutions:**

### If deployment fails:
- Check the **Logs** tab in Railway dashboard
- Ensure all environment variables are set correctly
- Make sure your `makemyknot-backend` directory has `package.json`

### If API returns 404:
- Verify the Railway URL is correct
- Check if the service is running in Railway dashboard
- Test with `/api/health` endpoint first

### If data still doesn't save:
- Check browser console for errors (F12 → Console)
- Verify `NEXT_PUBLIC_API_URL` is set correctly in Vercel
- Make sure frontend was redeployed after updating env var

## 📞 **Quick Status Check:**

Run this to test your Railway deployment:
```bash
curl "https://YOUR-RAILWAY-URL.up.railway.app/api/health"
```

## 🎉 **Expected Result:**

Once everything is working:
- ✅ Railway backend will be live and accessible
- ✅ Form submissions on makemyknot.com will save to MongoDB
- ✅ You can see data in your admin dashboard
- ✅ New leads will appear in your `leads` collection

**Need the automated approach?** Run: `./fix-railway-deployment.sh`

---

💡 **Tip:** The key issue is that your frontend is trying to connect to `localhost:4000/api` instead of your Railway URL. Once you update `NEXT_PUBLIC_API_URL` and redeploy, everything will work!