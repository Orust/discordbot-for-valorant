import sys, pprint

import firebase_admin
from firebase_admin import credentials
from firebase_admin import db
# import pandas as pd
import numpy as np

from bs4 import BeautifulSoup
import requests
import urllib.parse as parse

# data = sys.stdin.readline()

# pprint.pprint(sys.path)
# pprint.pprint(sys.platform) # linux

input_name = sys.argv[1]
# print(input_name + ' in python test.')
user_name = parse.quote(input_name)

load_url = "https://tracker.gg/valorant/profile/riot/" + user_name + "/agents?playlist=competitive&season=all"
load_url2 = "https://tracker.gg/valorant/profile/riot/" + user_name + "/overview?playlist=competitive&season=all"

html = requests.get(load_url)
html2 = requests.get(load_url2)

soup = BeautifulSoup(html.content, "html.parser")
soup_overview = BeautifulSoup(html2.content, "html.parser")
stat_class = soup.select('.agent__stat')
name_class = soup.select('.agent__name-name')
rank_class = soup_overview.select('.value')
matches = []
names = []
# print(name_class)
# print(rank_class)
# rank = rank_class[0].get_text().strip()

for i in range(len(name_class)):
    names.append(name_class[i].get_text())

for i in range(len(stat_class)):
    if i % 6 == 0:
        matches.append(int(stat_class[i].get_text()))

print(names)
print(matches)
# print(rank)
# print(soup.find_all(class_="agent__stat"))