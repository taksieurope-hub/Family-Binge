# -*- coding: utf-8 -*-
import json, os

# Load old service account key
key_path = r'C:\Users\edahl\Desktop\Family Binge\backend\serviceAccountKey.json'

if not os.path.exists(key_path):
    print("ERROR: serviceAccountKey.json not found - old key file is gone")
else:
    import firebase_admin
    from firebase_admin import credentials, auth

    cred = credentials.Certificate(key_path)
    app = firebase_admin.initialize_app(cred, name='old_project')
    
    try:
        users = []
        page = auth.list_users(app=app)
        while page:
            for user in page.users:
                users.append({
                    'uid': user.uid,
                    'email': user.email,
                    'created': str(user.user_metadata.creation_timestamp)
                })
            page = page.get_next_page()
        
        print(f"Found {len(users)} users:")
        for u in users:
            print(u)
            
        with open('old_users.json', 'w') as f:
            json.dump(users, f, indent=2)
        print("Saved to old_users.json")
    except Exception as e:
        print(f"ERROR: {e}")
