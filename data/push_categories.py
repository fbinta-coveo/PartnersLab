import openpyxl
import datetime
import json

from coveopush import CoveoPush
from coveopush import Document
from coveopush import CoveoConstants
from datetime import date
from pathlib import Path
import requests
import re
import numpy
import urllib.parse
import csv

org_id = 'demohermesf0ab26mt'
src_id = "demohermesf0ab26mt-vvgcr5a4ofmrczmuzwzoa7ckva"
api_key = "xxd05e7b5d-ab43-4281-80e9-768bc1c4e1ee"
updateSourceStatus = True
deleteOlder = False
dryRun = False
product_count = 0
push = CoveoPush.Push(src_id, org_id, api_key, p_Endpoint = "https://api-eu.cloud.coveo.com/push/v1", p_Mode=CoveoConstants.Constants.Mode.UpdateStream)
docs=[]
categories = {}
categories_label = {}
p2gender = {}
p2group = {}
p2enabled = {}
p2cat = {}
p2cat_label = {}
product_start = 0

def build_full_path(category, parent_map):
    path = []
    while category:  # Traverse up until no parent
        path.append(category)
        category = parent_map.get(category, None)
    return " | ".join(reversed(path))  # Reverse to get the full hierarchy


def getCatPath(category_code):
    cats = []
    while category_code != "master_eco":
        cats.append(category_code)
        category_code = categories[category_code]
    return cats

def catToCoveoCatFacet(cats):
    cattxt = ""
    coveo_cat = []
    for c in reversed(cats):
        if len(cattxt)>0:
            cattxt = cattxt+"|"
        cattxt = cattxt+categories_label[c]
        coveo_cat.append(cattxt)
    return coveo_cat

# Open the file in read mode
# with open("pim/sku.txt", "r") as file:
    # Read all lines into a list (each line will be an element in the array)
#    skus = file.readlines()
# skus = [line.strip() for line in skus]
with open('pim/category.csv') as f:
    reader = csv.DictReader(f, delimiter=';')
    for row in reader:
        main_category = row["code"]
        parent_category = row["parent"]
        categories[main_category] = parent_category
        #categories_label[main_category] = row["label-fr_FR"]
        categories_label[main_category] = row["label-en_US"]

with open('pim/product_V2_publication.csv') as f:
    reader = csv.DictReader(f, delimiter=';')
    for row in reader:
        product_count = product_count +1
        product_number = row["sku"]
        product_cat = row["categories"].split(",")
        all_categories = []
        for cat in product_cat:
            all_categories = all_categories+catToCoveoCatFacet(getCatPath(cat))

        p2cat[product_number] = product_cat
        p2cat_label[product_number] = all_categories
        p2enabled[product_number] = row["enabled"]
        print(f"category load. product {product_count}")

with open('pim/product_V2_sales.csv') as f:
    reader = csv.DictReader(f, delimiter=';')
    for row in reader:
        product_count = product_count +1
        product_number = row["sku"]
        product_cat = row["categories"].split(",")
        all_categories = []
        for cat in product_cat:
            all_categories = all_categories+catToCoveoCatFacet(getCatPath(cat))

        p2cat[product_number] = product_cat
        p2cat_label[product_number] = all_categories
        p2enabled[product_number] = row["enabled"]
        p2gender[product_number] = row["GENDER"]
        p2group[product_number] = row["groups"]
        print(f"category load. product {product_count}")

json_data = [{"id": item, "values":p2cat[item]} for item in p2cat]
with open('p2cat.json', 'w') as json_file:
    json.dump(json_data, json_file, indent=4)

json_data = [{"id": item, "values":p2cat_label[item]} for item in p2cat_label]
with open('p2cat_labels_fr.json', 'w') as json_file:
    json.dump(json_data, json_file, indent=4)

json_data = [{"id": item, "values":p2enabled[item]} for item in p2enabled]
with open('p2enabled.json', 'w') as json_file:
    json.dump(json_data, json_file, indent=4)

json_data = [{"id": item, "values":p2gender[item]} for item in p2gender]
with open('p2gender.json', 'w') as json_file:
    json.dump(json_data, json_file, indent=4)

json_data = [{"id": item, "values":p2group[item]} for item in p2group]
with open('p2group.json', 'w') as json_file:
    json.dump(json_data, json_file, indent=4)