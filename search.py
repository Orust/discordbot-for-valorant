import os
import sys
import firebase_admin
from firebase_admin import credentials
from firebase_admin import db



# cred = credentials.Certificate("./discord-valorant-matching-firebase-adminsdk-9gsja-2457bb54cd.json")
# firebase_admin.initialize_app(cred)

# import pandas as pd

# import requests
# from bs4 import BeautifulSoup
# import urllib.parse as parse


data = sys.stdin.readline()

dir = os.getcwd()

print(data + ' in python.' + dir)