# Google Sheets Integration Setup

## Overview
Your leads and assessment data will be automatically saved to your Google Sheets in real-time when users submit forms.

**Your Spreadsheet:** https://docs.google.com/spreadsheets/d/1QFvu2uBzrmv_ktcNqIzzEUgfCp4ZZ_ExwozppGIaBec/edit?usp=sharing

## Setup Steps

### 1. Enable Google Sheets API

1. Go to [Google Cloud Console](https://console.developers.google.com/)
2. Create a new project or select existing project
3. Enable the Google Sheets API:
   - Go to "APIs & Services" → "Library"
   - Search for "Google Sheets API"
   - Click on it and press "Enable"

### 2. Get API Key

1. Go to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "API Key"
3. Copy the generated API key
4. Click "Restrict Key" and select "Google Sheets API" from the list

### 3. Configure Environment Variable

1. Open `/Users/shivamrai/Make my knot/.env.local`
2. Replace `YOUR_GOOGLE_SHEETS_API_KEY_HERE` with your actual API key:
   ```
   NEXT_PUBLIC_GOOGLE_SHEETS_API_KEY=AIzaSyBvOiM4YIxYX1M3fX4yF3J8K6L9MnOpQ2S
   ```

### 4. Prepare Your Spreadsheet

Your spreadsheet needs two sheets (tabs):

#### Sheet 1: "Leads"
Add these headers in row 1:
```
A1: Timestamp
B1: Name
C1: Email
D1: Phone
E1: Country Code
F1: Date of Birth
G1: Age
H1: Gender Identity
I1: Open to Meeting
J1: Matchmaking Experience
K1: Preferred Age Range
L1: Current Location
M1: Has Biodata
N1: Status
O1: Lead Score
P1: Source
Q1: Created At
```

#### Sheet 2: "Assessments"
Add these headers in row 1:
```
A1: Timestamp
B1: User Name
C1: User Email
D1: User Phone
E1: User Type
F1: Is Complete
G1: Completion Time (min)
H1: Gender
I1: Looking For Gender
J1: Age
K1: Profession
L1: Education Level
M1: Religious Importance
N1: Smoking Habits
O1: Drinking Habits
P1: Children Desire
Q1: Ideal Weekend
R1: Affection Style
S1: Living Situation Preference
T1: Relationship Reasons
U1: Career Opportunity Response
V1: Family Gathering Response
W1: Created At
X1: Completed At
Y1: Source
```

### 5. Make Spreadsheet Public for API Access

1. Click "Share" button on your Google Sheet
2. Change permissions to "Anyone with the link can view"
3. Or add your service account email if using service account authentication

## How It Works

1. **User submits lead form** → Data saves to:
   - ✅ localStorage (instant)
   - ✅ MongoDB (background sync)
   - ✅ Google Sheets (automatic)

2. **User completes assessment** → Data saves to:
   - ✅ MongoDB (direct)
   - ✅ Google Sheets (automatic)

## Data Structure

### Leads Sheet
Each row contains complete lead information including:
- Contact details (name, email, phone)
- Demographics (age, gender, location)
- Preferences (age range, open to meeting)
- Questionnaire responses
- Lead scoring and status

### Assessments Sheet  
Each row contains complete assessment data including:
- User information
- All 14 assessment questions and answers
- Completion status and timing
- Source tracking

## Benefits

✅ **Real-time Data**: Instant access to all submissions
✅ **No Manual Export**: Automatic data capture
✅ **Easy Analysis**: Use Google Sheets tools for filtering/sorting
✅ **Backup**: Additional data backup beyond MongoDB
✅ **Sharing**: Easy to share with team members
✅ **Integration**: Can connect to other Google services

## Troubleshooting

**If data isn't appearing in sheets:**
1. Check API key is correct in `.env.local`
2. Verify Google Sheets API is enabled
3. Ensure sheet names are exactly "Leads" and "Assessments"
4. Check browser console for error messages

**Console logs to look for:**
- `📊 Lead successfully saved to Google Sheets`
- `📊 Assessment successfully saved to Google Sheets`
- `⚠️ Google Sheets sync failed` (if there are issues)

## Security Notes

- API key is client-side visible (use API restrictions)
- Consider service account for production use
- Regularly rotate API keys
- Monitor API usage in Google Cloud Console