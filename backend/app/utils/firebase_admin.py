import firebase_admin
from firebase_admin import credentials, firestore
from app.config import settings
import os

# Global Firestore client
db = None

def initialize_firebase():
    """Initialize Firebase Admin SDK"""
    global db
    
    if not firebase_admin._apps:
        try:
            # Check if credentials file exists
            if os.path.exists(settings.FIREBASE_CREDENTIALS_PATH):
                cred = credentials.Certificate(settings.FIREBASE_CREDENTIALS_PATH)
                firebase_admin.initialize_app(cred)
                print("✅ Firebase Admin SDK initialized successfully")
            else:
                print(f"⚠️  Firebase credentials not found at: {settings.FIREBASE_CREDENTIALS_PATH}")
                print("⚠️  Running without Firebase - some features will be disabled")
                return None
        except Exception as e:
            print(f"❌ Error initializing Firebase: {e}")
            return None
    
    # Get Firestore client
    db = firestore.client()
    return db

def get_firestore_client():
    """Get Firestore client (lazy initialization)"""
    global db
    if db is None:
        db = initialize_firebase()
    return db

# Initialize on module import
initialize_firebase()