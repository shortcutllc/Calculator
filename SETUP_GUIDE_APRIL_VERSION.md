# Infrastructure Setup Guide

## 1. Development Environment Setup

### Version Control
```bash
# Create and switch to development branch
git checkout -b feature/proposal-system

# Create .gitignore
echo "node_modules/
.env
firebase-config.js
*.log" > .gitignore
```

### Local Development
1. Install Node.js and npm if not already installed
2. Create a `package.json`:
```bash
npm init -y
```

3. Install development dependencies:
```bash
npm install --save-dev firebase-tools
```

## 2. Firebase Project Setup

### Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add Project"
3. Name: "Shortcut Event Calculator"
4. Enable Google Analytics (optional)
5. Create project

### Set Up Development Environment
1. In Firebase Console, create a new app:
   - Click "Add app"
   - Select "Web" platform
   - Register app with nickname "Shortcut Event Calculator Dev"

2. Configure Authentication:
   - Go to Authentication > Sign-in method
   - Enable Email/Password
   - Configure authorized domains

3. Set Up Storage:
   - Go to Storage
   - Click "Get Started"
   - Choose location
   - Set up rules:
   ```javascript
   rules_version = '2';
   service firebase.storage {
     match /b/{bucket}/o {
       match /proposals/{proposalId}/logos/{fileName} {
         allow read: if true;
         allow write: if request.auth != null;
       }
     }
   }
   ```

4. Set Up Firestore:
   - Go to Firestore Database
   - Click "Create Database"
   - Start in test mode
   - Choose location
   - Set up rules:
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       // Proposals collection
       match /proposals/{proposalId} {
         allow read: if true;
         allow write: if request.auth != null;
         
         // Proposal versions subcollection
         match /versions/{versionId} {
           allow read: if true;
           allow write: if request.auth != null;
         }
         
         // Proposal history subcollection
         match /history/{historyId} {
           allow read: if true;
           allow write: if request.auth != null;
         }
       }
       
       // Users collection for proposal management
       match /users/{userId} {
         allow read: if request.auth != null;
         allow write: if request.auth.uid == userId;
         
         // User's proposals subcollection
         match /proposals/{proposalId} {
           allow read: if request.auth.uid == userId;
           allow write: if request.auth.uid == userId;
         }
       }
     }
   }
   ```

5. Set Up Firestore Indexes:
   - Create composite indexes for:
     - Querying proposals by status and date
     - Sorting proposals by version
     - Filtering proposals by client name
     - Searching proposal history

### Set Up Production Environment
1. Repeat the above steps for production
2. Use more restrictive security rules for production
3. Set up proper domain restrictions

## 3. Security Configuration

### CORS Configuration
1. Create `cors.json`:
```json
[
  {
    "origin": ["http://localhost:8000", "https://yourdomain.com"],
    "method": ["GET", "POST", "PUT", "DELETE"],
    "maxAgeSeconds": 3600
  }
]
```

2. Deploy CORS configuration:
```bash
gsutil cors set cors.json gs://your-bucket
```

### API Key Restrictions
1. Go to Google Cloud Console
2. Navigate to APIs & Services > Credentials
3. Find your Firebase API key
4. Add application restrictions:
   - HTTP referrers
   - IP addresses
5. Add API restrictions:
   - Firebase Admin SDK
   - Firebase Authentication API
   - Cloud Firestore API
   - Firebase Storage API

## 4. Environment Configuration

### Create Environment Files
1. Create `.env.development`:
```
FIREBASE_API_KEY=your_dev_api_key
FIREBASE_AUTH_DOMAIN=your_dev_auth_domain
FIREBASE_PROJECT_ID=your_dev_project_id
FIREBASE_STORAGE_BUCKET=your_dev_storage_bucket
FIREBASE_MESSAGING_SENDER_ID=your_dev_messaging_sender_id
FIREBASE_APP_ID=your_dev_app_id
```

2. Create `.env.production`:
```
FIREBASE_API_KEY=your_prod_api_key
FIREBASE_AUTH_DOMAIN=your_prod_auth_domain
FIREBASE_PROJECT_ID=your_prod_project_id
FIREBASE_STORAGE_BUCKET=your_prod_storage_bucket
FIREBASE_MESSAGING_SENDER_ID=your_prod_messaging_sender_id
FIREBASE_APP_ID=your_prod_app_id
```

### Firebase Configuration File
Create `firebase-config.js`:
```javascript
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app);

// Collections
const PROPOSALS_COLLECTION = 'proposals';
const USERS_COLLECTION = 'users';
const VERSIONS_SUBCOLLECTION = 'versions';
const HISTORY_SUBCOLLECTION = 'history';

export {
  app,
  db,
  storage,
  auth,
  PROPOSALS_COLLECTION,
  USERS_COLLECTION,
  VERSIONS_SUBCOLLECTION,
  HISTORY_SUBCOLLECTION
};
```

## Next Steps
After completing this setup:
1. Verify all configurations are working
2. Test authentication flow
3. Test file upload to Storage
4. Test database operations
5. Test proposal versioning system
6. Test proposal history tracking
7. Begin Firebase integration implementation

## Data Structure Alignment
The Firebase setup supports the data structures defined in the project plan:
- Proposal data structure
- Version control system
- History tracking
- Status management
- Client customization options

## Troubleshooting
- If you encounter CORS issues, verify your CORS configuration
- For authentication issues, check your authorized domains
- For storage issues, verify your security rules
- For database issues, check your Firestore rules
- For versioning issues, check the versions subcollection rules
- For history tracking issues, verify the history subcollection setup
- For user-specific proposal access, check the users collection rules 