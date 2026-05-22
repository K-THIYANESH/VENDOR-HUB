import os

from dotenv import load_dotenv
from pymongo import MongoClient

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI") or "mongodb://localhost:27017/"

client = MongoClient(MONGO_URI)

db = client["vendorhub"]
