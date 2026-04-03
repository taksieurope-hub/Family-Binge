# -*- coding: utf-8 -*-
from pymongo import MongoClient
import os

_client = None

def get_mongo_db():
    global _client
    if _client is None:
        uri = os.environ.get("MONGODB_URI")
        if not uri:
            return None
        _client = MongoClient(uri)
    return _client["familybinge"]

def sync_user(user_data: dict):
    try:
        db = get_mongo_db()
        if not db:
            return
        users = db["users"]
        users.update_one(
            {"uid": user_data["uid"]},
            {"$set": user_data},
            upsert=True
        )
    except Exception as e:
        print(f"MongoDB sync error: {e}")

def get_all_users():
    try:
        db = get_mongo_db()
        if not db:
            return []
        return list(db["users"].find({}, {"_id": 0}))
    except Exception as e:
        print(f"MongoDB get users error: {e}")
        return []
